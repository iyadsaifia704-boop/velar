import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandStatement } from './components/BrandStatement';
import { LookbookSection } from './components/LookbookSection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SearchModal } from './components/SearchModal';
import { AtelierModal } from './components/AtelierModal';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ShopView } from './components/ShopView';
import { AboutView } from './components/AboutView';
import { VELAR_PRODUCTS } from './data/products';
import { Product, CartItem, Language, Currency, Order } from './types';
import { t } from './utils/translations';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Localization & Currency State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('velar_lang') as Language) || 'ar';
  });
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('velar_curr') as Currency) || 'DZD';
  });

  // Navigation View
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'lookbook' | 'about'>('home');

  // E-Commerce State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('velar_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Controls
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [atelierOpen, setAtelierOpen] = useState(false);
  const [atelierPresetProduct, setAtelierPresetProduct] = useState<Product | null>(null);

  // Sync Language and Direction in DOM
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('velar_lang', language);
  }, [language]);

  // Persist Currency
  useEffect(() => {
    localStorage.setItem('velar_curr', currency);
  }, [currency]);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('velar_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('velar_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleAddToCart = (
    product: Product,
    selectedColor: string,
    selectedSize: string,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          selectedColor,
          selectedSize,
          quantity,
        },
      ];
    });

    // Open Mini-Cart Drawer with smooth micro-interaction
    setCartOpen(true);
  };

  const handleQuickAdd = (product: Product, color: string, size: string) => {
    handleAddToCart(product, color, size, 1);
  };

  const handleBuyNow = (
    product: Product,
    color: string,
    size: string,
    quantity: number
  ) => {
    handleAddToCart(product, color, size, quantity);
    setSelectedProduct(null);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrderSuccess = (order: Order) => {
    setLastOrder(order);
    setCart([]);
    setCheckoutOpen(false);
    setConfirmationOpen(true);
  };

  const handleTrackOrderFromConfirmation = (orderNumber: string) => {
    setConfirmationOpen(false);
    setTrackerInitialCode(orderNumber);
    setTrackerOpen(true);
  };

  const handleOpenAtelierWithProduct = (product: Product) => {
    setSelectedProduct(null);
    setAtelierPresetProduct(product);
    setAtelierOpen(true);
  };

  const dict = t[language];
  const isRtl = language === 'ar';
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products for homepage sections
  const featuredProducts = VELAR_PRODUCTS.filter((p) => p.isFeatured).slice(0, 3);
  const newArrivals = VELAR_PRODUCTS.filter((p) => p.isNewArrival);

  return (
    <div className="min-h-screen bg-[#090C10] text-slate-100 flex flex-col font-sans selection:bg-slate-700 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAtelier={() => {
          setAtelierPresetProduct(null);
          setAtelierOpen(true);
        }}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setTrackerOpen(true);
        }}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Cinematic Hero */}
            <HeroSection
              language={language}
              onShopClick={() => setCurrentView('shop')}
              onLookbookClick={() => setCurrentView('lookbook')}
              onAtelierClick={() => {
                setAtelierPresetProduct(null);
                setAtelierOpen(true);
              }}
            />

            {/* Quality Values & Brand Statement */}
            <BrandStatement
              language={language}
              onExploreMore={() => setCurrentView('about')}
            />

            {/* Featured Collection Section */}
            <section id="featured-section" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-semibold block mb-2">
                    SIGNATURE ARCHITECTURE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-wide font-display">
                    {dict.sections.featuredTitle}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-light">
                    {dict.sections.featuredSubtitle}
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('shop')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-slate-300 hover:text-white transition-colors group"
                >
                  <span>{dict.shop.all}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </div>

              {/* 3-Column Luxury Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    currency={currency}
                    isWishlisted={wishlist.some((w) => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={setSelectedProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            </section>

            {/* Editorial / Lookbook Showcase */}
            <LookbookSection
              language={language}
              onExploreShop={() => setCurrentView('shop')}
              onOpenAtelier={() => {
                setAtelierPresetProduct(null);
                setAtelierOpen(true);
              }}
            />

            {/* New Arrivals Section */}
            <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
              <div className="text-center max-w-xl mx-auto mb-14">
                <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-semibold mb-2 block">
                  AUTUMN / WINTER RELEASES
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white uppercase tracking-wide font-display">
                  {dict.sections.newArrivalsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {newArrivals.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    currency={currency}
                    isWishlisted={wishlist.some((w) => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={setSelectedProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <NewsletterSection language={language} />
          </>
        )}

        {currentView === 'shop' && (
          <ShopView
            language={language}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={setSelectedProduct}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {currentView === 'lookbook' && (
          <div className="pt-6">
            <LookbookSection
              language={language}
              onExploreShop={() => setCurrentView('shop')}
              onOpenAtelier={() => {
                setAtelierPresetProduct(null);
                setAtelierOpen(true);
              }}
            />
            {/* Extended Lookbook Gallery */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-[4/3] rounded-xs overflow-hidden border border-slate-800 bg-[#11161C]">
                  <img
                    src="/src/assets/images/velar_product_coat_1791135811769.jpg"
                    alt="Coat tailoring"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-xs overflow-hidden border border-slate-800 bg-[#11161C]">
                  <img
                    src="/src/assets/images/velar_product_suit_1791135840866.jpg"
                    alt="Italian wool blazer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'about' && (
          <AboutView
            language={language}
            onExploreShop={() => setCurrentView('shop')}
            onOpenAtelier={() => {
              setAtelierPresetProduct(null);
              setAtelierOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={setCurrentView}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setTrackerOpen(true);
        }}
        onOpenAtelier={() => {
          setAtelierPresetProduct(null);
          setAtelierOpen(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        language={language}
        currency={currency}
        isWishlisted={wishlist.some((w) => w.id === selectedProduct?.id)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p, c, s, q) => handleAddToCart(p, c, s, q)}
        onBuyNow={handleBuyNow}
        onOpenAtelierWithProduct={handleOpenAtelierWithProduct}
      />

      {/* Mini-Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        language={language}
        currency={currency}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        language={language}
        currency={currency}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={confirmationOpen}
        order={lastOrder}
        onClose={() => setConfirmationOpen(false)}
        onTrackOrder={handleTrackOrderFromConfirmation}
        language={language}
        currency={currency}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        language={language}
        currency={currency}
        initialOrderNumber={trackerInitialCode}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        language={language}
        currency={currency}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setSearchOpen(false);
        }}
      />

      {/* Atelier AI Suite Modal */}
      <AtelierModal
        isOpen={atelierOpen}
        onClose={() => setAtelierOpen(false)}
        language={language}
        presetProduct={atelierPresetProduct}
      />
    </div>
  );
}
