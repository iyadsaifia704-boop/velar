import React from 'react';
import { Gem, ShieldCheck, Crown, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { VelarLogo } from './VelarLogo';

interface BrandStatementProps {
  language: Language;
  onExploreMore: () => void;
}

export const BrandStatement: React.FC<BrandStatementProps> = ({
  language,
  onExploreMore,
}) => {
  const dict = t[language];

  const values = [
    {
      icon: Gem,
      title: dict.values.materialsTitle,
      description: dict.values.materialsDesc,
    },
    {
      icon: ShieldCheck,
      title: dict.values.fitTitle,
      description: dict.values.fitDesc,
    },
    {
      icon: Crown,
      title: dict.values.styleTitle,
      description: dict.values.styleDesc,
    },
    {
      icon: Sparkles,
      title: dict.values.detailTitle,
      description: dict.values.detailDesc,
    },
  ];

  return (
    <section className="w-full bg-[#0B0E14] border-y border-slate-800/80 py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle radial aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Brand Statement */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex justify-center mb-6">
            <VelarLogo variant="mark-only" size="md" />
          </div>

          <div className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold mb-4">
            {dict.sections.brandStatementLead}
          </div>

          <h2 className="text-2xl sm:text-4xl font-light text-white tracking-wide uppercase mb-6 font-display">
            MORE THAN CLOTHES. IT’S A LIFESTYLE.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {dict.sections.brandStatementBody}
          </p>
        </div>

        {/* 4 Pillars of Excellence (Exact counterpart to brand board footer) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-slate-800/80">
          {values.map((v, index) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="flex flex-col items-center sm:items-start text-center sm:text-start group"
              >
                <div className="w-10 h-10 rounded-xs bg-[#141A22] border border-slate-800 flex items-center justify-center text-slate-300 mb-4 transition-colors group-hover:border-slate-600 group-hover:text-white">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-mono mb-1">
                  0{index + 1}
                </div>
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
