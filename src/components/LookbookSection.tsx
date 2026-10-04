import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface LookbookSectionProps {
  language: Language;
  onExploreShop: () => void;
  onOpenAtelier: () => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  language,
  onExploreShop,
  onOpenAtelier,
}) => {
  const dict = t[language];
  const isRtl = language === 'ar';

  return (
    <section className="w-full bg-[#090C10] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold mb-2 block">
              EDITORIAL VOLUME I
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-white tracking-wide uppercase">
              {dict.sections.boutiqueTitle}
            </h2>
            <p className="text-sm text-slate-400 mt-3 font-light leading-relaxed">
              {dict.sections.boutiqueDesc}
            </p>
          </div>

          <button
            onClick={onExploreShop}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-slate-200 hover:text-white transition-colors group"
          >
            <span>{dict.hero.shopNow}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Main Large Boutique Interior Image */}
          <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[520px] overflow-hidden rounded-xs group bg-[#11161C] border border-slate-800">
            <img
              src="/src/assets/images/velar_lookbook_store_1791135798879.jpg"
              alt="VELAR Boutique Interior"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                  SPACE & ARCHITECTURE
                </span>
                <h3 className="text-lg font-medium text-white mt-1">
                  The Flagship Salons · Algiers & Paris
                </h3>
              </div>
              <button
                onClick={onOpenAtelier}
                className="text-[11px] uppercase tracking-wider text-slate-200 hover:text-white underline underline-offset-4"
              >
                Private Consultation
              </button>
            </div>
          </div>

          {/* Right Column: 2 Staggered Visual Story Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
            {/* Top Card: Model Silhouette */}
            <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-xs group bg-[#11161C] border border-slate-800">
              <img
                src="/src/assets/images/velar_hero_model_1791135788220.jpg"
                alt="VELAR Model Tailoring"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-104"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-mono">
                  LOOK 04 · URBAN MONOCHROME
                </span>
                <p className="text-xs text-slate-200 mt-0.5">
                  Double-breasted coat paired with cashmere rollneck
                </p>
              </div>
            </div>

            {/* Bottom Card: Tactile Folded Knits & Monogram */}
            <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-xs group bg-[#11161C] border border-slate-800">
              <img
                src="/src/assets/images/velar_product_polo_1791135829104.jpg"
                alt="Tactile Luxury Knits"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-mono">
                  TACTILE HERITAGE
                </span>
                <p className="text-xs text-slate-200 mt-0.5">
                  Mercerized Egyptian Giza knitwear & fine wool flannel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
