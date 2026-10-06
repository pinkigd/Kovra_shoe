import React, { useState } from 'react';
import { ArrowLeft, Search, ShoppingBag, Globe, Check } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  activeGender: 'MEN' | 'WOMAN';
  onSelectGender: (gender: 'MEN' | 'WOMAN') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  activeGender,
  onSelectGender,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('En');

  const languages = [
    { code: 'En', label: 'English (US)' },
    { code: 'Fr', label: 'Français (CA)' },
    { code: 'Ja', label: '日本語 (JP)' },
    { code: 'Zh', label: '中文 (CN)' },
  ];

  return (
    <header className="relative z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* LEFT ZONE: Back Button */}
        <div className="flex items-center">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors focus:outline-none"
            aria-label="Back to catalog"
          >
            <span className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* CENTER ZONE: Navigation + Bold SSENSE Wordmark */}
        <div className="flex items-center gap-6 sm:gap-8 md:gap-12">
          {/* Gender navigation */}
          <div className="hidden sm:flex items-center gap-5 text-xs font-bold tracking-widest uppercase">
            <button
              onClick={() => onSelectGender('MEN')}
              className={`transition-colors relative py-1 ${
                activeGender === 'MEN' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              MEN
              {activeGender === 'MEN' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-neutral-900" />
              )}
            </button>
            <button
              onClick={() => onSelectGender('WOMAN')}
              className={`transition-colors relative py-1 ${
                activeGender === 'WOMAN' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              WOMAN
              {activeGender === 'WOMAN' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-neutral-900" />
              )}
            </button>
          </div>

          {/* Central Logo Wordmark */}
          <a
            href="/"
            className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-neutral-900 font-brand-display hover:opacity-85 transition-opacity"
            aria-label="SSENSE Home"
          >
            SSENSE
          </a>

          {/* Editorial links */}
          <div className="hidden sm:flex items-center gap-5 text-xs font-bold tracking-widest uppercase">
            <button
              onClick={onOpenWishlist}
              className="text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
            >
              WISHLIST
              {wishlistCount > 0 && (
                <span className="text-[10px] bg-neutral-900 text-white rounded-full w-4 h-4 inline-flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>
            <a
              href="#editorial-story"
              className="text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              BLOG
            </a>
          </div>
        </div>

        {/* RIGHT ZONE: Search, Shopping Bag, Language Selector */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors focus:outline-none"
            aria-label="Search SSENSE collection"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Shopping Bag Trigger with Animated Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 text-neutral-900 hover:opacity-75 transition-opacity focus:outline-none"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs animate-in zoom-in-50 duration-200">
                {cartCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 focus:outline-none transition-colors"
            >
              <span>{currentLang}</span>
              <span className="text-[10px] text-neutral-400">▾</span>
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setCurrentLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900"
                    >
                      <span>{l.label}</span>
                      {currentLang === l.code && <Check className="w-3 h-3 text-neutral-900" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
