import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { KalliColorway } from '../types';
import { VIDEO_SCENES } from '../data/kalliProduct';
import { getAllShoeImages } from '../utils/imageStorage';

interface ProductVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  colorway: KalliColorway;
  initialSceneIndex?: number;
}

export const ProductVideoPlayer: React.FC<ProductVideoPlayerProps> = ({
  isOpen,
  onClose,
  colorway,
  initialSceneIndex = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(initialSceneIndex);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2>(1);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shoeImages, setShoeImages] = useState<Record<string, string | null>>({
    side: null,
    front: null,
    perspective: null,
    top: null,
    rear: null,
    sole: null,
  });
  const [rasterFallbackUrl, setRasterFallbackUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentScene = VIDEO_SCENES[currentSceneIndex] || VIDEO_SCENES[0];
  const totalDuration = VIDEO_SCENES.reduce((sum, s) => sum + s.duration, 0);

  // Load custom uploaded main photos from IndexedDB for this colorway
  useEffect(() => {
    let isMounted = true;
    const loadStoredImages = async () => {
      try {
        const loaded = await getAllShoeImages(colorway.id);
        if (isMounted) {
          setShoeImages(loaded);
        }
      } catch (err) {
        console.warn('Failed to load shoe images for video player:', err);
      }
    };

    if (isOpen) {
      loadStoredImages();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, colorway.id]);

  // Generate canvas raster fallback in case user hasn't uploaded custom photo yet
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw high-res raster sneaker on canvas
    drawVideoRasterSneaker(ctx, canvas.width, canvas.height, colorway.knitColor);
    setRasterFallbackUrl(canvas.toDataURL('image/png'));
  }, [colorway]);

  // Synthesized minimalist ambient audio drone when unmuted
  useEffect(() => {
    if (!isMuted && isOpen) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // Soft sub bass drone
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(65, ctx.currentTime);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(130, ctx.currentTime);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
        }
      } catch (e) {
        console.error('Audio not supported:', e);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isMuted, isOpen]);

  // Main video animation loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = 30 / playbackSpeed;
    const stepDuration = currentScene.duration * 1000;
    const progressPerStep = (100 / stepDuration) * intervalMs;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene
          setCurrentSceneIndex((curr) => (curr + 1) % VIDEO_SCENES.length);
          return 0;
        }
        return prev + progressPerStep;
      });

      // Continuous 360 degree slow rotation in scene 0
      if (currentSceneIndex === 0) {
        setRotationAngle((deg) => (deg + 0.8 * playbackSpeed) % 360);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSceneIndex, currentScene.duration, playbackSpeed]);

  if (!isOpen) return null;

  const handleNextScene = () => {
    setCurrentSceneIndex((curr) => (curr + 1) % VIDEO_SCENES.length);
    setProgress(0);
  };

  const handlePrevScene = () => {
    setCurrentSceneIndex((curr) => (curr - 1 + VIDEO_SCENES.length) % VIDEO_SCENES.length);
    setProgress(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setProgress(pct);
  };

  // Determine active main raster image
  const currentAngleKey =
    currentSceneIndex === 1
      ? 'perspective'
      : currentSceneIndex === 2
      ? 'rear'
      : currentSceneIndex === 3
      ? 'sole'
      : 'side';

  const activeMainImage =
    shoeImages[currentAngleKey] ||
    shoeImages['side'] ||
    shoeImages['front'] ||
    rasterFallbackUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md">
      <div
        ref={containerRef}
        className={`relative w-full max-w-5xl aspect-16/9 bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between ${
          isFullscreen ? 'w-screen h-screen max-w-none rounded-none' : ''
        }`}
      >
        {/* TOP VIDEO HUD OVERLAY */}
        <div className="relative z-30 p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                4K Cinematic Product Video · Scene 0{currentSceneIndex + 1}/0{VIDEO_SCENES.length}
              </p>
              <h3 className="text-sm sm:text-base font-bold text-white font-brand-display">
                {currentScene.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Toggle */}
            <button
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition-colors"
            >
              {playbackSpeed}x
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute soundtrack' : 'Mute soundtrack'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN VIDEO STAGE (PURE RASTER PHOTO - NO VECTOR SVG) */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-radial from-neutral-900 via-neutral-950 to-black select-none">
          {/* Animated Studio Spotlight Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute w-[650px] h-[650px] rounded-full bg-white/5 blur-3xl -top-40 -left-40 animate-pulse" />
            <div className="absolute w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-3xl -bottom-20 -right-20" />
          </div>

          {/* Cinematic Shoe Visual Rendering with Real Photographic Texture */}
          <div
            className={`relative z-10 w-full max-w-[680px] px-8 transition-transform duration-700 ease-out flex items-center justify-center ${
              currentSceneIndex === 1
                ? 'scale-135 -translate-y-3' // Air Capsule Macro Zoom
                : currentSceneIndex === 2
                ? 'scale-120 translate-x-8' // Upper Forefoot Zoom
                : currentSceneIndex === 3
                ? 'scale-115 translate-y-6' // Outsole Low Profile
                : 'scale-105' // 360 Rotation
            }`}
            style={{
              perspective: 1200,
              transformStyle: 'preserve-3d',
            }}
          >
            {activeMainImage && (
              <div
                className="relative w-full flex items-center justify-center transition-transform duration-100 ease-out"
                style={{
                  transform: `perspective(1200px) rotateY(${
                    currentSceneIndex === 0
                      ? Math.sin((rotationAngle * Math.PI) / 180) * 16
                      : 0
                  }deg) rotateX(${
                    currentSceneIndex === 0
                      ? Math.cos((rotationAngle * Math.PI) / 180) * 4
                      : 0
                  }deg)`,
                }}
              >
                {/* Real High-Resolution Photographic Raster Image */}
                <img
                  src={activeMainImage}
                  alt={currentScene.title}
                  className="w-full max-h-[420px] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.85)] select-none pointer-events-none"
                  draggable={false}
                />

                {/* Moving Studio Lighting Glare Sweep across the sneaker photo */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl mix-blend-overlay opacity-35 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 380px at ${
                      50 + Math.sin((rotationAngle * Math.PI) / 180) * 35
                    }% ${45 + Math.cos((rotationAngle * Math.PI) / 180) * 20}%, rgba(255, 255, 255, 0.9), transparent 70%)`,
                  }}
                />

                {/* Dynamic Contact Ground Shadow beneath sole */}
                <div
                  className="absolute -bottom-5 w-[85%] h-8 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0,0,0,0) 75%)',
                    filter: 'blur(9px)',
                    transform: `scaleX(${
                      1 - Math.abs(Math.sin((rotationAngle * Math.PI) / 180)) * 0.15
                    })`,
                  }}
                />
              </div>
            )}

            {/* Interactive Engineering Hotspots */}
            {currentScene.hotspots?.map((hs, i) => (
              <div
                key={i}
                className="absolute z-20 group"
                style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
              >
                <button
                  onClick={() => setActiveHotspot(activeHotspot === hs.label ? null : hs.label)}
                  className="relative w-6 h-6 flex items-center justify-center focus:outline-none cursor-pointer"
                >
                  <span className="absolute w-full h-full rounded-full bg-amber-400/40 animate-ping" />
                  <span className="relative w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-md" />
                </button>

                {/* Hotspot Card / Tooltip */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2.5 bg-neutral-900/95 backdrop-blur-md rounded-lg border border-neutral-700 shadow-xl transition-all pointer-events-none ${
                    activeHotspot === hs.label ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <p className="text-[11px] font-bold text-white tracking-wide">{hs.label}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{hs.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scene Caption Overlay */}
          <div className="absolute bottom-20 inset-x-0 z-20 text-center px-6 pointer-events-none">
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-neutral-200 shadow-lg">
              {currentScene.caption}
            </span>
          </div>
        </div>

        {/* BOTTOM VIDEO CONTROLS BAR */}
        <div className="relative z-30 p-4 bg-neutral-950 border-t border-neutral-800 flex flex-col gap-2.5">
          {/* Progress / Scrubber Bar */}
          <div
            onClick={handleSeek}
            className="w-full h-2 bg-neutral-800 hover:h-3 rounded-full cursor-pointer transition-all relative overflow-hidden group"
          >
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-75 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
            </div>

            {/* Scene Partition Markers */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {VIDEO_SCENES.map((_, i) => (
                <div key={i} className="w-[2px] h-full bg-neutral-950/60" />
              ))}
            </div>
          </div>

          {/* Playback Controls & Scene Selector Tabs */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-white text-neutral-950 flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handlePrevScene}
                className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextScene}
                className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Scene Navigation Tabs */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                {VIDEO_SCENES.map((scene, i) => (
                  <button
                    key={scene.id}
                    onClick={() => {
                      setCurrentSceneIndex(i);
                      setProgress(0);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                      currentSceneIndex === i
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    0{i + 1} {scene.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span>
                {Math.floor((progress / 100) * currentScene.duration)
                  .toString()
                  .padStart(2, '0')}
                :00 / {currentScene.duration.toString().padStart(2, '0')}:05s
              </span>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CANVAS RASTER RENDERER FOR VIDEO (Used only as fallback if no image saved)
// =========================================================================

function drawVideoRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.scale(w / 840, h / 500);

  // Upper
  const grad = ctx.createLinearGradient(100, 100, 700, 350);
  grad.addColorStop(0, knitColor || '#173273');
  grad.addColorStop(1, '#0c1b40');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(98, 220);
  ctx.bezierCurveTo(94, 185, 115, 130, 148, 108);
  ctx.bezierCurveTo(175, 90, 230, 115, 285, 75);
  ctx.bezierCurveTo(310, 56, 332, 50, 348, 58);
  ctx.bezierCurveTo(365, 66, 372, 90, 376, 122);
  ctx.bezierCurveTo(382, 148, 402, 180, 435, 205);
  ctx.bezierCurveTo(475, 235, 540, 258, 630, 270);
  ctx.bezierCurveTo(710, 280, 770, 292, 795, 320);
  ctx.bezierCurveTo(804, 330, 802, 344, 790, 354);
  ctx.bezierCurveTo(770, 370, 700, 375, 620, 374);
  ctx.bezierCurveTo(520, 372, 420, 370, 320, 370);
  ctx.bezierCurveTo(220, 370, 140, 365, 92, 355);
  ctx.bezierCurveTo(75, 330, 76, 270, 98, 220);
  ctx.closePath();
  ctx.fill();

  // Racing Stripes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(172, 195);
  ctx.bezierCurveTo(255, 208, 360, 225, 440, 252);
  ctx.bezierCurveTo(505, 275, 555, 315, 572, 360);
  ctx.bezierCurveTo(552, 355, 505, 320, 460, 290);
  ctx.bezierCurveTo(380, 240, 270, 215, 172, 195);
  ctx.closePath();
  ctx.fill();

  // White sole
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(52, 320);
  ctx.bezierCurveTo(45, 345, 55, 375, 75, 395);
  ctx.bezierCurveTo(105, 425, 210, 428, 340, 426);
  ctx.bezierCurveTo(420, 425, 470, 415, 520, 395);
  ctx.bezierCurveTo(580, 372, 650, 365, 720, 366);
  ctx.bezierCurveTo(770, 366, 805, 350, 812, 335);
  ctx.bezierCurveTo(810, 320, 780, 300, 750, 310);
  ctx.bezierCurveTo(700, 325, 610, 326, 530, 324);
  ctx.bezierCurveTo(430, 322, 340, 320, 230, 322);
  ctx.bezierCurveTo(130, 324, 70, 310, 52, 320);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
