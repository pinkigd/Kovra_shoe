import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Colorway, ProductDetail, SizeOption } from '../types';
import { SneakerIllustration } from './SneakerIllustration';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetail;
  colorway: Colorway;
  size: SizeOption;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onRemoveFromWishlist: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  product,
  colorway,
  size,
  isWishlisted,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-neutral-900 text-neutral-900" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 font-brand-display">
                Wishlist
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!isWishlisted ? (
              <div className="text-center py-20 space-y-3">
                <Heart className="w-12 h-12 text-neutral-200 mx-auto" />
                <p className="text-sm font-medium text-neutral-600">Your wishlist is currently empty.</p>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Click the heart icon on any piece to save it to your private curated wishlist.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-3">
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-20 bg-white rounded-lg p-2 flex items-center justify-center border border-neutral-100 shrink-0">
                      <SneakerIllustration colorway={colorway} angle="lateral" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-neutral-900 uppercase">
                          {product.brand}
                        </span>
                        <button
                          onClick={onRemoveFromWishlist}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-600 font-medium">{product.name}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{colorway.name}</p>
                      <p className="text-xs font-bold font-brand-display text-neutral-900 mt-1 tabular-nums">
                        ${product.price} USD
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/50 flex gap-2">
                    <button
                      onClick={() => {
                        onAddToCart();
                        onClose();
                      }}
                      className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-neutral-50 border-t border-neutral-100 text-center">
            <button
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
