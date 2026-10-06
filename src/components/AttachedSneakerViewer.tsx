import React, { useState, useEffect, useRef } from 'react';
import { Upload, RefreshCw, CheckCircle, FileImage, Sparkles, ArrowUpDown } from 'lucide-react';
import { KalliColorway } from '../types';
import { getAllShoeImages, saveShoeImage, optimizeImageDataUrl } from '../utils/imageStorage';

interface AttachedSneakerViewerProps {
  colorway: KalliColorway;
  viewAngle: 'side' | 'front' | 'perspective' | 'top' | 'rear' | 'sole';
  scale?: number;
  className?: string;
  onImageLoaded?: (url: string) => void;
  isAdminMode?: boolean;
  transitionDirection?: 'up' | 'down' | 'bounce' | null;
  transitionTrigger?: number;
}

export const AttachedSneakerViewer: React.FC<AttachedSneakerViewerProps> = ({
  colorway,
  viewAngle,
  scale = 1.25,
  className = '',
  onImageLoaded,
  isAdminMode = false,
  transitionDirection = null,
  transitionTrigger = 0,
}) => {
  // Cache of custom uploaded sneaker angles for both colorways ('blue' and 'orange')
  const [colorwayImages, setColorwayImages] = useState<Record<string, Record<string, string | null>>>({
    blue: { side: null, front: null, perspective: null, top: null, rear: null, sole: null },
    orange: { side: null, front: null, perspective: null, top: null, rear: null, sole: null },
  });

  // Generated raster canvas fallbacks for both colorways
  const [rasterFallbacks, setRasterFallbacks] = useState<Record<string, Record<string, string>>>({
    blue: {},
    orange: {},
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle 3D Mouse Parallax States
  const [parallax, setParallax] = useState({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
    lightX: 50,
    lightY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isParallaxActive, setIsParallaxActive] = useState(true);

  // Vertical Transition States
  const [displayedColorway, setDisplayedColorway] = useState<KalliColorway>(colorway);
  const [outgoingColorway, setOutgoingColorway] = useState<KalliColorway | null>(null);
  const [outgoingImage, setOutgoingImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'preparing' | 'sliding'>('idle');
  const [activeDirection, setActiveDirection] = useState<'up' | 'down' | 'bounce'>('up');

  const prevColorwayRef = useRef<KalliColorway>(colorway);
  const prevTriggerRef = useRef<number>(transitionTrigger);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Preload stored images from IndexedDB for ALL colorways (blue & orange)
  const loadAllStoredImages = async () => {
    try {
      const [blueImgs, orangeImgs] = await Promise.all([
        getAllShoeImages('blue'),
        getAllShoeImages('orange'),
      ]);
      setColorwayImages({
        blue: blueImgs,
        orange: orangeImgs,
      });
    } catch (err) {
      console.warn('Failed to load shoe images from IndexedDB:', err);
    }
  };

  useEffect(() => {
    loadAllStoredImages();
    window.addEventListener('storage', loadAllStoredImages);
    window.addEventListener('kalli_image_updated', loadAllStoredImages);

    return () => {
      window.removeEventListener('storage', loadAllStoredImages);
      window.removeEventListener('kalli_image_updated', loadAllStoredImages);
    };
  }, []);

  // Track angle position switch for smooth 3D turntable pivot
  const [isAngleChanging, setIsAngleChanging] = useState(false);
  const prevAngleRef = useRef(viewAngle);

  useEffect(() => {
    if (prevAngleRef.current !== viewAngle) {
      prevAngleRef.current = viewAngle;
      setIsAngleChanging(true);
      const timer = setTimeout(() => setIsAngleChanging(false), 240);
      return () => clearTimeout(timer);
    }
  }, [viewAngle]);

  // 2. Generate and cache raster bitmaps for both colorways for the current viewAngle
  useEffect(() => {
    const generateBitmap = (targetColorway: { id: string; knitColor: string; knitAccent?: string; hex: string }) => {
      const canvas = document.createElement('canvas');
      canvas.width = viewAngle === 'front' ? 1000 : 1600;
      canvas.height = viewAngle === 'front' ? 1200 : 960;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      if (viewAngle === 'front') {
        drawFrontRasterSneaker(ctx, canvas.width, canvas.height, targetColorway.knitColor, targetColorway.hex);
      } else if (viewAngle === 'top') {
        drawTopRasterSneaker(ctx, canvas.width, canvas.height, targetColorway.knitColor, targetColorway.hex);
      } else if (viewAngle === 'rear') {
        drawRearRasterSneaker(ctx, canvas.width, canvas.height, targetColorway.knitColor, targetColorway.hex);
      } else if (viewAngle === 'sole') {
        drawSoleRasterSneaker(ctx, canvas.width, canvas.height, targetColorway.knitColor, targetColorway.hex);
      } else if (viewAngle === 'perspective') {
        drawPerspectiveRasterSneaker(ctx, canvas.width, canvas.height, targetColorway.knitColor, targetColorway.hex);
      } else {
        drawSideRasterSneaker(ctx, canvas.width, canvas.height, targetColorway.knitColor, targetColorway.hex);
      }

      return canvas.toDataURL('image/png');
    };

    const bluePng = generateBitmap({ id: 'blue', knitColor: '#173273', hex: '#1a367c' });
    const orangePng = generateBitmap({ id: 'orange', knitColor: '#df9c38', hex: '#e5a13c' });

    setRasterFallbacks((prev) => ({
      blue: { ...prev.blue, [viewAngle]: bluePng },
      orange: { ...prev.orange, [viewAngle]: orangePng },
    }));

    if (onImageLoaded) {
      const currentActive = colorway.id === 'orange' ? orangePng : bluePng;
      onImageLoaded(currentActive);
    }
  }, [viewAngle, colorway.id]);

  // Helper to resolve the active image URL for a given colorway and view angle
  const getResolvedImage = (cwId: string, angle: string): string | null => {
    return colorwayImages[cwId]?.[angle] || rasterFallbacks[cwId]?.[angle] || null;
  };

  // 3. React to Colorway changes or button clicks with a smooth VERTICAL TRANSITION
  useEffect(() => {
    const isColorwayChanged = prevColorwayRef.current.id !== colorway.id;
    const isTriggerChanged = transitionTrigger !== prevTriggerRef.current;

    if (isColorwayChanged || isTriggerChanged) {
      const oldCw = prevColorwayRef.current;
      prevColorwayRef.current = colorway;
      prevTriggerRef.current = transitionTrigger;

      // Determine vertical direction:
      // - Switching from Blue (0) to Yellow (1) -> 'up' (incoming glides from bottom to top)
      // - Switching from Yellow (1) to Blue (0) -> 'down' (incoming drops from top to bottom)
      // - Re-clicking the active color -> 'bounce' (vertical spring bob)
      let dir: 'up' | 'down' | 'bounce' = transitionDirection || (colorway.id === 'orange' ? 'up' : 'down');
      if (!isColorwayChanged && isTriggerChanged) {
        dir = 'bounce';
      }

      setActiveDirection(dir);

      if (dir === 'bounce') {
        // Vertical spring bounce on the same shoe
        setIsTransitioning(true);
        setTransitionPhase('sliding');

        if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
        finishTimerRef.current = setTimeout(() => {
          setIsTransitioning(false);
          setTransitionPhase('idle');
        }, 480);
        return;
      }

      // Vertical slide between Blue and Yellow
      const prevImage = getResolvedImage(oldCw.id, viewAngle);
      setOutgoingColorway(oldCw);
      setOutgoingImage(prevImage);
      setDisplayedColorway(colorway);
      setIsTransitioning(true);
      setTransitionPhase('preparing');

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);

      // Trigger the vertical slide on the very next animation frame
      transitionTimerRef.current = setTimeout(() => {
        setTransitionPhase('sliding');
      }, 30);

      finishTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionPhase('idle');
        setOutgoingColorway(null);
        setOutgoingImage(null);
      }, 520);
    }

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [colorway.id, transitionTrigger, transitionDirection, viewAngle, colorwayImages, rasterFallbacks]);

  // Handle uploaded file for any angle with IndexedDB permanent save
  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const filenameLower = file.name.toLowerCase();
    let targetSlot = viewAngle;
    if (filenameLower.includes('front')) targetSlot = 'front';
    else if (filenameLower.includes('side') || filenameLower.includes('crisp')) targetSlot = 'side';
    else if (filenameLower.includes('perspective') || filenameLower.includes('angle')) targetSlot = 'perspective';
    else if (filenameLower.includes('top') || filenameLower.includes('insole')) targetSlot = 'top';
    else if (filenameLower.includes('rear') || filenameLower.includes('heel') || filenameLower.includes('back')) targetSlot = 'rear';
    else if (filenameLower.includes('sole') || filenameLower.includes('tread') || filenameLower.includes('bottom')) targetSlot = 'sole';

    const optimized = await optimizeImageDataUrl(file);
    if (optimized) {
      await saveShoeImage(targetSlot, optimized, colorway.id);
      setColorwayImages((prev) => ({
        ...prev,
        [colorway.id]: {
          ...prev[colorway.id],
          [targetSlot]: optimized,
        },
      }));
      if (onImageLoaded) onImageLoaded(optimized);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // 4. Subtle Mouse-Move 3D Parallax Calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isParallaxActive || isTransitioning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

    const maxRotateX = 6.5;
    const maxRotateY = 8.5;
    const maxShiftX = 14;
    const maxShiftY = 8;

    setParallax({
      rotateX: -normY * maxRotateX,
      rotateY: normX * maxRotateY,
      translateX: normX * maxShiftX,
      translateY: normY * maxShiftY,
      lightX: ((normX + 1) / 2) * 100,
      lightY: ((normY + 1) / 2) * 100,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({
      rotateX: 0,
      rotateY: 0,
      translateX: 0,
      translateY: 0,
      lightX: 50,
      lightY: 50,
    });
  };

  const currentActiveImage = getResolvedImage(displayedColorway.id, viewAngle);

  // Parallax transform calculations with angle pivot
  const parallaxTransform = isParallaxActive && !isTransitioning
    ? `scale(${scale}) translate3d(${parallax.translateX}px, ${parallax.translateY}px, 20px) rotateX(${parallax.rotateX}deg) rotateY(${parallax.rotateY + (isAngleChanging ? 14 : 0)}deg)`
    : (isAngleChanging ? `scale(${scale * 0.98}) rotateY(14deg)` : `scale(${scale})`);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center cursor-crosshair select-none ${className}`}
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* SNEAKER STAGE WRAPPER WITH VERTICAL TRANSITION */}
      <div className="relative w-full min-h-[250px] sm:min-h-[280px] md:min-h-[300px] flex items-center justify-center overflow-visible py-1 sm:py-2">
        {/* 1. OUTGOING SNEAKER (Visible only during vertical slide transition) */}
        {isTransitioning && outgoingImage && transitionPhase !== 'idle' && activeDirection !== 'bounce' && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{
              transform: transitionPhase === 'sliding'
                ? `scale(${scale * 0.94}) translateY(${activeDirection === 'up' ? '-75px' : '75px'})`
                : `scale(${scale}) translateY(0px)`,
              opacity: transitionPhase === 'sliding' ? 0 : 1,
              transition: transitionPhase === 'sliding'
                ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease-out'
                : 'none',
              willChange: 'transform, opacity',
            }}
          >
            <img
              src={outgoingImage}
              alt={`${outgoingColorway?.name || 'Previous'} sneaker`}
              className="w-full max-w-[500px] md:max-w-[580px] max-h-[250px] sm:max-h-[280px] md:max-h-[300px] object-contain drop-shadow-2xl select-none mx-auto"
              draggable={false}
            />
          </div>
        )}

        {/* 2. INCOMING / CURRENT SNEAKER */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            transform: isTransitioning
              ? (activeDirection === 'bounce'
                  ? `${parallaxTransform} translateY(${transitionPhase === 'sliding' ? '-22px' : '0px'})`
                  : (transitionPhase === 'sliding'
                      ? `scale(${scale}) translateY(0px)`
                      : `scale(${scale * 0.94}) translateY(${activeDirection === 'up' ? '75px' : '-75px'})`))
              : parallaxTransform,
            opacity: isTransitioning && activeDirection !== 'bounce'
              ? (transitionPhase === 'sliding' ? 1 : 0)
              : 1,
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            transition: isTransitioning
              ? (activeDirection === 'bounce'
                  ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : (transitionPhase === 'sliding'
                      ? 'transform 0.48s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.42s ease-in'
                      : 'none'))
              : (isHovered
                  ? 'transform 0.08s ease-out'
                  : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'),
            willChange: 'transform, opacity',
          }}
        >
          {currentActiveImage ? (
            <img
              src={currentActiveImage}
              alt={`${displayedColorway.name} sneaker`}
              className="w-full max-w-[500px] md:max-w-[580px] max-h-[250px] sm:max-h-[280px] md:max-h-[300px] object-contain drop-shadow-2xl select-none pointer-events-none mx-auto"
              draggable={false}
            />
          ) : (
            <div className="w-full max-w-[560px] aspect-16/9 bg-neutral-100 rounded-2xl flex items-center justify-center animate-pulse text-neutral-400">
              Loading Raster Image...
            </div>
          )}

          {/* Dynamic Studio Sheen / Specular Light Reflection */}
          {isHovered && isParallaxActive && !isTransitioning && (
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl mix-blend-overlay opacity-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 380px at ${parallax.lightX}% ${parallax.lightY}%, rgba(255, 255, 255, 0.8), transparent 70%)`,
              }}
            />
          )}

          {/* Quick Floating Action to load/swap attached photo (Admin mode only) */}
          {isAdminMode && (
            <div className="absolute top-2 right-4 flex items-center gap-2 z-20">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 bg-neutral-900/85 hover:bg-neutral-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs shadow-lg transition-all border border-white/10"
                title="Upload or change attached image file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {colorwayImages[displayedColorway.id]?.[viewAngle] ? 'Replace Attached File' : 'Attach File'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Realistic counter-parallax ground shadow under the sneaker */}
      <div
        className="w-[72%] max-w-[480px] mx-auto h-6 rounded-full -mt-4 pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: isTransitioning
            ? (activeDirection === 'bounce'
                ? 'scale(0.85) translateY(4px)'
                : 'scale(0.82) translateY(6px)')
            : (isParallaxActive
                ? `translate3d(${-parallax.translateX * 0.45}px, ${parallax.translateY * 0.25}px, 0px) scale(${
                    1 - (parallax.translateY / 8) * 0.04
                  })`
                : 'none'),
          opacity: isTransitioning ? 0.35 : 0.8,
          transition: isHovered && !isTransitioning
            ? 'transform 0.08s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out',
          background: displayedColorway.id === 'orange'
            ? 'radial-gradient(ellipse at center, rgba(120, 75, 15, 0.32) 0%, rgba(120, 75, 15, 0.08) 50%, rgba(0,0,0,0) 75%)'
            : 'radial-gradient(ellipse at center, rgba(10, 25, 60, 0.32) 0%, rgba(10, 25, 60, 0.08) 50%, rgba(0,0,0,0) 75%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Interactive Parallax & Status Indicator (Admin mode only) */}
      {isAdminMode && (
        <div className="mt-3 flex items-center gap-2.5 text-[11px] text-neutral-500 font-mono">
          <button
            onClick={() => setIsParallaxActive(!isParallaxActive)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all ${
              isParallaxActive
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}
            title="Toggle 3D mouse-move parallax depth effect"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>3D Depth Parallax: {isParallaxActive ? 'Active' : 'Paused'}</span>
          </button>
          <span className="text-neutral-300">·</span>
          <span className="text-[10px] text-neutral-400">
            {isHovered ? '3D Angle Tracking Active' : 'Hover & move mouse to tilt'}
          </span>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// HIGH-RESOLUTION RASTER BITMAP RENDERERS (Canvas 2D Pixel Operations)
// Draws the sneaker into a pure PNG bitmap image, completely free of vector SVG
// Supports both Royal Navy Blue and Mustard Ochre / Yellow colorways
// =========================================================================

function drawSideRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string,
  hex: string = '#1a367c'
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w * 0.05, h * 0.06);
  ctx.scale((w * 0.9) / 840, (h * 0.88) / 500);

  const isYellow = hex === '#e5a13c' || knitColor.includes('df9c38');

  // Palette definition
  const tabColor = isYellow ? '#5a3508' : '#0d1b3d';
  const gradStart = isYellow ? '#f5b84c' : '#1e3f8a';
  const gradMid = isYellow ? '#df9c38' : (knitColor || '#173273');
  const gradEnd = isYellow ? '#844c08' : '#0c1b40';
  const dotColor = isYellow ? '#6e3f07' : '#081432';
  const heelColor = isYellow ? '#7a4509' : '#102555';
  const laceColor = isYellow ? '#d4902a' : '#1d3d82';
  const outsoleColor = isYellow ? '#251705' : '#08142c';

  // 1. Rear pull tab
  ctx.fillStyle = tabColor;
  ctx.beginPath();
  ctx.moveTo(96, 175);
  ctx.bezierCurveTo(80, 150, 70, 120, 86, 100);
  ctx.bezierCurveTo(96, 88, 112, 90, 114, 110);
  ctx.bezierCurveTo(115, 130, 112, 165, 110, 185);
  ctx.closePath();
  ctx.fill();

  // 2. Main Knit Upper
  const grad = ctx.createLinearGradient(100, 100, 700, 350);
  grad.addColorStop(0, gradStart);
  grad.addColorStop(0.5, gradMid);
  grad.addColorStop(1, gradEnd);
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

  // Honeycomb texture dots across the upper
  ctx.fillStyle = dotColor;
  ctx.globalAlpha = 0.4;
  for (let x = 120; x < 760; x += 12) {
    for (let y = 140; y < 360; y += 12) {
      if (ctx.isPointInPath(x, y)) {
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1.0;

  // 3. Symmetrical white racing stripes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(172, 195);
  ctx.bezierCurveTo(255, 208, 360, 225, 440, 252);
  ctx.bezierCurveTo(505, 275, 555, 315, 572, 360);
  ctx.bezierCurveTo(552, 355, 505, 320, 460, 290);
  ctx.bezierCurveTo(380, 240, 270, 215, 172, 195);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(230, 225);
  ctx.bezierCurveTo(295, 240, 375, 260, 435, 300);
  ctx.bezierCurveTo(460, 318, 472, 342, 478, 360);
  ctx.bezierCurveTo(465, 352, 445, 330, 420, 310);
  ctx.bezierCurveTo(355, 260, 280, 235, 230, 225);
  ctx.closePath();
  ctx.fill();

  // 4. TPU Heel Counter
  ctx.fillStyle = heelColor;
  ctx.beginPath();
  ctx.moveTo(85, 240);
  ctx.bezierCurveTo(80, 200, 86, 168, 112, 165);
  ctx.bezierCurveTo(135, 162, 175, 180, 185, 220);
  ctx.bezierCurveTo(192, 250, 188, 280, 178, 300);
  ctx.bezierCurveTo(145, 305, 100, 295, 85, 240);
  ctx.closePath();
  ctx.fill();

  // 5. Laces
  ctx.strokeStyle = laceColor;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const lacePoints = [
    [345, 120, 385, 135],
    [375, 140, 415, 160],
    [405, 165, 445, 185],
    [435, 190, 475, 212],
    [465, 215, 505, 238],
  ];
  lacePoints.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // 6. Sculpted White Foam Midsole
  const soleGrad = ctx.createLinearGradient(0, 320, 0, 440);
  soleGrad.addColorStop(0, '#ffffff');
  soleGrad.addColorStop(0.7, '#f8fafc');
  soleGrad.addColorStop(1, isYellow ? '#fef3c7' : '#dbeafe');
  ctx.fillStyle = soleGrad;

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

  // 7. Dual Visible Air Pods in Heel
  drawAirPod(ctx, 32, 335, 135, 60, isYellow);
  drawAirPod(ctx, 192, 342, 155, 58, isYellow);

  // 8. Carbon Rubber Outsole
  ctx.fillStyle = outsoleColor;
  ctx.beginPath();
  ctx.moveTo(30, 380);
  ctx.bezierCurveTo(25, 395, 35, 418, 55, 432);
  ctx.bezierCurveTo(85, 450, 145, 448, 165, 435);
  ctx.bezierCurveTo(170, 425, 160, 412, 140, 405);
  ctx.bezierCurveTo(95, 390, 50, 380, 30, 380);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(185, 430);
  ctx.bezierCurveTo(210, 442, 270, 445, 320, 442);
  ctx.bezierCurveTo(330, 435, 325, 425, 305, 420);
  ctx.bezierCurveTo(260, 415, 210, 418, 185, 430);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(445, 425);
  ctx.bezierCurveTo(470, 445, 520, 448, 555, 445);
  ctx.bezierCurveTo(555, 435, 540, 425, 510, 420);
  ctx.bezierCurveTo(480, 418, 455, 420, 445, 425);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(565, 442);
  ctx.bezierCurveTo(600, 448, 640, 445, 665, 438);
  ctx.bezierCurveTo(665, 430, 650, 422, 620, 420);
  ctx.bezierCurveTo(590, 418, 575, 430, 565, 442);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(685, 430);
  ctx.bezierCurveTo(730, 438, 780, 415, 805, 378);
  ctx.bezierCurveTo(818, 358, 820, 338, 815, 328);
  ctx.bezierCurveTo(805, 322, 795, 330, 790, 345);
  ctx.bezierCurveTo(775, 385, 735, 410, 685, 430);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawAirPod(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isYellow: boolean = false
) {
  ctx.save();
  ctx.fillStyle = isYellow ? '#3d2508' : '#0a142c';
  ctx.strokeStyle = isYellow ? '#947238' : '#64748b';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.stroke();

  // Glass gradient
  const glass = ctx.createLinearGradient(x, y, x, y + h);
  glass.addColorStop(0, 'rgba(255,255,255,0.85)');
  glass.addColorStop(0.3, isYellow ? 'rgba(254,240,138,0.25)' : 'rgba(147,197,253,0.2)');
  glass.addColorStop(0.7, isYellow ? 'rgba(69,38,8,0.7)' : 'rgba(30,41,59,0.7)');
  glass.addColorStop(1, isYellow ? 'rgba(37,20,5,0.9)' : 'rgba(15,23,42,0.9)');
  ctx.fillStyle = glass;
  roundRect(ctx, x + 3, y + 3, w - 6, h - 6, (h - 6) / 2);
  ctx.fill();

  // Internal support struts
  ctx.fillStyle = isYellow ? '#5a3508' : '#1e293b';
  ctx.fillRect(x + w * 0.28, y + 8, 14, h - 16);
  ctx.fillRect(x + w * 0.62, y + 8, 14, h - 16);

  // Specular reflection glint
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.2, y + h * 0.35, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + w * 0.8, y + h * 0.35, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.restore();
}

function drawFrontRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string,
  hex: string = '#1a367c'
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w * 0.08, h * 0.05);
  ctx.scale((w * 0.84) / 600, (h * 0.9) / 680);

  const isYellow = hex === '#e5a13c' || knitColor.includes('df9c38');

  const tabColor = isYellow ? '#5a3508' : '#0d1b3d';
  const gradStart = isYellow ? '#f5b84c' : '#1e3f8a';
  const gradEnd = isYellow ? '#df9c38' : (knitColor || '#173273');
  const capsuleColor = isYellow ? '#251705' : '#081024';
  const laceColor = isYellow ? '#d4902a' : '#1d3d82';
  const toeColor = isYellow ? '#251705' : '#08142c';

  // Tongue Dome
  const tGrad = ctx.createLinearGradient(300, 40, 300, 200);
  tGrad.addColorStop(0, gradStart);
  tGrad.addColorStop(1, gradEnd);
  ctx.fillStyle = tGrad;
  ctx.beginPath();
  ctx.moveTo(235, 155);
  ctx.bezierCurveTo(240, 85, 260, 45, 300, 45);
  ctx.bezierCurveTo(340, 45, 360, 85, 365, 155);
  ctx.closePath();
  ctx.fill();

  // Top Pull Tab
  ctx.fillStyle = tabColor;
  ctx.fillRect(286, 15, 28, 35);

  // Flank Air Capsules
  ctx.fillStyle = capsuleColor;
  ctx.beginPath();
  ctx.ellipse(106, 495, 30, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(494, 495, 30, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sculpted White Midsole
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(100, 520);
  ctx.bezierCurveTo(120, 450, 160, 460, 210, 475);
  ctx.bezierCurveTo(255, 490, 280, 488, 300, 488);
  ctx.bezierCurveTo(320, 488, 345, 490, 390, 475);
  ctx.bezierCurveTo(440, 460, 480, 450, 500, 520);
  ctx.bezierCurveTo(515, 570, 480, 585, 435, 588);
  ctx.bezierCurveTo(380, 592, 335, 590, 300, 590);
  ctx.bezierCurveTo(265, 590, 220, 592, 165, 588);
  ctx.bezierCurveTo(120, 585, 85, 570, 100, 520);
  ctx.closePath();
  ctx.fill();

  // Main Upper Vamp
  ctx.fillStyle = tGrad;
  ctx.beginPath();
  ctx.moveTo(130, 455);
  ctx.bezierCurveTo(135, 340, 165, 240, 210, 185);
  ctx.bezierCurveTo(235, 155, 265, 140, 300, 140);
  ctx.bezierCurveTo(335, 140, 365, 155, 390, 185);
  ctx.bezierCurveTo(435, 240, 465, 340, 470, 455);
  ctx.bezierCurveTo(460, 485, 390, 485, 300, 485);
  ctx.bezierCurveTo(210, 485, 140, 485, 130, 455);
  ctx.closePath();
  ctx.fill();

  // Symmetrical White Racing Stripes
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(148, 350, 12, 100);
  ctx.fillRect(440, 350, 12, 100);

  // Flat Laces
  ctx.strokeStyle = laceColor;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const frontLaces = [
    [230, 285, 370, 285],
    [235, 250, 365, 250],
    [242, 215, 358, 215],
    [250, 185, 350, 185],
    [260, 160, 340, 160],
  ];
  frontLaces.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Toe Bumper
  ctx.fillStyle = toeColor;
  ctx.beginPath();
  ctx.arc(300, 490, 50, 0, Math.PI);
  ctx.fill();

  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawPerspectiveRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string,
  hex: string = '#1a367c'
) {
  ctx.save();
  ctx.translate(w * 0.05, h * 0.04);
  ctx.transform(0.92, -0.05, 0.06, 0.94, 0, 10);
  drawSideRasterSneaker(ctx, w * 0.96, h * 0.96, knitColor, hex);
  ctx.restore();
}

function drawTopRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string,
  hex: string = '#1a367c'
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w * 0.12, h * 0.08);
  ctx.scale((w * 0.76) / 500, (h * 0.84) / 720);

  const isYellow = hex === '#e5a13c' || knitColor.includes('df9c38');
  const upperColor = isYellow ? '#df9c38' : (knitColor || '#173273');
  const insoleColor = isYellow ? '#3d2508' : '#0c1b40';
  const laceColor = isYellow ? '#fef3c7' : '#ffffff';

  // Left Shoe Outline
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(250, 360, 145, 310, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shoe Upper Knit Body
  ctx.fillStyle = upperColor;
  ctx.beginPath();
  ctx.ellipse(250, 360, 128, 290, 0, 0, Math.PI * 2);
  ctx.fill();

  // Insole Opening
  ctx.fillStyle = insoleColor;
  ctx.beginPath();
  ctx.ellipse(250, 430, 72, 135, 0, 0, Math.PI * 2);
  ctx.fill();

  // Branding text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('KORVA COREFLEX', 250, 440);

  // Tongue & Laces
  ctx.fillStyle = isYellow ? '#f5b84c' : '#1e3f8a';
  ctx.beginPath();
  roundRect(ctx, 200, 160, 100, 190, 25);
  ctx.fill();

  // Laces criss-cross
  ctx.strokeStyle = laceColor;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const ySteps = [185, 225, 265, 305];
  ySteps.forEach((y, i) => {
    ctx.beginPath();
    ctx.moveTo(170, y);
    ctx.lineTo(330, y + (i % 2 === 0 ? 12 : -12));
    ctx.stroke();
  });

  ctx.restore();
}

function drawRearRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string,
  hex: string = '#1a367c'
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w * 0.15, h * 0.08);
  ctx.scale((w * 0.7) / 450, (h * 0.84) / 600);

  const isYellow = hex === '#e5a13c' || knitColor.includes('df9c38');
  const upperColor = isYellow ? '#df9c38' : (knitColor || '#173273');
  const tabColor = isYellow ? '#5a3508' : '#0d1b3d';
  const tpuColor = isYellow ? '#7a4509' : '#102555';

  // 1. Rear pull tab
  ctx.fillStyle = tabColor;
  ctx.fillRect(205, 30, 40, 70);

  // 2. Main Heel Dome Knit
  ctx.fillStyle = upperColor;
  ctx.beginPath();
  ctx.moveTo(150, 100);
  ctx.bezierCurveTo(170, 70, 280, 70, 300, 100);
  ctx.bezierCurveTo(340, 200, 360, 340, 350, 420);
  ctx.bezierCurveTo(300, 440, 150, 440, 100, 420);
  ctx.bezierCurveTo(90, 340, 110, 200, 150, 100);
  ctx.closePath();
  ctx.fill();

  // 3. Molded TPU Heel Frame
  ctx.fillStyle = tpuColor;
  ctx.beginPath();
  ctx.moveTo(115, 320);
  ctx.bezierCurveTo(180, 290, 270, 290, 335, 320);
  ctx.bezierCurveTo(345, 380, 335, 415, 320, 425);
  ctx.bezierCurveTo(260, 435, 190, 435, 130, 425);
  ctx.bezierCurveTo(115, 415, 105, 380, 115, 320);
  ctx.closePath();
  ctx.fill();

  // 4. White Midsole Platform
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(70, 410);
  ctx.bezierCurveTo(150, 395, 300, 395, 380, 410);
  ctx.bezierCurveTo(400, 480, 385, 520, 350, 535);
  ctx.bezierCurveTo(280, 545, 170, 545, 100, 535);
  ctx.bezierCurveTo(65, 520, 50, 480, 70, 410);
  ctx.closePath();
  ctx.fill();

  // 5. Dual Visible Air Chambers
  drawAirPod(ctx, 100, 455, 105, 45, isYellow);
  drawAirPod(ctx, 245, 455, 105, 45, isYellow);

  // 6. Outsole Grip Base
  ctx.fillStyle = isYellow ? '#251705' : '#08142c';
  ctx.fillRect(85, 535, 280, 25);

  ctx.restore();
}

function drawSoleRasterSneaker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  knitColor: string,
  hex: string = '#1a367c'
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w * 0.12, h * 0.06);
  ctx.scale((w * 0.76) / 480, (h * 0.88) / 720);

  const isYellow = hex === '#e5a13c' || knitColor.includes('df9c38');
  const outsoleBg = isYellow ? '#251705' : '#08142c';
  const flexTread = isYellow ? '#df9c38' : '#38bdf8';

  // White perimeter foam edge
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(240, 360, 145, 305, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark Carbon Rubber Tread Footprint
  ctx.fillStyle = outsoleBg;
  ctx.beginPath();
  ctx.ellipse(240, 360, 130, 285, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heel Air Pod Window
  ctx.fillStyle = isYellow ? '#452608' : '#1e3a8a';
  ctx.beginPath();
  ctx.ellipse(240, 510, 65, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DUAL AIR', 240, 515);

  // Flex Grooves & Wave Tread
  ctx.strokeStyle = flexTread;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const grooveYs = [150, 205, 260, 315, 370];
  grooveYs.forEach((gy) => {
    ctx.beginPath();
    ctx.moveTo(160, gy);
    ctx.quadraticCurveTo(240, gy + 22, 320, gy);
    ctx.stroke();
  });

  ctx.restore();
}
