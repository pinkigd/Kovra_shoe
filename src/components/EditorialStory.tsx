import React from 'react';
import { ArrowRight, Flame, Sparkles, Check } from 'lucide-react';
import { RELATED_PRODUCTS } from '../data/products';

interface EditorialStoryProps {
  onQuickAddRelated: (item: (typeof RELATED_PRODUCTS)[0]) => void;
}

export const EditorialStory: React.FC<EditorialStoryProps> = ({ onQuickAddRelated }) => {
  return (
    <section id="editorial-story" className="w-full bg-white border-t border-neutral-100 py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Editorial Split Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 font-mono">
              Editorial Feature · SSENSE Journal
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 font-brand-display leading-tight">
              Igniting Venice Beach Subculture
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-brand-sans">
            <p>
              Conceived by artistic director Francesco Ragazzi, Palm Angels began as a photographic
              documentary of Los Angeles skate culture before evolving into a world-defining luxury
              streetwear powerhouse. The <strong>Flame Low-Top Sneaker</strong> embodies this
              collision of raw Californian skate energy and Milanese sartorial leathercraft.
            </p>
            <p>
              Each pair is constructed in Italy using full-grain calfskin and cotton canvas, adorned
              with electric flame cutouts that lick up the profile with razor precision. Balanced by
              an archival vulcanized rubber waffle cupsole, it delivers an uncompromising statement
              on asphalt and red carpets alike.
            </p>
          </div>
        </div>

        {/* 3 Core Highlights (Clean unboxed editorial format, WCAG compliant) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-neutral-100">
          <div className="space-y-2">
            <span className="text-xs font-mono text-neutral-400">01.</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-brand-display">
              Milanese Leathercraft
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Hand-finished buffed calfskin quarters paired with supple cotton canvas lining for
              breathable durability.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-neutral-400">02.</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-brand-display">
              Subcultural Flame Motif
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Multi-tiered heat-bonded flame appliqués with precision micro-stitching and high-vis
              neon edge definition.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-neutral-400">03.</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-brand-display">
              Vulcanized Rubber Sole
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              High-abrasion rubber outsole with front scuff guard bumper, diamond tread, and
              debossed Palm Angels brand signature.
            </p>
          </div>
        </div>

        {/* Complete The Look / Related Collection */}
        <div className="space-y-6 pt-10 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                Styling Curation
              </span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-neutral-900 font-brand-display">
                Style With The Flame Collection
              </h3>
            </div>
            <a
              href="#top"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {RELATED_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="group p-5 bg-[#fafafa] rounded-2xl border border-neutral-200/60 hover:border-neutral-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {prod.tag}
                    </span>
                    <span className="text-xs font-bold font-brand-display text-neutral-900 tabular-nums">
                      ${prod.price} USD
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase text-neutral-900">{prod.brand}</h4>
                  <p className="text-sm font-medium text-neutral-700 mt-1">{prod.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{prod.color}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/50 flex justify-between items-center">
                  <button
                    onClick={() => onQuickAddRelated(prod)}
                    className="w-full py-2 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white rounded-lg border border-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                  >
                    Quick Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & SSENSE guarantee */}
        <footer className="pt-12 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 font-brand-display">SSENSE</span>
            <span>© 2026 SSENSE. All rights reserved. Palm Angels Official Retailer.</span>
          </div>
          <div className="flex gap-6 uppercase tracking-wider text-[11px]">
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Terms of Sale
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Client Care
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};
