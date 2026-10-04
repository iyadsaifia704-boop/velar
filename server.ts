import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON body limit for base64 images
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory persistent order store for this session
interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    notes?: string;
  };
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

const ordersStore = new Map<string, OrderRecord>();

// Pre-seed a sample order for instant demo tracking
const seedOrderNumber = 'VLR-94812';
ordersStore.set(seedOrderNumber, {
  id: 'ord_sample_1',
  orderNumber: seedOrderNumber,
  createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  customer: {
    fullName: 'Karim Bouzid',
    phone: '0550 12 34 56',
    wilaya: '16 - Alger (الجزائر)',
    commune: 'Hydra (حيدرة)',
    address: 'Résidence Les Pins, Apt 4B',
    notes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
  },
  items: [
    {
      id: 'velar-coat-01',
      name: 'معطف فيلار كشمير فاخر مزدوج الصدر',
      color: 'Charcoal Slate',
      size: '50 (L)',
      price: 48000,
      quantity: 1,
      image: '/src/assets/images/velar_product_coat_1791135811769.jpg',
    },
    {
      id: 'velar-knit-01',
      name: 'كنزة فيلار صوف ميرينو ياقة عالية',
      color: 'Dark Heather',
      size: 'L',
      price: 22000,
      quantity: 1,
      image: '/src/assets/images/velar_product_knit_1791135855546.jpg',
    },
  ],
  subtotal: 70000,
  deliveryFee: 0,
  total: 70000,
  status: 'shipped',
  paymentMethod: 'cod',
  timeline: [
    { status: 'received', labelAr: 'تم استلام الطلب', labelEn: 'Order Received', labelFr: 'Commande reçue', date: 'أمس - 10:30 ص', completed: true },
    { status: 'confirmed', labelAr: 'تم تأكيد الطلب', labelEn: 'Order Confirmed', labelFr: 'Confirmée', date: 'أمس - 11:15 ص', completed: true },
    { status: 'preparing', labelAr: 'قيد التجهيز والتغليف الفاخر', labelEn: 'In Atelier Preparation', labelFr: 'En préparation atelier', date: 'أمس - 03:00 م', completed: true },
    { status: 'shipped', labelAr: 'تم الشحن مع الشاحن السريع', labelEn: 'Dispatched via Express Courier', labelFr: 'Expédiée par coursier express', date: 'اليوم - 08:30 ص', completed: true },
    { status: 'out_for_delivery', labelAr: 'خارج للتوصيل إلى العنوان', labelEn: 'Out for Delivery', labelFr: 'En cours de livraison', date: 'متوقع اليوم مساءً', completed: false },
    { status: 'delivered', labelAr: 'تم التسليم بنجاح', labelEn: 'Delivered', labelFr: 'Livrée', date: 'غداً كأقصى حد', completed: false },
  ],
});

// --- E-Commerce Endpoints ---

// Create Order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, subtotal, deliveryFee, total, paymentMethod } = req.body;
    if (!customer || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `VLR-${randomSuffix}`;

    const newOrder: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      total: Number(total),
      status: 'received',
      paymentMethod: paymentMethod || 'cod',
      timeline: [
        { status: 'received', labelAr: 'تم استلام الطلب بنجاح', labelEn: 'Order Received', labelFr: 'Commande reçue', date: 'الآن', completed: true },
        { status: 'confirmed', labelAr: 'تأكيد المقاسات والبيانات', labelEn: 'Awaiting Atelier Confirmation', labelFr: 'En attente de confirmation', date: 'خلال ساعتين', completed: false },
        { status: 'preparing', labelAr: 'التجهيز والتغليف الفاخر', labelEn: 'Bespoke Atelier Packaging', labelFr: 'Préparation et emballage', date: 'غداً صباحاً', completed: false },
        { status: 'shipped', labelAr: 'الشحن مع التوصيل السريع', labelEn: 'Dispatched via Express Courier', labelFr: 'Expédition express', date: 'خلال 24-48 ساعة', completed: false },
        { status: 'out_for_delivery', labelAr: 'خارج للتوصيل', labelEn: 'Out for Delivery', labelFr: 'En cours de livraison', date: 'خلال 48 ساعة', completed: false },
        { status: 'delivered', labelAr: 'تم التسليم', labelEn: 'Delivered', labelFr: 'Livrée', date: 'خلال 2-3 أيام', completed: false },
      ],
    };

    ordersStore.set(orderNumber, newOrder);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Lookup Order by Number
app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const normalized = orderNumber.trim().toUpperCase();
  const order = ordersStore.get(normalized);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ order });
});

// Newsletter Subscription
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  res.json({ success: true, message: 'Subscribed to VELAR Private Club successfully' });
});

// --- Gemini Atelier AI Endpoints ---

