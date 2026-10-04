import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, Globe, Compass } from 'lucide-react';
import { VelarLogo } from './VelarLogo';
import { Language, Currency } from '../types';
import { t } from '../utils/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAtelier: () => void;
  onOpenTracker: () => void;
  currentView: string;
  onNavigate: (view: 'home' | 'shop' | 'lookbook' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAtelier,
  onOpenTracker,
  currentView,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dict = t[language];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090C10]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      {/* Discreet top bar banner with free shipping notice */}
      <div className="bg-[#11161B] text-slate-400 text-[11px] font-medium py-1 px-4 text-center tracking-wider border-b border-slate-800/40 hidden sm:block">
        <span>{language === 'ar' ? 'توصيل مجاني لكافة ولايات الجزائر الـ 58 للطلبات فوق 30,000 د.ج · الدفع عند الاستلام' : language === 'fr' ? 'Livraison express offerte dès 30 000 DZD · Paiement à la livraison' : 'Complimentary express courier across Algeria over 30,000 DZD · Cash on Delivery'}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Brand title / Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 transition-opacity hover:opacity-90"
            aria-label="VELAR Home"
          >
            <VelarLogo variant="horizontal" size="sm" />
          </button>
        </div>

        {/* Zone 2: Navigation links (clean typography, single-line) */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-slate-300">
          <button
            onClick={() => onNavigate('shop')}
            className={`transition-colors hover:text-white py-1 relative ${
              currentView === 'shop' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {dict.nav.shop}
            {currentView === 'shop' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200" />
            )}
          </button>

          <button
            onClick={() => {
              onNavigate('home');
              const el = document.getElementById('featured-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="transition-colors hover:text-white py-1 text-slate-400"
          >
            {dict.nav.newArrivals}
          </button>

          <button
            onClick={() => onNavigate('lookbook')}
            className={`transition-colors hover:text-white py-1 relative ${
              currentView === 'lookbook' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {dict.nav.lookbook}
            {currentView === 'lookbook' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200" />
            )}
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors hover:text-white py-1 relative ${
              currentView === 'about' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {dict.nav.about}
            {currentView === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200" />
            )}
          </button>

          {/* Atelier AI Stylist trigger */}
          <button
            onClick={onOpenAtelier}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            <span>{dict.nav.atelier}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Track order affordance */}
          <button
            onClick={onOpenTracker}
            className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 uppercase tracking-wider py-1"
            title={dict.nav.trackOrder}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{dict.nav.trackOrder}</span>
          </button>

          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center border border-slate-800 rounded bg-slate-900/50 p-0.5 text-[10px] font-semibold text-slate-400">
            <button
              onClick={() => onCurrencyChange('DZD')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currency === 'DZD' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
              }`}
            >
              DZD
            </button>
            <button
              onClick={() => onCurrencyChange('EUR')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currency === 'EUR' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
              }`}
            >
              EUR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currency === 'USD' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
              }`}
            >
              USD
            </button>
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white p-1.5 rounded transition-colors focus:outline-none"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {language}
              </span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#141A22] border border-slate-800 shadow-xl rounded-sm py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    onLanguageChange('ar');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-right px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    language === 'ar' ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span>العربية</span>
                  <span className="text-[10px] text-slate-500">DZ / AR</span>
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    language === 'en' ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span>English</span>
                  <span className="text-[10px] text-slate-500">EN</span>
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('fr');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    language === 'fr' ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span>Français</span>
                  <span className="text-[10px] text-slate-500">FR</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-slate-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Search Collection"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={onOpenWishlist}
            className="p-1.5 text-slate-300 hover:text-white transition-colors relative focus:outline-none"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-slate-200 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 p-1.5 text-slate-300 hover:text-white transition-colors relative focus:outline-none group"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
            {cartCount > 0 && (
              <span className="bg-white text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1117] border-b border-slate-800 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-medium tracking-wider uppercase text-slate-300">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 border-b border-slate-800/60 hover:text-white"
            >
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 border-b border-slate-800/60 hover:text-white"
            >
              {dict.nav.shop}
            </button>
            <button
              onClick={() => {
                onNavigate('lookbook');
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 border-b border-slate-800/60 hover:text-white"
            >
              {dict.nav.lookbook}
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 border-b border-slate-800/60 hover:text-white"
            >
              {dict.nav.about}
            </button>
            <button
              onClick={() => {
                onOpenAtelier();
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 border-b border-slate-800/60 flex items-center justify-between text-slate-200 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-400" />
                {dict.nav.atelier}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">AI Concierge</span>
            </button>
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="text-start py-2 flex items-center gap-2 text-slate-400 hover:text-slate-200"
            >
              <Compass className="w-4 h-4" />
              {dict.nav.trackOrder}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{language === 'ar' ? 'العملة المختارة:' : 'Currency:'}</span>
            <div className="flex gap-2">
              {(['DZD', 'EUR', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2 py-1 rounded text-xs ${
                    currency === c ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
