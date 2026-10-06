import { KalliProduct, VideoScene } from '../types';

export const KALLI_FENDI_SNEAKER: KalliProduct = {
  brand: 'KORVA',
  designer: 'KORVA',
  title: 'CoreFlex Air-Cushion Sneakers',
  subtitle: 'Flexible knit runners with responsive cushioning, smooth heel support, and all-day comfort.',
  price: 450,
  rating: 4,
  reviewsCount: 142,
  sizes: [37, 38, 39, 40, 41],
  colorways: [
    {
      id: 'blue', // Hero match to the user's uploaded "Crisp knit sneaker cutout.png"
      name: 'Deep Royal Navy & White Air',
      hex: '#1a367c',
      knitColor: '#173273',
      knitAccent: '#0d1f4a',
      soleColor: '#ffffff',
      accentCordColor: '#ffffff',
      tagBg: '#173273',
    },
    {
      id: 'orange', // Mustard Ochre #e5a13c
      name: 'Mustard Ochre & White',
      hex: '#e5a13c',
      knitColor: '#df9c38',
      knitAccent: '#c78426',
      soleColor: '#ffffff',
      accentCordColor: '#ffffff',
      tagBg: '#df9c38',
    },
  ],
  description:
    'Low-top performance running sneakers crafted with high-tensile engineered honeycomb technical knit. Featuring dual visible Air-cushioning chambers embedded in a sculpted white foam midsole, signature aerodynamic silver-white side racing stripes, and a reinforced TPU heel stability frame.',
  details: [
    'Upper: 100% Breathable multi-density engineered honeycomb knit',
    'Midsole: Dual pressurized Air-Sole units with internal stability pillars',
    'Lateral: Dual sweeping aerodynamic white reflective racing stripes',
    'Heel: Molded ergonomic TPU stability cage and woven pull loop',
    'Outsole: High-abrasion carbon rubber with forefoot flex grooves',
    'Made in Italy',
  ],
};

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 'intro-360',
    title: '360° Studio Rotation',
    duration: 5,
    caption: 'Full aerodynamic profile with dual visible air cushioning capsules.',
    cameraAngle: 'Rotating studio perspective',
    hotspots: [
      { x: 26, y: 74, label: 'Dual Air Capsules', desc: 'Pressurized gas chambers with impact shock absorption' },
      { x: 50, y: 50, label: 'Aerodynamic Racing Stripes', desc: 'White stability formstrips anchoring midfoot' },
      { x: 74, y: 55, label: 'Honeycomb Knit', desc: 'Multi-density breathable engineered mesh' },
    ],
  },
  {
    id: 'air-unit-macro',
    title: 'Dual Air Cushioning Mechanics',
    duration: 4,
    caption: 'Micro-engineered dual air pods absorb heel impact and return forward momentum.',
    cameraAngle: 'Extreme macro zoom on air bubbles',
    hotspots: [
      { x: 28, y: 74, label: 'Shock Cushioning', desc: 'Dual-chamber tuned nitrogen compression' },
      { x: 18, y: 48, label: 'TPU Heel Counter', desc: 'Locks calcaneus bone for zero slip' },
    ],
  },
  {
    id: 'knit-breathability',
    title: 'Engineered Knit Mesh Architecture',
    duration: 4,
    caption: 'High-tensile royal blue weave with mapped thermal ventilation zones.',
    cameraAngle: 'Upper vamp close-up',
    hotspots: [
      { x: 55, y: 45, label: 'Ventilation Porosity', desc: 'Direct heat dissipation on the run' },
      { x: 45, y: 30, label: 'Padded Tongue', desc: 'Pressure-relieving athletic tongue' },
    ],
  },
  {
    id: 'sole-traction',
    title: 'Sculpted Foam & Outsole Traction',
    duration: 5,
    caption: 'Wave-grooved carbon rubber pods deliver multi-surface grip in wet and dry conditions.',
    cameraAngle: 'Dynamic low profile angle',
    hotspots: [
      { x: 54, y: 82, label: 'Carbon Rubber Tread', desc: 'Durable zoned road grip' },
      { x: 82, y: 65, label: 'Beveled Toe Spring', desc: 'Fluid heel-to-toe transition' },
    ],
  },
];
