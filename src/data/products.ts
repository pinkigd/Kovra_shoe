import { ProductDetail } from '../types';

export const PALM_ANGELS_FLAME_SNEAKER: ProductDetail = {
  id: 'palm-angels-flame-low',
  brand: 'PALM ANGELS',
  subBrand: 'SHOES',
  name: 'Black & White Flame Sneakers',
  price: 395,
  currency: '$',
  shortDescription: 'Low-top panelled suede and canvas sneakers in white',
  fullDescription:
    'Low-top buffed calfskin and cotton canvas sneakers in white. Tonal topstitching throughout with signature flame-shaped graphic appliqués in vibrant fluorescent hues along the quarter. Textured vulcanized rubber sole with diamond-tread rubber toe bumper.',
  sku: 'PMIA058E20LEA001',
  composition: 'Upper: 70% Bovine Leather, 30% Cotton Canvas. Lining: 100% Cotton. Sole: 100% Vulcanized Rubber.',
  madeIn: 'Made in Italy',
  colorways: [
    {
      id: 'lime-green',
      name: 'Forest Green & Neon Lime Flame',
      dotColor1: '#226027', // Green dot matching the left dot in image
      dotColor2: '#ccff00', // Neon yellow dot matching the right dot in image
      flamePrimary: '#ccff00', // Fluorescent neon yellow/lime
      flameSecondary: '#22c55e', // Vivid green
      flameOutline: '#15803d',
      upperColor: '#f8fafc', // Pristine white leather
      heelColor: '#dc2626', // Red suede heel counter matching image
      soleColor: '#171717', // Black vulcanized sole
      toeCapColor: '#171717', // Black rubber toe cap matching image
      laceColor: '#ffffff',
      heelTabColor: '#ccff00',
      heelTabTextColor: '#000000',
      inStock: true,
    },
    {
      id: 'cyber-yellow',
      name: 'Cyber Yellow & Fire Flame',
      dotColor1: '#eab308',
      dotColor2: '#f97316',
      flamePrimary: '#facc15',
      flameSecondary: '#ea580c',
      flameOutline: '#9a3412',
      upperColor: '#ffffff',
      heelColor: '#ea580c',
      soleColor: '#171717',
      toeCapColor: '#171717',
      laceColor: '#ffffff',
      heelTabColor: '#facc15',
      heelTabTextColor: '#000000',
      inStock: true,
    },
    {
      id: 'monochrome-noir',
      name: 'Monochrome Noir & Ice White',
      dotColor1: '#18181b',
      dotColor2: '#71717a',
      flamePrimary: '#e4e4e7',
      flameSecondary: '#a1a1aa',
      flameOutline: '#3f3f46',
      upperColor: '#18181b',
      heelColor: '#27272a',
      soleColor: '#ffffff',
      toeCapColor: '#ffffff',
      laceColor: '#ffffff',
      heelTabColor: '#27272a',
      heelTabTextColor: '#ffffff',
      inStock: true,
    },
    {
      id: 'fiery-violet',
      name: 'Electric Violet & Hot Pink',
      dotColor1: '#7c3aed',
      dotColor2: '#ec4899',
      flamePrimary: '#c084fc',
      flameSecondary: '#db2777',
      flameOutline: '#831843',
      upperColor: '#f1f5f9',
      heelColor: '#9333ea',
      soleColor: '#0f172a',
      toeCapColor: '#0f172a',
      laceColor: '#ffffff',
      heelTabColor: '#a855f7',
      heelTabTextColor: '#ffffff',
      inStock: true,
    },
  ],
  sizes: [
    { eu: 39, us: 6, uk: 5.5, cm: 24.5, stock: 'in-stock' },
    { eu: 40, us: 7, uk: 6.5, cm: 25.2, stock: 'in-stock' },
    { eu: 41, us: 8, uk: 7.5, cm: 26.0, stock: 'in-stock' },
    { eu: 42, us: 9, uk: 8.5, cm: 26.7, stock: 'in-stock' },
    { eu: 43, us: 10, uk: 9.5, cm: 27.5, stock: 'low-stock' },
    { eu: 44, us: 11, uk: 10.5, cm: 28.2, stock: 'in-stock' },
    { eu: 45, us: 12, uk: 11.5, cm: 29.0, stock: 'low-stock' },
    { eu: 46, us: 13, uk: 12.5, cm: 29.7, stock: 'out-of-stock' },
  ],
};

export const RELATED_PRODUCTS = [
  {
    id: 'pa-track-jacket',
    brand: 'PALM ANGELS',
    name: 'Classic Track Jacket',
    color: 'Forest Green / White',
    price: 495,
    tag: 'Runway Look',
  },
  {
    id: 'pa-logo-socks',
    brand: 'PALM ANGELS',
    name: 'Gothic Logo Ribbed Socks',
    color: 'White / Black',
    price: 85,
    tag: 'Essential Accessory',
  },
  {
    id: 'pa-flame-tee',
    brand: 'PALM ANGELS',
    name: 'Oversized Burning Logo T-Shirt',
    color: 'Vintage Black',
    price: 330,
    tag: 'New Season',
  },
];
