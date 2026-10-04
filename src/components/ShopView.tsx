import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, RotateCcw } from 'lucide-react';
import { Product, Language, Currency } from '../types';
import { VELAR_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { t } from '../utils/translations';

interface ShopViewProps {
  language: Language;
  currency: Currency;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, color: string, size: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  language,
  currency,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  const dict = t[language];

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(75000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Available Filter Options
  const categories = [
    { id: 'all', label: dict.shop.all },
    { id: 'coats', label: language === 'ar' ? 'المعاطف الفاخرة' : 'Luxury Coats' },
    { id: 'blazers', label: language === 'ar' ? 'البدل والسترات' : 'Suits & Blazers' },
    { id: 'knitwear', label: language === 'ar' ? 'المحبوكات الصوفية' : 'Fine Knitwear' },
    { id: 'polos', label: language === 'ar' ? 'قمصان البولو' : 'Mercerized Polos' },
    { id: 'trousers', label: language === 'ar' ? 'البناطيل الصوفية' : 'Tailored Trousers' },
  ];

  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL', '48', '50', '52', '54'];
  const colors = ['all', 'Charcoal Slate', 'Midnight Navy', 'Heather Slate', 'Chalk Off-White', 'Obsidian Black'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return VELAR_PRODUCTS.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      // Price
      if (p.priceDZD > priceMax) return false;
      // In Stock
      if (inStockOnly && p.stockCount <= 0) return false;
      // Size
      if (selectedSize !== 'all') {
        const hasSize = p.sizes.some((s) => s.includes(selectedSize));
        if (!hasSize) return false;
      }
      // Color
      if (selectedColor !== 'all') {
        const hasColor = p.colors.some((c) => c.colorName.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceDZD - b.priceDZD;
      if (sortBy === 'price-desc') return b.priceDZD - a.priceDZD;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, priceMax, inStockOnly, selectedSize, selectedColor, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setPriceMax(75000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    priceMax < 75000 ||
    inStockOnly;

  return (
    <div className="w-full bg-[#090C10] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb Header */}
        <div className="pb-8 border-b border-slate-800/80 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-semibold block mb-2">
              READY-TO-WEAR & SARTORIAL ATELIER
            </span>
            <h1 className="text-2xl sm:text-4xl font-light text-white uppercase tracking-wide font-display">
              {dict.nav.shop}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              {filteredProducts.length} {dict.shop.itemsFound}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 border border-slate-800 rounded-xs bg-[#11161C] px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={dict.shop.sortBy}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#11161C]">{dict.shop.sortFeatured}</option>
                <option value="price-asc" className="bg-[#11161C]">{dict.shop.sortPriceAsc}</option>
                <option value="price-desc" className="bg-[#11161C]">{dict.shop.sortPriceDesc}</option>
                <option value="newest" className="bg-[#11161C]">{dict.shop.sortNewest}</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 border border-slate-800 rounded-xs bg-[#11161C] px-3 py-1.5 text-xs text-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{dict.shop.filterCategory}</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Bar (Interactive segmented controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xs text-xs uppercase tracking-wider font-medium transition-colors whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'border-white bg-white text-slate-950 font-semibold shadow-xs'
                  : 'border-slate-800 bg-[#11161C] text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Layout: Sidebar Filters (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside className={`lg:col-span-1 space-y-6 bg-[#0D1117] p-5 border border-slate-800/80 rounded-xs ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                {language === 'ar' ? 'تصفية المنتجات' : 'Filter Garments'}
              </span>
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
              )}
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-2">
                <span>{dict.shop.filterPrice}</span>
                <span className="font-semibold text-white tabular-nums">
                  {priceMax.toLocaleString()} DZD
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="75000"
                step="2000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-white h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sizes */}
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2.5">
                {dict.shop.filterSize}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-xs border transition-colors ${
                      selectedSize === s
                        ? 'border-white bg-white text-slate-950 font-semibold'
                        : 'border-slate-800 bg-[#121820] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2.5">
                {dict.shop.filterColor}
              </span>
              <div className="space-y-1.5 text-xs">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-full text-start px-2 py-1 rounded transition-colors flex items-center justify-between ${
                      selectedColor === c
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{c}</span>
                    {selectedColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock toggle */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-white"
                />
                <span>{dict.shop.inStock}</span>
              </label>
            </div>
          </aside>

          {/* Product Grid (3 columns on desktop, 2 on tablet/mobile) */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#0D1117] border border-slate-800 rounded-xs p-8">
                <p className="text-slate-300 text-sm font-light mb-4">
                  {language === 'ar'
                    ? 'لم يتم العثور على قطع تطابق معايير التصفية الحالية.'
                    : 'No garments found matching current filter parameters.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-white text-slate-950 text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إلغاء التصفية' : 'Clear Filters'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    language={language}
                    currency={currency}
                    isWishlisted={wishlist.some((w) => w.id === prod.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onQuickAdd={onQuickAdd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
