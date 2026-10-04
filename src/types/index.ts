export type Language = 'ar' | 'en' | 'fr';
export type Currency = 'DZD' | 'EUR' | 'USD';

export interface ProductVariant {
  colorName: string;
  colorHex: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  subtitle: {
    ar: string;
    en: string;
    fr: string;
  };
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  category: 'coats' | 'blazers' | 'knitwear' | 'polos' | 'trousers' | 'accessories';
  categoryName: {
    ar: string;
    en: string;
    fr: string;
  };
  priceDZD: number;
  originalPriceDZD?: number;
  images: string[];
  colors: ProductVariant[];
  sizes: string[];
  stockCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  composition: {
    ar: string;
    en: string;
    fr: string;
  };
  fitGuide: {
    ar: string;
    en: string;
    fr: string;
  };
  careInstructions: {
    ar: string;
    en: string;
    fr: string;
  };
  deliveryEstimateDays: number;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes?: string;
  email?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: Array<{
    id: string;
    name: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'received' | 'confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered';
  paymentMethod: 'cod' | 'card';
  timeline: Array<{
    status: string;
    labelAr: string;
    labelEn: string;
    labelFr: string;
    date: string;
    completed: boolean;
  }>;
}
