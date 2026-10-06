import React, { useState, useRef } from 'react';
import { ShoppingCart, Heart, ChevronDown, Check, Sparkles, Eye, Info } from 'lucide-react';
import { Colorway, ProductDetail, SizeOption } from '../types';
import { SneakerIllustration } from './SneakerIllustration';

interface FloatingSneakerHeroProps {
  product: ProductDetail;
  selectedColorway: Colorway;
  onSelectColorway: (colorway: Colorway) => void;
  selectedSize: SizeOption;
  onSelectSize: (size: SizeOption) => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onOpenDetails: () => void;
  onOpenSizeGuide: () => void;
}

export const FloatingSneakerHero: React.FC<FloatingSneakerHeroProps> = ({
  product,
  selectedColorway,
  onSelectColorway,
  selectedSize,
  onSelectSize,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenDetails,
  onOpenSizeGuide,
}) => {
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'duo' | 'lateral' | 'sole'>('duo');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt parallax for 3D depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden bg-[#fafafa] select-none"
    >
      {/* Studio Radial Vignette / Ambient Light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 1) 0%, rgba(244, 244, 245, 0.7) 60%, rgba(228, 228, 231, 0.5) 100%)',
        }}
      />

      {/* --- CENTER STAGE: FLOATING SNEAKERS --- */}
      <div className="relative flex-1 flex items-center justify-center pt-8 pb-4">
        {/* Out-of-Focus Blurred Background Sneaker (Left Side - depth of field bokeh) */}
        {viewMode === 'duo' && (
          <div
            className="absolute -left-10 md:left-[8%] top-[8%] md:top-[12%] w-[260px] md:w-[340px] pointer-events-none transition-transform duration-700 ease-out"
            style={{
              transform: `translate3d(${mousePos.x * -30}px, ${mousePos.y * -20}px, 0) rotate(${
                18 + mousePos.x * 12
              }deg)`,
              filter: 'blur(5px)',
              opacity: 0.38,
            }}
          >
            <SneakerIllustration
              colorway={selectedColorway}
              angle="lateral"
              isBackgroundBlur={true}
            />
          </div>
        )}

        {/* Primary Dynamic Floating Sneaker (Interactive tilt) */}
        <div
          className="relative z-10 w-full max-w-[580px] px-4 transition-transform duration-200 ease-out"
          style={{
            transform: isHovered
              ? `perspective(1000px) rotateY(${mousePos.x * 18}deg) rotateX(${
                  -mousePos.y * 14
                }deg) translateY(${mousePos.y * 12}px)`
              : 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)',
          }}
        >
          {viewMode === 'duo' && (
            <SneakerIllustration colorway={selectedColorway} angle="angled-stand" />
          )}

          {viewMode === 'lateral' && (
            <div className="py-12">
              <SneakerIllustration colorway={selectedColorway} angle="lateral" />
              {/* Sole shadow */}
              <div
                className="w-3/4 mx-auto h-6 rounded-full -mt-2 opacity-35"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)',
                  filter: 'blur(6px)',
                }}
              />
            </div>
          )}

          {viewMode === 'sole' && (
            <div className="py-12">
              <SneakerIllustration colorway={selectedColorway} angle="sole" />
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM SECTION: TITLE, CONTROLS, AND THUMBNAILS --- */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-10 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* LOWER LEFT: Brand Typography & Preview Drawer Box */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              {/* PALM ANGELS SHOES - Exact match with solid PALM ANGELS and hollow SHOES */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-neutral-900 font-brand-display">
                  {product.brand}
                </h1>
                <span className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-outline font-brand-display text-neutral-900">
                  {product.subBrand}
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base font-medium text-neutral-500 tracking-wide font-brand-sans">
                {product.name}
              </p>
            </div>

            {/* Bottom-left Thumbnail / Angle Switcher Box (Matches the rounded gray container in screenshot) */}
            <div className="bg-neutral-100/80 backdrop-blur-xs rounded-xl p-3 max-w-md border border-neutral-200/60 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('duo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'duo'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  3D Duo
                </button>
                <button
                  onClick={() => setViewMode('lateral')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'lateral'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setViewMode('sole')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'sole'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Outsole
                </button>
              </div>

              <button
                onClick={onOpenDetails}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors px-2 py-1"
                aria-label="View shoe details"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>
          </div>

          {/* LOWER RIGHT: Pricing, Color Swatches, Size Selector, Add to Cart & Heart */}
          <div className="lg:col-span-6 flex flex-col lg:items-end space-y-4">
            {/* Top row: Price, Color Swatches, Size Dropdown */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-start lg:justify-end">
              {/* Tabular Price (395$) */}
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 font-brand-display tabular-nums">
                {product.price}{product.currency}
              </div>

              {/* Colorway Swatches (exact 🟢 🟡 matching screenshot dots) */}
              <div className="flex items-center gap-2.5 p-1 bg-white/70 rounded-full border border-neutral-200/60 shadow-2xs">
                {product.colorways.map((cw) => {
                  const isSelected = cw.id === selectedColorway.id;
                  return (
                    <button
                      key={cw.id}
                      onClick={() => onSelectColorway(cw)}
                      className={`relative w-6 h-6 rounded-full transition-transform focus:outline-none flex items-center justify-center ${
                        isSelected ? 'scale-110 ring-2 ring-neutral-900 ring-offset-2' : 'hover:scale-105'
                      }`}
                      title={cw.name}
                      aria-label={`Select colorway: ${cw.name}`}
                    >
                      <span
                        className="w-full h-full rounded-full"
                        style={{
                          background: cw.dotColor2
                            ? `linear-gradient(135deg, ${cw.dotColor1} 50%, ${cw.dotColor2} 50%)`
                            : cw.dotColor1,
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Size Selector Dropdown (Size: 43 ⌄) */}
              <div className="relative">
                <button
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="bg-white border border-neutral-200/80 hover:border-neutral-900 px-3.5 py-2 rounded-md text-xs font-semibold tracking-wider text-neutral-800 flex items-center gap-2 transition-all shadow-2xs focus:outline-none"
                  aria-expanded={sizeDropdownOpen}
                  aria-label="Select Shoe Size"
                >
                  <span>Size: {selectedSize.eu}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                      sizeDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Options */}
                {sizeDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setSizeDropdownOpen(false)}
                    />
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 flex justify-between items-center">
                        <span>Select EU Size</span>
                        <button
                          onClick={() => {
                            setSizeDropdownOpen(false);
                            onOpenSizeGuide();
                          }}
                          className="text-neutral-900 underline hover:opacity-70 lowercase"
                        >
                          guide
                        </button>
                      </div>
                      <div className="max-h-56 overflow-y-auto py-1">
                        {product.sizes.map((s) => {
                          const isCurrent = s.eu === selectedSize.eu;
                          const isOutOfStock = s.stock === 'out-of-stock';
                          return (
                            <button
                              key={s.eu}
                              disabled={isOutOfStock}
                              onClick={() => {
                                onSelectSize(s);
                                setSizeDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-1.5 text-xs text-left rounded flex items-center justify-between transition-colors ${
                                isCurrent
                                  ? 'bg-neutral-900 text-white font-bold'
                                  : isOutOfStock
                                  ? 'text-neutral-300 line-through cursor-not-allowed'
                                  : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                              }`}
                            >
                              <span>
                                EU {s.eu} (US {s.us})
                              </span>
                              {s.stock === 'low-stock' && !isCurrent && (
                                <span className="text-[10px] text-amber-600 font-normal">
                                  Low Stock
                                </span>
                              )}
                              {isCurrent && <Check className="w-3 h-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Second row: Action Buttons (ADD TO CART + Heart Wishlist Button) */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-start lg:justify-end">
              {/* Pill shaped ADD TO CART button matching screenshot */}
              <button
                onClick={onAddToCart}
                className="group relative flex-1 sm:flex-initial bg-[#a1a1aa] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md active:scale-98"
              >
                <span>ADD TO CART</span>
                <ShoppingCart className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Heart Wishlist Button */}
              <button
                onClick={onToggleWishlist}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-xs'
                    : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isWishlisted ? 'fill-red-500 scale-110' : 'hover:scale-110'
                  }`}
                />
              </button>
            </div>

            {/* Description Line: Low-top panelled suede and canvas sneakers in white */}
            <div className="text-right w-full">
              <p
                onClick={onOpenDetails}
                className="text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors max-w-md lg:ml-auto"
              >
                {product.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
