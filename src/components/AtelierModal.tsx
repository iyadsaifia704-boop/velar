import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  Brain,
  Search,
  Image as ImageIcon,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle,
  Camera,
} from 'lucide-react';
import { Language, Product } from '../types';
import { t } from '../utils/translations';
import { VelarLogo } from './VelarLogo';

interface AtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  presetProduct?: Product | null;
}

export const AtelierModal: React.FC<AtelierModalProps> = ({
  isOpen,
  onClose,
  language,
  presetProduct,
}) => {
  if (!isOpen) return null;

  const dict = t[language];
  const [activeTab, setActiveTab] = useState<'analyze' | 'consult' | 'trends' | 'generator'>('analyze');

  // 1. Image Diagnostic State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageQuestion, setImageQuestion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisModel, setAnalysisModel] = useState<string | null>(null);

  // 2. High Thinking Consulting State
  const [consultPrompt, setConsultPrompt] = useState(
    presetProduct
      ? `ما هي أفضل القطع لتنسيق إطلالة راقية مع ${presetProduct.name.ar} في مناسبة مسائية فاخرة؟`
      : ''
  );
  const [consulting, setConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<string | null>(null);
  const [consultModel, setConsultModel] = useState<string | null>(null);

  // 3. Trends Grounding State
  const [trendsQuery, setTrendsQuery] = useState(
    language === 'ar' ? 'أحدث اتجاهات خياطة البدل الرجالية والقصات الإيطالية في Pitti Uomo 2026' : 'Latest luxury menswear tailoring trends Pitti Uomo 2026'
  );
  const [searchingTrends, setSearchingTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<string | null>(null);
  const [trendsModel, setTrendsModel] = useState<string | null>(null);

  // 4. Image Generation State
  const [genPrompt, setGenPrompt] = useState(
    language === 'ar'
      ? 'رجل أعمال أنيق يرتدي معطف فيلار كشمير رمادي مزدوج الصدر وبنطال صوف فلانيل كحلي في شوارع باريس'
      : 'Sharp gentleman in charcoal VELAR double-breasted cashmere overcoat and dark turtleneck in Milan'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'3:4' | '16:9' | '1:1'>('3:4');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  // Handle Photo File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Run Image Analysis (gemini-3.1-pro-preview)
  const handleRunAnalysis = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/atelier/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          question: imageQuestion,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed analysis');

      setAnalysisResult(data.text);
      setAnalysisModel(data.modelUsed);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error processing analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  // Run High Thinking Sartorial Consultation (gemini-3.1-pro-preview, ThinkingLevel.HIGH)
  const handleRunConsultation = async () => {
    if (!consultPrompt.trim()) return;
    setConsulting(true);
    setErrorMessage('');
    setConsultResult(null);

    try {
      const res = await fetch('/api/atelier/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: consultPrompt,
          language,
          context: presetProduct ? `Focus piece: ${presetProduct.name[language]}` : '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed consultation');

      setConsultResult(data.text);
      setConsultModel(data.modelUsed);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error during consultation');
    } finally {
      setConsulting(false);
    }
  };

  // Run Trends Grounding (gemini-3.5-flash with googleSearch)
  const handleRunTrendsSearch = async () => {
    if (!trendsQuery.trim()) return;
    setSearchingTrends(true);
    setErrorMessage('');
    setTrendsResult(null);

    try {
      const res = await fetch('/api/atelier/search-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trendsQuery,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed trends query');

      setTrendsResult(data.text);
      setTrendsModel(data.modelUsed);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error retrieving trends');
    } finally {
      setSearchingTrends(false);
    }
  };

  // Run Image Generation (gemini-3-pro-image-preview with 1K, 2K, 4K affordance)
  const handleGenerateConceptImage = async () => {
    if (!genPrompt.trim()) return;
    setGeneratingImage(true);
    setErrorMessage('');
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/atelier/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: genPrompt,
          size: imageSize,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed image generation');

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error generating image concept');
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0B0E14] border border-slate-800 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0F141C] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <VelarLogo variant="mark-only" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-light text-white uppercase tracking-wider">
                  {dict.atelier.title}
                </h2>
                <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-xs tracking-wider">
                  {dict.atelier.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-light">
                {dict.atelier.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Atelier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls (Interactive Filter Controls) */}
        <div className="flex items-center gap-1 p-2 bg-[#090C10] border-b border-slate-800 overflow-x-auto shrink-0 text-xs">
          <button
            onClick={() => {
              setActiveTab('analyze');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xs font-medium uppercase tracking-wider text-[11px] transition-colors whitespace-nowrap ${
              activeTab === 'analyze'
                ? 'bg-[#18202A] text-white border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{dict.atelier.tabAnalyze}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('consult');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xs font-medium uppercase tracking-wider text-[11px] transition-colors whitespace-nowrap ${
              activeTab === 'consult'
                ? 'bg-[#18202A] text-white border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{dict.atelier.tabConsult}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('trends');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xs font-medium uppercase tracking-wider text-[11px] transition-colors whitespace-nowrap ${
              activeTab === 'trends'
                ? 'bg-[#18202A] text-white border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{dict.atelier.tabTrends}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('generator');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xs font-medium uppercase tracking-wider text-[11px] transition-colors whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-[#18202A] text-white border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{dict.atelier.tabGenerator}</span>
          </button>
        </div>

        {/* Tab Content Stage */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xs text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: Photo Fit & Silhouette Diagnostic (gemini-3.1-pro-preview) */}
          {activeTab === 'analyze' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#121822] border border-slate-800 rounded-xs">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200 mb-1">
                  1. {dict.atelier.tabAnalyze}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  {dict.atelier.uploadPrompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Upload Box */}
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xs hover:border-slate-600 bg-[#0F141C] text-center">
                  {selectedImage ? (
                    <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-xs border border-slate-700 mb-4">
                      <img
                        src={selectedImage}
                        alt="Uploaded silhouette"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 py-6">
                      <div className="w-12 h-12 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-300">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-200 font-medium block">
                          {language === 'ar' ? 'اسحب الصورة هنا أو اختر ملفاً' : 'Select or drop photograph here'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          PNG, JPG up to 10MB
                        </span>
                      </div>
                    </div>
                  )}

                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-xs transition-colors mt-2">
                    <span>{dict.atelier.uploadBtn}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Question & Run Button */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                      {language === 'ar' ? 'سؤالك للخبير (اختياري):' : 'Specific inquiry for Master Tailor:'}
                    </label>
                    <textarea
                      rows={3}
                      value={imageQuestion}
                      onChange={(e) => setImageQuestion(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'مثال: هل قصة الأكتاف ملائمة لبنيتي؟ وما هو المقاس الأمثل لي في معطف فيلار؟'
                          : 'e.g. Does this jacket shoulder pitch suit my posture, and which VELAR coat pairs best?'
                      }
                      className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleRunAnalysis}
                    disabled={!selectedImage || analyzing}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-[0.2em] py-3.5 px-6 rounded-xs transition-colors shadow-lg disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{dict.atelier.generating}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{dict.atelier.analyzeBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Result Stage */}
              {analysisResult && (
                <div className="p-6 bg-[#111720] border border-slate-800 rounded-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-200 uppercase tracking-widest">
                      {language === 'ar' ? 'تقرير المستشار الشخصي لعلامة فيلار' : 'VELAR Sartorial Consultation Report'}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {analysisModel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-light">
                    {analysisResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Master Tailor Advisory with High Thinking (gemini-3.1-pro-preview, ThinkingLevel.HIGH) */}
          {activeTab === 'consult' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#121822] border border-slate-800 rounded-xs">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">
                    2. {dict.atelier.tabConsult} (Thinking: HIGH)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-light mt-1">
                  {dict.atelier.consultPrompt}
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  rows={4}
                  value={consultPrompt}
                  onChange={(e) => setConsultPrompt(e.target.value)}
                  placeholder={dict.atelier.consultInputPlaceholder}
                  className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs p-4 text-xs text-white placeholder-slate-600 focus:outline-none leading-relaxed"
                />

                <button
                  onClick={handleRunConsultation}
                  disabled={!consultPrompt.trim() || consulting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-[0.2em] py-3.5 px-8 rounded-xs transition-colors shadow-lg disabled:opacity-50"
                >
                  {consulting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'ar' ? 'الخياط يفكر بعمق (High Thinking)...' : 'Deliberating Sartorial Nuance...'}</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>{dict.atelier.askConsultantBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {consultResult && (
                <div className="p-6 bg-[#111720] border border-slate-800 rounded-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-200 uppercase tracking-widest">
                      {language === 'ar' ? 'التوجيه السارتوريالي المعمق' : 'Master Tailor Deep Guidance'}
                    </span>
                    <span className="font-mono text-[10px] text-purple-400">
                      {consultModel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-light">
                    {consultResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Global Menswear Intelligence via Google Search (gemini-3.5-flash) */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#121822] border border-slate-800 rounded-xs">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">
                    3. {dict.atelier.tabTrends} (Google Search Grounding)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-light mt-1">
                  {dict.atelier.trendsPrompt}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={trendsQuery}
                  onChange={(e) => setTrendsQuery(e.target.value)}
                  placeholder={dict.atelier.trendsPlaceholder}
                  className="flex-1 bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                />

                <button
                  onClick={handleRunTrendsSearch}
                  disabled={!trendsQuery.trim() || searchingTrends}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-xs transition-colors shadow-sm disabled:opacity-50 shrink-0"
                >
                  {searchingTrends ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.atelier.generating}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{dict.atelier.searchTrendsBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {trendsResult && (
                <div className="p-6 bg-[#111720] border border-slate-800 rounded-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-200 uppercase tracking-widest">
                      {language === 'ar' ? 'تقرير التوجهات الموثق بالبحث المباشر' : 'Live Grounded Fashion Intelligence'}
                    </span>
                    <span className="font-mono text-[10px] text-sky-400">
                      {trendsModel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-light">
                    {trendsResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: High-Quality Bespoke Look Visualizer (gemini-3-pro-image-preview, 1K/2K/4K) */}
          {activeTab === 'generator' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#121822] border border-slate-800 rounded-xs">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-200">
                    4. {dict.atelier.tabGenerator} (gemini-3-pro-image-preview)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-light mt-1">
                  {dict.atelier.genPrompt}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    {language === 'ar' ? 'وصف الإطلالة المراد تخيلها:' : 'Describe custom bespoke look concept:'}
                  </label>
                  <textarea
                    rows={3}
                    value={genPrompt}
                    onChange={(e) => setGenPrompt(e.target.value)}
                    placeholder={dict.atelier.genInputPlaceholder}
                    className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Resolution Affordance (1K, 2K, 4K as requested) & Aspect Ratio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Resolution Selector */}
                  <div>
                    <span className="block text-xs text-slate-400 mb-2 font-medium">
                      {dict.atelier.resolution}
                    </span>
                    <div className="flex items-center gap-2">
                      {(['1K', '2K', '4K'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setImageSize(sz)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-xs border transition-colors ${
                            imageSize === sz
                              ? 'border-white bg-white text-slate-950'
                              : 'border-slate-800 bg-[#121820] text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div>
                    <span className="block text-xs text-slate-400 mb-2 font-medium">
                      {language === 'ar' ? 'نسبة الأبعاد' : 'Aspect Ratio'}
                    </span>
                    <div className="flex items-center gap-2">
                      {(['3:4', '16:9', '1:1'] as const).map((ar) => (
                        <button
                          key={ar}
                          type="button"
                          onClick={() => setAspectRatio(ar)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-xs border transition-colors ${
                            aspectRatio === ar
                              ? 'border-white bg-white text-slate-950'
                              : 'border-slate-800 bg-[#121820] text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateConceptImage}
                  disabled={!genPrompt.trim() || generatingImage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-[0.2em] py-3.5 px-8 rounded-xs transition-colors shadow-lg disabled:opacity-50"
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.atelier.generating}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{dict.atelier.generateBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Image Result */}
              {generatedImageUrl && (
                <div className="p-6 bg-[#111720] border border-slate-800 rounded-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                    <span className="font-semibold uppercase tracking-wider">
                      {language === 'ar' ? 'التصور المرئي النهائي' : 'Bespoke Concept Render'} ({imageSize})
                    </span>
                    <a
                      href={generatedImageUrl}
                      download={`velar-bespoke-concept-${imageSize}.png`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white uppercase tracking-wider"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تحميل الصورة' : 'Download'}</span>
                    </a>
                  </div>

                  <div className="max-w-md mx-auto aspect-[3/4] overflow-hidden rounded-xs border border-slate-700 bg-black">
                    <img
                      src={generatedImageUrl}
                      alt="Generated Bespoke Look"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
