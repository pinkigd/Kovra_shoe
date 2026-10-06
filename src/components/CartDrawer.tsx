import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { SneakerIllustration } from './SneakerIllustration';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 300 || items.length === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
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
                ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderConfirmed ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 font-brand-display uppercase tracking-tight">
                  Order Confirmed
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your Palm Angels Flame Sneakers order #SS-84920 has been placed and is being prepared in Milan.
                </p>
                <div className="p-4 bg-neutral-50 rounded-lg text-left text-xs space-y-1.5 border border-neutral-200/60 font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Order ID:</span>
                    <span className="font-semibold text-neutral-800">#SS-84920</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Estimated Delivery:</span>
                    <span className="font-semibold text-neutral-800">2-3 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Charged:</span>
                    <span className="font-semibold text-neutral-800">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOrderConfirmed(false);
                    onClose();
                  }}
                  className="mt-4 px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-sm font-medium text-neutral-500">Your shopping bag is empty.</p>
                <p className="text-xs text-neutral-400">
                  Explore the SSENSE Palm Angels collection to add pieces to your bag.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-5 py-2 border border-neutral-300 rounded-full text-xs font-semibold uppercase tracking-wider hover:border-neutral-900 transition-colors"
                >
                  Discover Sneakers
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-neutral-50/70 rounded-xl border border-neutral-200/60"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-white rounded-lg p-1 flex items-center justify-center border border-neutral-100 shrink-0">
                      <SneakerIllustration colorway={item.colorway} angle="lateral" />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold tracking-tight text-neutral-900 uppercase">
                            PALM ANGELS
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">
                          Flame Sneakers — {item.colorway.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Size: EU {item.size.eu} (US {item.size.us})
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-neutral-200 bg-white rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono tabular-nums text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:text-neutral-900"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line price */}
                        <span className="text-xs font-bold font-brand-display text-neutral-900 tabular-nums">
                          ${item.unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (try: SSENSE10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 uppercase"
                    />
                    <button
                      onClick={() => {
                        if (promoCode.trim().toUpperCase() === 'SSENSE10') {
                          setPromoApplied(true);
                        }
                      }}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1">
                      <span>✓ 10% VIP Private Sale applied</span>
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-lg">
                    <Truck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Free Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 p-2 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>100% Authentic Guaranteed</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {!orderConfirmed && items.length > 0 && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-neutral-800">${subtotal}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>VIP Discount (10%)</span>
                    <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Express Shipping</span>
                  <span className="font-mono tabular-nums text-neutral-800">
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="font-brand-display tabular-nums text-base">
                    ${total.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                Duties & taxes calculated at checkout. Free 30-day returns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