// 1. Image Understanding: Analyze User Photo for Fit & Style Advisory (gemini-3.1-pro-preview)
app.post('/api/atelier/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', question = '', language = 'ar' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const systemInstruction = `You are the Master Sartorial Consultant for VELAR (فيلار), a premier luxury menswear fashion house.
Brand aesthetic: Timeless, architectural, masculine, quiet luxury, minimal elegance (akin to Loro Piana, Zegna, Brunello Cucinelli).
Analyze the provided photograph (which could be the client's current suit fit, silhouette, fabric texture, or wardrobe piece).
Provide a refined, authoritative, yet courteous consultation including:
1. Sartorial Diagnosis & Silhouette Assessment (shoulders, drape, proportion, contrast).
2. Recommended Palette & Color Coordination matching VELAR's signature tones (Charcoal, Slate Blue, Heather Grey, Off-White Chalk).
3. Exact VELAR pieces to elevate this look (e.g. Double-breasted Cashmere Coat, Mercerized Piqué Polo, Pleat-front Flannel Trousers).
4. Bespoke Fit Tip for modern distinction.

Respond in ${language === 'ar' ? 'Arabic (فصحى راقية وموجزة)' : language === 'fr' ? 'French' : 'English'}. Keep the tone sophisticated, masculine, and confident.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: question || 'Please analyze this photo for styling, fit assessment, and luxury menswear pairing advice.',
          },
        ],
      },
      config: {
        systemInstruction,
      },
    });

    res.json({
      text: response.text,
      modelUsed: 'gemini-3.1-pro-preview',
    });
  } catch (error: any) {
    console.error('Atelier Image Analysis error:', error);
    res.status(500).json({ error: error.message || 'Error processing style analysis' });
  }
});

// 2. High Thinking Mode: Deep Couture & Complex Sartorial Consulting (gemini-3.1-pro-preview, thinkingLevel HIGH)
app.post('/api/atelier/consult', async (req: Request, res: Response) => {
  try {
    const { prompt, language = 'ar', context = '' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemInstruction = `You are VELAR's Senior Bespoke Tailor and Creative Director.
Your expertise spans bespoke tailoring, wool fabric weight (Super 130s to Super 180s, vicuña, cashmere), climate dressing (North Africa, Gulf, Europe), dress codes (Black Tie, Smart Casual, Executive Business), and tailoring geometry.
Provide deep, impeccably structured sartorial guidance. Never sound like a generic chatbot; speak as a revered master tailor.
Language: ${language === 'ar' ? 'Arabic (لغة راقية وفخمة تناسب النخبة)' : language === 'fr' ? 'French' : 'English'}.`;

    const userPrompt = context ? `Context: ${context}\n\nClient Query: ${prompt}` : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    res.json({
      text: response.text,
      modelUsed: 'gemini-3.1-pro-preview (Thinking: HIGH)',
    });
  } catch (error: any) {
    console.error('Atelier Consulting error:', error);
    res.status(500).json({ error: error.message || 'Error consulting atelier' });
  }
});

// 3. Search Grounding: Global Menswear Trends & Sartorial Standards (gemini-3.5-flash with googleSearch)
app.post('/api/atelier/search-trends', async (req: Request, res: Response) => {
  try {
    const { query, language = 'ar' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are VELAR's Trend Intelligence Director. Use real-time Google Search data to report verified current global luxury menswear directions (Pitti Uomo, Milan/Paris Fashion Weeks, quiet luxury fabric standards, seasonal color trends). Provide concise executive summaries in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.`,
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      modelUsed: 'gemini-3.5-flash (with Google Search Grounding)',
    });
  } catch (error: any) {
    console.error('Atelier Search Trends error:', error);
    res.status(500).json({ error: error.message || 'Error retrieving trend data' });
  }
});

// 4. Generate High-Quality Bespoke Concept Image (gemini-3-pro-image-preview with 1K, 2K, 4K affordance)
app.post('/api/atelier/generate-concept', async (req: Request, res: Response) => {
  try {
    const { prompt, size = '1K', aspectRatio = '3:4' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(size) ? size : '1K';

    const enhancedPrompt = `High-end commercial luxury menswear fashion photography for VELAR house: ${prompt}. Minimalist aesthetic, rich architectural dark slate/charcoal tones, impeccable fabric drape, editorial studio lighting, ultra-sharp detail, 8k commercial catalogue caliber.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: chosenSize as any,
        },
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${base64Data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data returned from generator' });
    }

    res.json({
      imageUrl,
      modelUsed: 'gemini-3-pro-image-preview',
      resolution: chosenSize,
    });
  } catch (error: any) {
    console.error('Atelier Image Generation error:', error);
    res.status(500).json({ error: error.message || 'Error generating bespoke concept' });
  }
});

// 5. Fast Garment Care & Fabric Information (gemini-3.1-flash-lite)
app.post('/api/atelier/fast-care', async (req: Request, res: Response) => {
  try {
    const { fabric, itemType, language = 'ar' } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Provide 3 concise, bulleted master care rules for luxury ${fabric || 'Cashmere'} in a ${itemType || 'Overcoat'}. Language: ${language === 'ar' ? 'Arabic' : 'English'}. Keep under 60 words total.`,
    });
    res.json({ careTips: response.text });
  } catch (error: any) {
    console.error('Fast care error:', error);
    res.status(500).json({ error: error.message || 'Error generating care tips' });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VELAR Flagship Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
