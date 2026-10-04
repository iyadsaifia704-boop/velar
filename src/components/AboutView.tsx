import React from 'react';
import { ShieldCheck, Gem, Crown, Sparkles, MapPin } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { VelarLogo } from './VelarLogo';

interface AboutViewProps {
  language: Language;
  onExploreShop: () => void;
  onOpenAtelier: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  language,
  onExploreShop,
  onOpenAtelier,
}) => {
  const dict = t[language];

  return (
    <div className="w-full bg-[#090C10] py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <VelarLogo variant="mark-only" size="lg" className="mx-auto mb-6" />
          <span className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold mb-3 block">
            THE HOUSE OF VELAR
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-wide uppercase font-display mb-6">
            MORE THAN CLOTHES. IT’S A LIFESTYLE.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            {language === 'ar'
              ? 'تأسست دار فيلار لتكون الملاذ السارتوريالي للرجل العصري الذي يرفض الموضة الاستهلاكية السريعة. نؤمن بأن الحضور الحقيقي لا يحتاج إلى صخب أو شعارات فاقعة، بل ينبع من دقة القصة، ونقاء النسيج، وهيبة الخطوط المعمارية.'
              : 'The House of VELAR was established as a sartorial refuge for the discerning gentleman. We believe authentic poise requires neither loudness nor transient logos, but the unyielding discipline of architectural tailoring and pure noble textiles.'}
          </p>
        </div>

        {/* Visual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-slate-800 bg-[#11161C]">
            <img
              src="/src/assets/images/velar_lookbook_store_1791135798879.jpg"
              alt="Boutique Architecture"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              01 · TEXTILE SOURCING
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white uppercase tracking-wide">
              {language === 'ar' ? 'أندر أنسجة العالم: صوف بييلا وكشمير منغوليا' : 'Biella Mills & Mongolian Highlands'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              {language === 'ar'
                ? 'نتعامل مباشرة مع أرقى معامل النسيج الإيطالية في منطقة بييلا لتوفير صوف سوبر 130 و150 معالج بمياه الألب النقية، إلى جانب كشمير نقي من هضاب منغوليا يتم فحصه يدويًا لضمان النعومة الفائقة والعزل الحراري الخفيف.'
                : 'We collaborate directly with venerable historic mills in Biella, Italy, spinning Super 130s and 150s virgin wool rinsed in pristine alpine streams, combined with unadulterated Mongolian cashmere for weightless warmth.'}
            </p>
          </div>
        </div>

        {/* Second Pillar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
          <div className="space-y-4 md:order-2">
            <div className="aspect-[4/3] rounded-xs overflow-hidden border border-slate-800 bg-[#11161C]">
              <img
                src="/src/assets/images/velar_hero_model_1791135788220.jpg"
                alt="Architectural Tailoring"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="space-y-4 md:order-1">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              02 · THE BESPOKE BLUEPRINT
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white uppercase tracking-wide">
              {language === 'ar' ? 'هندسة الكتف النابولي والكانفاس الكامل' : 'The Neapolitan Shoulder & Full Canvas'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              {language === 'ar'
                ? 'لا نستخدم الحشوات اللاصقة الرخيصة المنتشرة في السوق التجاري. تعتمد سترات فيلار ومعاطفها على بطانة كانفاس طبيعية من شعر الخيل والكتان، تتشكل بانسيابية مع جسدك بمرور الوقت وتمنحك راحة تامة لا تقيد حركتك اليومية.'
                : 'We strictly reject synthetic fusing. Every VELAR jacket and coat is anchored with floating horsehair and linen canvassing that molds organically to your unique posture, maintaining sovereign chest poise.'}
            </p>
          </div>
        </div>

        {/* Salons Map / Address */}
        <div className="p-8 bg-[#11161C] border border-slate-800 rounded-xs text-center space-y-6">
          <h3 className="text-lg font-light text-white uppercase tracking-wider">
            {dict.footer.flagshipTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-[#0D1117] border border-slate-800/80 rounded-xs space-y-2">
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Alger Flagship Salon</span>
              </div>
              <p className="text-slate-400 font-light">
                Boulevard Sidi Yahia, Hydra, Alger, Algérie
              </p>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Direct Consultations & Private Fittings
              </span>
            </div>

            <div className="p-4 bg-[#0D1117] border border-slate-800/80 rounded-xs space-y-2">
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Paris Atelier & Showroom</span>
              </div>
              <p className="text-slate-400 font-light">
                Rue du Faubourg Saint-Honoré, 75008 Paris, France
              </p>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                By Private Appointment Only
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onExploreShop}
              className="bg-white hover:bg-slate-200 text-slate-950 text-xs uppercase tracking-[0.2em] font-semibold py-3 px-6 rounded-xs transition-colors shadow-sm"
            >
              {dict.hero.shopNow}
            </button>
            <button
              onClick={onOpenAtelier}
              className="border border-slate-700 hover:border-slate-400 text-slate-200 hover:text-white text-xs uppercase tracking-[0.2em] font-semibold py-3 px-6 rounded-xs transition-colors"
            >
              {dict.nav.atelier}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
