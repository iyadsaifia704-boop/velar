import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface HeroSectionProps {
  language: Language;
  onShopClick: () => void;
  onLookbookClick: () => void;
  onAtelierClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onShopClick,
  onLookbookClick,
  onAtelierClick,
}) => {
  const dict = t[language];
  const isRtl = language === 'ar';

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center bg-[#090C10] overflow-hidden">
      {/* Background Cinematic Model Fashion Image with Measured Luxury Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/velar_hero_model_1791135788220.jpg"
          alt="VELAR Autumn Winter Campaign"
          className="w-full h-full object-cover object-top opacity-55 scale-100 transition-transform duration-1000 ease-out hover:scale-102"
          referrerPolicy="no-referrer"
        />
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090C10] via-[#090C10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090C10]/90 via-[#090C10]/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl">
          {/* Tagline / Subtitle */}
          <div className="inline-flex items-center gap-3 text-slate-400 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-5">
            <span className="w-8 h-px bg-slate-500" />
            <span>{dict.hero.tag}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 leading-[1.15] text-balance">
            {dict.hero.title}
          </h1>

          {/* Slogan & Description */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-4 max-w-xl">
            {dict.hero.description}
          </p>

          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium mb-10">
            {dict.subSlogan}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <button
              onClick={onShopClick}
              className="group inline-flex items-center gap-3 bg-white text-slate-950 hover:bg-slate-200 text-xs font-semibold uppercase tracking-[0.2em] px-7 py-3.5 rounded-sm transition-all duration-200 shadow-lg hover:shadow-white/10"
            >
              <span>{dict.hero.shopNow}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            <button
              onClick={onLookbookClick}
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-400 text-slate-200 hover:text-white text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 rounded-sm transition-colors backdrop-blur-xs bg-slate-950/40"
            >
              <span>{dict.hero.exploreLookbook}</span>
            </button>

            <button
              onClick={onAtelierClick}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium uppercase tracking-[0.15em] px-3 py-3 transition-colors group"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
              <span className="underline underline-offset-4 decoration-slate-700 group-hover:decoration-slate-400">
                {dict.hero.atelierCta}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle bottom scroll prompt */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-500 text-[10px] tracking-[0.25em] uppercase">
        <span className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  );
};
