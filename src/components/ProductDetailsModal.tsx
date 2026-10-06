import React from 'react';
import { X, Sparkles, Shield, RefreshCw, Box } from 'lucide-react';
import { ProductDetail } from '../types';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetail;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              SSENSE Exclusive Selection
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 font-brand-display">
              {product.brand} {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 text-xs text-neutral-600">
          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2">
              Product Overview
            </h4>
            <p className="leading-relaxed text-neutral-700">{product.fullDescription}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-1">
              <span className="text-neutral-400 font-bold uppercase text-[10px]">Composition</span>
              <p className="font-medium text-neutral-800">{product.composition}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-1">
              <span className="text-neutral-400 font-bold uppercase text-[10px]">Origin & SKU</span>
              <p className="font-medium text-neutral-800">
                {product.madeIn} · SKU: {product.sku}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Design & Architecture Details
            </h4>
            <ul className="space-y-2 text-neutral-600 list-disc list-inside">
              <li>Low-top buffed leather and cotton canvas paneled construction</li>
              <li>Multi-tiered precision flame appliqués along lateral and medial quarters</li>
              <li>Signature rubberized Palm Angels gothic logo pull-loop at padded heel collar</li>
              <li>Cushioned footbed with gold foil debossed Palm Angels brand insignia</li>
              <li>Tonal vulcanized rubber foxing tape with front diamond-patterned scuff protector</li>
              <li>Custom waffle-herringbone outsole for grip and board feel</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neutral-800 shrink-0" />
              <span className="text-[11px] text-neutral-700">100% Genuine SSENSE Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-neutral-800 shrink-0" />
              <span className="text-[11px] text-neutral-700">Signature Box & Dustbag Included</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0" />
              <span className="text-[11px] text-neutral-700">Complimentary 30-Day Returns</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
