import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Play,
  Pause,
  RotateCw,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  X,
  Truck,
  ShieldCheck,
  Trash2,
  ArrowRight,
  Ruler,
  Upload,
  Camera,
} from 'lucide-react';
import { KALLI_FENDI_SNEAKER } from './data/kalliProduct';
import { KalliColorway } from './types';
import { KalliSneakerIllustration } from './components/KalliSneakerIllustration';
import { AttachedSneakerViewer } from './components/AttachedSneakerViewer';
import { ProductVideoPlayer } from './components/ProductVideoPlayer';
import { ReviewsModal } from './components/ReviewsModal';
import { GalleryModal } from './components/GalleryModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { UploadImageModal } from './components/UploadImageModal';
import { getAllShoeImages } from './utils/imageStorage';

export default function App() {
  const product = KALLI_FENDI_SNEAKER;

  // Selected state matching the uploaded blue air sneaker:
  // - Colorway: Deep Royal Navy & White Air (#1a367c)
  // - Size: 37
  // - Active Slide: 01
  const [selectedColorway, setSelectedColorway] = useState<KalliColorway>(product.colorways[0]); // Royal Blue
  const [selectedSize, setSelectedSize] = useState<number>(37);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0); // 0 to 5
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [shoeScale, setShoeScale] = useState<number>(1.0); // Natural 100% scale, fully visible and centered

  // Auto-play positions rotation at minimum interval
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [rotationInterval, setRotationInterval] = useState<number>(800); // 800ms minimum interval

  // Vertical transition state between blue and yellow sneakers
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down' | 'bounce' | null>(null);
  const [transitionTrigger, setTransitionTrigger] = useState<number>(0);

  // Modals & Drawers
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Cart Items State
  const [cartItems, setCartItems] = useState<
    { id: string; colorway: KalliColorway; size: number; quantity: number; price: number }[]
  >([
    {
      id: 'cart-1',
      colorway: product.colorways[0],
      size: 37,
      quantity: 1,
      price: product.price,
    },
  ]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reactive thumbnail previews for custom uploaded images
  const [thumbImages, setThumbImages] = useState<Record<string, string | null>>({
    side: null,
    front: null,
    perspective: null,
  });

  useEffect(() => {
    let isMounted = true;
    const loadThumbnails = async () => {
      try {
        const loaded = await getAllShoeImages(selectedColorway.id);
        if (isMounted) {
          setThumbImages({
            side: loaded.side,
            front: loaded.front,
            perspective: loaded.perspective,
          });
        }
      } catch {}
    };

    loadThumbnails();
    window.addEventListener('storage', loadThumbnails);
    window.addEventListener('kalli_image_updated', loadThumbnails);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadThumbnails);
      window.removeEventListener('kalli_image_updated', loadThumbnails);
    };
  }, [selectedColorway.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const angles: ('side' | 'front' | 'perspective' | 'top' | 'rear' | 'sole')[] = [
    'side',
    'front',
    'perspective',
    'top',
    'rear',
    'sole',
  ];

  // Auto-rotate sneaker positions at minimum interval
  useEffect(() => {
    if (!isAutoRotating) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % angles.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [isAutoRotating, rotationInterval, angles.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % angles.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + angles.length) % angles.length);
  };

  const handleColorwaySelect = (cw: KalliColorway) => {
    if (cw.id === selectedColorway.id) {
      setTransitionDirection('bounce');
      setTransitionTrigger((prev) => prev + 1);
      showToast(`${cw.name} • Vertical Bounce ↕`);
      return;
    }

    // Vertical transition direction:
    // Switching to yellow (orange): 'up' (incoming slides from bottom)
    // Switching to blue: 'down' (incoming slides from top)
    const isGoingToYellow = cw.id === 'orange';
    const dir: 'up' | 'down' = isGoingToYellow ? 'up' : 'down';
    setTransitionDirection(dir);
    setTransitionTrigger((prev) => prev + 1);
    setSelectedColorway(cw);
    showToast(`Switched colour to ${cw.name} (Vertical Transition ↕)`);
  };

  const handleAddToCart = () => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.colorway.id === selectedColorway.id && item.size === selectedSize
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}`,
          colorway: selectedColorway,
          size: selectedSize,
          quantity: 1,
          price: product.price,
        },
      ];
    });

    showToast(`Added ${product.title} (Size ${selectedSize}) to Bag`);
    setIsCartOpen(true);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#f7f7f7] flex flex-col font-sans select-none text-neutral-900 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- TOP BAR (KORVA · ← BACK · Shopping Bag) --- */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 pt-3 sm:pt-4 pb-1 sm:pb-2 flex items-center justify-between shrink-0">
        {/* Left: Brand "KORVA" */}
        <div className="w-32">
          <a
            href="/"
            className="text-2xl font-black uppercase tracking-wider text-neutral-900 hover:opacity-80 transition-opacity font-brand-display"
          >
            {product.brand}
          </a>
        </div>

        {/* Center: "← BACK" */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => {
              setCurrentSlideIndex(0);
              showToast('Returned to main lateral view');
            }}
            className="group flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <span className="text-xs group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>BACK</span>
          </button>
        </div>

        {/* Right: Minimal Shopping Bag Icon with Badge */}
        <div className="w-32 flex justify-end">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral-900 hover:opacity-75 transition-opacity focus:outline-none"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-neutral-900 ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* --- MAIN HERO SHOWCASE STAGE --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 flex flex-col justify-between py-1 sm:py-2 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center flex-1 min-h-0">
          {/* LEFT COLUMN: Brand, Title, Subtitle, Thumbnails */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {product.designer} —
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
                {product.title}
              </h1>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                {product.subtitle}
              </p>
            </div>

            {/* Thumbnail Row: 3 Image Previews + "+3" Box */}
            <div className="flex items-center gap-2 pt-1">
              {/* Thumbnail 1: Side view (Main Image) */}
              <button
                onClick={() => {
                  setCurrentSlideIndex(0);
                  showToast('Switched to Main Lateral Side Image');
                }}
                className={`w-12 h-12 bg-white rounded-lg p-1 border transition-all flex items-center justify-center overflow-hidden ${
                  currentSlideIndex === 0
                    ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
                aria-label="View main lateral side angle"
                title="Lateral Side (Main Image)"
              >
                {thumbImages.side ? (
                  <img src={thumbImages.side} alt="Side thumbnail" className="w-full h-full object-contain" />
                ) : (
                  <div className="scale-75">
                    <KalliSneakerIllustration colorway={selectedColorway} viewAngle="side" />
                  </div>
                )}
              </button>

              {/* Thumbnail 2: Front view (Newly Uploaded Image) */}
              <button
                onClick={() => {
                  setCurrentSlideIndex(1);
                  showToast('Switched to Front-Facing Elevation View');
                }}
                className={`w-12 h-12 bg-white rounded-lg p-1 border transition-all flex items-center justify-center overflow-hidden ${
                  currentSlideIndex === 1
                    ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
                aria-label="View front angle"
                title="Front-Facing View"
              >
                {thumbImages.front ? (
                  <img src={thumbImages.front} alt="Front thumbnail" className="w-full h-full object-contain" />
                ) : (
                  <div className="scale-75">
                    <KalliSneakerIllustration colorway={selectedColorway} viewAngle="front" />
                  </div>
                )}
              </button>

              {/* Thumbnail 3: Perspective view */}
              <button
                onClick={() => {
                  setCurrentSlideIndex(2);
                  showToast('Switched to 3/4 Perspective View');
                }}
                className={`w-12 h-12 bg-white rounded-lg p-1 border transition-all flex items-center justify-center overflow-hidden ${
                  currentSlideIndex === 2
                    ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
                aria-label="View perspective angle"
                title="3/4 Dynamic Angle"
              >
                {thumbImages.perspective ? (
                  <img src={thumbImages.perspective} alt="Perspective thumbnail" className="w-full h-full object-contain" />
                ) : (
                  <div className="scale-75">
                    <KalliSneakerIllustration colorway={selectedColorway} viewAngle="perspective" />
                  </div>
                )}
              </button>

              {/* Thumbnail 4: "+3" Black Box (Opens Gallery Modal) */}
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="w-12 h-12 bg-neutral-950 text-white rounded-lg flex items-center justify-center text-xs font-bold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
                aria-label="Open full gallery with all angles"
                title="View All 6 Angles & Upload Photos"
              >
                +3
              </button>
            </div>
          </div>

          {/* CENTER COLUMN: Central Sneaker Presentation (Enlarged) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-1 sm:py-2 overflow-visible min-h-0">
            {/* Quick Angle Switcher Pill with Auto-Rotate Showcase */}
            <div className="mb-2 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {/* 6 Quick Position Buttons */}
                <div className="flex items-center gap-1 bg-white/85 backdrop-blur-xs p-1 rounded-full border border-neutral-200 shadow-2xs text-[11px] font-semibold">
                  {[
                    { key: 'side', label: 'Side (01)' },
                    { key: 'front', label: 'Front (02)' },
                    { key: 'perspective', label: '3/4 Angle (03)' },
                    { key: 'top', label: 'Top (04)' },
                    { key: 'rear', label: 'Heel (05)' },
                    { key: 'sole', label: 'Sole (06)' },
                  ].map((item, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setCurrentSlideIndex(idx);
                          showToast(`Position: ${item.label}`);
                        }}
                        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          isActive
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Auto-Play Minimum Interval Toggle Button */}
                <div className="flex items-center gap-1 bg-white/85 backdrop-blur-xs p-1 rounded-full border border-neutral-200 shadow-2xs text-[11px] font-semibold">
                  <button
                    onClick={() => {
                      const nextState = !isAutoRotating;
                      setIsAutoRotating(nextState);
                      showToast(
                        nextState
                          ? `Auto-Play Active: Rotating positions at ${rotationInterval / 1000}s minimum interval 🔄`
                          : 'Auto-Play Paused ⏸'
                      );
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                      isAutoRotating
                        ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs animate-pulse ring-2 ring-amber-400/40'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                    title={
                      isAutoRotating
                        ? 'Pause auto-rotating positions'
                        : `Auto-rotate all 6 positions at ${rotationInterval / 1000}s minimum interval`
                    }
                  >
                    {isAutoRotating ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Auto (0{currentSlideIndex + 1}/06)</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-3 h-3" />
                        <span>Auto-Play Positions</span>
                      </>
                    )}
                  </button>

                  {/* Interval selector pills */}
                  <div className="flex items-center gap-0.5 px-1 font-mono text-[10px]">
                    {[
                      { ms: 800, label: '0.8s Min' },
                      { ms: 1200, label: '1.2s' },
                      { ms: 2000, label: '2s' },
                    ].map((opt) => (
                      <button
                        key={opt.ms}
                        onClick={() => {
                          setRotationInterval(opt.ms);
                          if (!isAutoRotating) setIsAutoRotating(true);
                          showToast(`Interval set to ${opt.label} ⚡`);
                        }}
                        className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                          rotationInterval === opt.ms
                            ? 'bg-neutral-900 text-white font-bold'
                            : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                        }`}
                        title={`Set auto-play interval to ${opt.label}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Photos Button */}
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer border border-neutral-800"
                  title="Upload or change custom shoe photos (Photo Manager)"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Photos</span>
                </button>
              </div>
            </div>

            <div className="relative w-full max-w-[760px] xl:max-w-[880px] flex items-center justify-center">
              <AttachedSneakerViewer
                colorway={selectedColorway}
                viewAngle={angles[currentSlideIndex]}
                scale={shoeScale}
                isAdminMode={isAdminMode}
                transitionDirection={transitionDirection}
                transitionTrigger={transitionTrigger}
              />
            </div>

            {/* Quick Interactive Zoom / Scale Adjuster */}
            <div className="mt-2 flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-neutral-200/80 shadow-2xs text-[11px] text-neutral-500 font-mono">
              <button
                onClick={() => setShoeScale((s) => Math.max(0.7, Number((s - 0.1).toFixed(2))))}
                className="w-5 h-5 rounded-full hover:bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold"
                aria-label="Zoom out sneaker"
                title="Decrease shoe display size"
              >
                -
              </button>
              <span className="px-1 font-semibold text-neutral-800 tabular-nums">
                {Math.round(shoeScale * 100)}%
              </span>
              <button
                onClick={() => setShoeScale((s) => Math.min(1.35, Number((s + 0.1).toFixed(2))))}
                className="w-5 h-5 rounded-full hover:bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold"
                aria-label="Zoom in sneaker"
                title="Increase shoe display size"
              >
                +
              </button>
              {shoeScale !== 1.0 && (
                <button
                  onClick={() => setShoeScale(1.0)}
                  className="ml-1 text-[10px] text-neutral-400 hover:text-neutral-900 underline cursor-pointer"
                  title="Reset scale to 100%"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Size, Reviews, Price, Colour */}
          <div className="lg:col-span-3 space-y-3.5 lg:pl-4 xl:pl-6">
            {/* 1. SIZE SELECTOR WITH SIZE GUIDE MODAL TRIGGER */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  SIZE
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors underline"
                  title="Open Size Conversion Chart"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {product.sizes.map((sz) => {
                  const isActive = sz === selectedSize;
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSize(sz);
                        showToast(`Selected Size ${sz}`);
                      }}
                      className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-neutral-950 text-white shadow-xs'
                          : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. REVIEWS */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                REVIEWS
              </span>
              <button
                onClick={() => setIsReviewsOpen(true)}
                className="flex items-center gap-1.5 text-neutral-900 hover:opacity-75 transition-opacity"
              >
                <div className="flex text-neutral-900">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < product.rating
                          ? 'fill-neutral-900 text-neutral-900'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-neutral-400 font-mono ml-1">
                  ({product.reviewsCount})
                </span>
              </button>
            </div>

            {/* 3. PRICE */}
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                PRICE
              </span>
              <span className="text-xl font-bold font-mono tracking-tight text-neutral-900 tabular-nums">
                ${product.price}
              </span>
            </div>

            {/* 4. COLOUR SWATCHES (Blue and Yellow buttons with vertical transition) */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  COLOUR
                </span>
                <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1">
                  <span>{selectedColorway.id === 'blue' ? 'Royal Navy Blue' : 'Mustard Yellow'}</span>
                  <span className="text-[9px] px-1 py-0.5 bg-neutral-100 rounded text-neutral-500 font-mono">↕ Vertical Slide</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colorways.map((cw) => {
                  const isActive = cw.id === selectedColorway.id;
                  const isBlue = cw.id === 'blue';
                  const label = isBlue ? 'Blue' : 'Yellow';
                  return (
                    <button
                      key={cw.id}
                      onClick={() => handleColorwaySelect(cw)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm scale-102 ring-2 ring-neutral-900/15'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                      }`}
                      title={`${cw.name} — Click to transition vertically`}
                      aria-label={`Select ${label} colorway with vertical transition`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white/20 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: cw.hex }}
                      />
                      <span className="text-xs font-semibold">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM FLOATING BAR (Play Video · Arrows & 01——05 · ADD TO CART & Heart) --- */}
        <div className="w-full bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-neutral-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2 shrink-0">
          {/* LEFT: "▶ Play Video" Button */}
          <button
            onClick={() => setIsVideoOpen(true)}
            className="group flex items-center gap-2.5 text-xs font-bold tracking-wider text-neutral-900 hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Play 3D product showcase video"
          >
            <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-2xs">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </span>
            <span>Play Video</span>
          </button>

          {/* CENTER: Navigation Arrows & "01 —— 05" Slider */}
          <div className="flex items-center gap-6">
            {/* Arrows & Auto Loop */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                aria-label="Previous view angle"
                title="Previous position"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const nextState = !isAutoRotating;
                  setIsAutoRotating(nextState);
                  showToast(
                    nextState
                      ? `Auto-Play Active: Rotating positions at ${rotationInterval / 1000}s interval 🔄`
                      : 'Auto-Play Paused ⏸'
                  );
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isAutoRotating
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs animate-pulse ring-2 ring-amber-400/40'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title={
                  isAutoRotating
                    ? 'Pause auto-rotating positions'
                    : `Auto-rotate all positions at ${rotationInterval / 1000}s minimum interval`
                }
                aria-label="Toggle auto rotate positions"
              >
                {isAutoRotating ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <RotateCw className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleNextSlide}
                className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                aria-label="Next view angle"
                title="Next position"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Line: "01 ———— 05" */}
            <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums text-neutral-400">
              <span className="text-neutral-900 font-bold">0{currentSlideIndex + 1}</span>
              <div className="w-16 h-[2px] bg-neutral-200 relative overflow-hidden rounded-full">
                <div
                  className="h-full bg-neutral-900 transition-all duration-300"
                  style={{
                    width: `${((currentSlideIndex + 1) / angles.length) * 100}%`,
                  }}
                />
              </div>
              <span>0{angles.length}</span>
            </div>
          </div>

          {/* RIGHT: "ADD TO CART" & Heart Wishlist Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-md transition-colors shadow-2xs"
            >
              ADD TO CART
            </button>

            <button
              onClick={() => {
                const next = !isWishlisted;
                setIsWishlisted(next);
                showToast(next ? 'Saved to Wishlist' : 'Removed from Wishlist');
              }}
              className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`}
              />
            </button>
          </div>
        </div>
      </main>

      {/* --- INTERACTIVE 4K PRODUCT VIDEO EXPERIENCE MODAL --- */}
      <ProductVideoPlayer
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        colorway={selectedColorway}
      />

      {/* --- REVIEWS MODAL --- */}
      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        rating={product.rating}
        totalReviews={product.reviewsCount}
      />

      {/* --- GALLERY MODAL (+3 views) --- */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        colorway={selectedColorway}
        isAdminMode={isAdminMode}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onSelectAngle={(angle) => {
          const idx = angles.indexOf(angle);
          if (idx !== -1) setCurrentSlideIndex(idx);
        }}
      />

      {/* Floating Photo Manager Trigger Button */}
      <div className="fixed bottom-3 left-4 z-40">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/90 hover:bg-neutral-950 text-white text-xs font-semibold shadow-lg backdrop-blur-xs border border-white/10 transition-all cursor-pointer hover:scale-102"
          title="Open Photo Manager to upload, view, or replace shoe photos"
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Upload Shoe Photos</span>
        </button>
      </div>

      {/* --- SIZE GUIDE MODAL (US/EU/UK/CM Comparison Chart) --- */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        currentSize={selectedSize}
        onSelectSize={(sz) => {
          setSelectedSize(sz);
          showToast(`Selected Size EU ${sz}`);
        }}
      />

      {/* --- UPLOAD CUSTOM SHOE IMAGE MODAL --- */}
      <UploadImageModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        initialColorwayId={selectedColorway.id}
        onImageUpdated={() => {
          showToast('জুতার ছবি সফলভাবে আপডেট করা হয়েছে!');
        }}
      />

      {/* --- SHOPPING BAG SLIDE-OVER DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 font-brand-display">
                    Shopping Bag
                  </h2>
                  <span className="text-xs text-neutral-400 font-mono tabular-nums">
                    ({cartCount})
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <p className="text-sm font-medium text-neutral-500">Your bag is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200/60"
                    >
                      <div className="w-20 h-20 bg-white rounded-lg p-1 flex items-center justify-center border border-neutral-100 shrink-0">
                        <KalliSneakerIllustration colorway={item.colorway} viewAngle="side" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold tracking-tight text-neutral-900 uppercase">
                              {product.brand}
                            </h4>
                            <button
                              onClick={() =>
                                setCartItems((prev) => prev.filter((i) => i.id !== item.id))
                              }
                              className="text-neutral-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-500 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Size: {item.size} · {item.colorway.name}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-200 bg-white rounded-md">
                            <button
                              onClick={() => {
                                setCartItems((prev) =>
                                  prev
                                    .map((i) =>
                                      i.id === item.id
                                        ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                                        : i
                                    )
                                );
                              }}
                              className="px-2 py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono tabular-nums text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                setCartItems((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                                  )
                                );
                              }}
                              className="px-2 py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-bold font-mono text-neutral-900 tabular-nums">
                            ${item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Trust Badges */}
                <div className="pt-4 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-lg">
                    <Truck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Free Express Courier</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>{product.brand} Certified Premium</span>
                  </div>
                </div>
              </div>

              {/* Checkout Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-3">
                  <div className="flex justify-between text-sm font-bold text-neutral-900">
                    <span>Total</span>
                    <span className="font-mono tabular-nums text-base">${cartTotal} USD</span>
                  </div>
                  <button
                    onClick={() => {
                      showToast('Order #KL-49201 confirmed! Preparing dispatch.');
                      setIsCartOpen(false);
                      setCartItems([]);
                    }}
                    className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
