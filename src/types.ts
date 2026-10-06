export interface KalliColorway {
  id: string;
  name: string;
  hex: string;
  knitColor: string;
  knitAccent: string;
  soleColor: string;
  accentCordColor: string;
  tagBg: string;
}

export interface KalliProduct {
  brand: string;
  designer: string;
  title: string;
  subtitle: string;
  price: number;
  rating: number;
  reviewsCount: number;
  sizes: number[];
  colorways: KalliColorway[];
  description: string;
  details: string[];
}

export interface VideoScene {
  id: string;
  title: string;
  duration: number; // in seconds
  caption: string;
  cameraAngle: string;
  hotspots?: { x: number; y: number; label: string; desc: string }[];
}

export interface Colorway {
  id: string;
  name: string;
  dotColor1: string;
  dotColor2?: string;
  flamePrimary: string;
  flameSecondary: string;
  flameOutline: string;
  upperColor: string;
  heelColor: string;
  soleColor: string;
  toeCapColor: string;
  laceColor: string;
  heelTabColor: string;
  heelTabTextColor: string;
  inStock: boolean;
}

export interface SizeOption {
  eu: number;
  us: number;
  uk: number;
  cm: number;
  stock: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface ProductDetail {
  id: string;
  brand: string;
  subBrand: string;
  name: string;
  price: number;
  currency: string;
  shortDescription: string;
  fullDescription: string;
  sku: string;
  composition: string;
  madeIn: string;
  colorways: Colorway[];
  sizes: SizeOption[];
}

export interface CartItem {
  id: string;
  productId: string;
  colorway: Colorway;
  size: SizeOption;
  quantity: number;
  unitPrice: number;
}
