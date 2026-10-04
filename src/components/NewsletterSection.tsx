import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface NewsletterSectionProps {
  language: Language;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ language }) => {
  const dict = t[language];
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#0D1117] py-20 border-t border-slate-800/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-semibold mb-3 block">
          PRIVATE MEMBERSHIP
        </span>

        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide uppercase font-display mb-4">
          {dict.newsletter.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 font-light max-w-lg mx-auto leading-relaxed mb-8">
          {dict.newsletter.subtitle}
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xs inline-flex items-center gap-2 text-emerald-300 text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{dict.newsletter.success}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.newsletter.placeholder}
              className="flex-1 bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-slate-200 text-slate-950 text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-xs transition-colors shadow-sm disabled:opacity-50 shrink-0"
            >
              {loading ? '...' : dict.newsletter.subscribeBtn}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
