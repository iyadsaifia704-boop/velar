import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { VelarLogo } from './VelarLogo';

interface FooterProps {
  language: Language;
  onNavigate: (view: 'home' | 'shop' | 'lookbook' | 'about') => void;
  onOpenTracker: () => void;
  onOpenAtelier: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onOpenTracker,
  onOpenAtelier,
}) => {
  const dict = t[language];

  return (
    <footer className="w-full bg-[#070A0E] text-slate-400 border-t border-slate-850 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <VelarLogo variant="horizontal" size="md" />
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm pt-2">
              {dict.footer.aboutText}
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono tracking-wider">
              {dict.subSlogan}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">
              {dict.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  {dict.nav.shop}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lookbook')}
                  className="hover:text-white transition-colors"
                >
                  {dict.nav.lookbook}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  {dict.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAtelier}
                  className="hover:text-white transition-colors text-slate-300"
                >
                  {dict.nav.atelier}
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">
              {dict.footer.customerCare}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-white transition-colors"
                >
                  {dict.nav.trackOrder}
                </button>
              </li>
              <li>
                <span className="text-slate-400">{dict.footer.shippingReturns}</span>
              </li>
              <li>
                <span className="text-slate-400">{dict.footer.privacyTerms}</span>
              </li>
              <li className="pt-1 flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5" />
                <span className="tabular-nums font-mono">+213 (0) 550 12 34 56</span>
              </li>
            </ul>
          </div>

          {/* Salons & Boutiques */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">
              {dict.footer.flagshipTitle}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{dict.footer.flagshipAlgiers}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{dict.footer.flagshipParis}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Assurances */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{dict.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Bespoke Men's Tailoring
            </span>
            <span>·</span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Biella Wool & Mongolian Cashmere
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
