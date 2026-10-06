import React from 'react';
import { Colorway } from '../types';

interface SneakerIllustrationProps {
  colorway: Colorway;
  className?: string;
  isBackgroundBlur?: boolean;
  angle?: 'angled-stand' | 'crossed-back' | 'lateral' | 'top' | 'sole';
}

export const SneakerIllustration: React.FC<SneakerIllustrationProps> = ({
  colorway,
  className = '',
  isBackgroundBlur = false,
  angle = 'angled-stand',
}) => {
  // Unique gradient and filter IDs to prevent clashes
  const idPrefix = React.useId().replace(/:/g, '');

  // Render individual single sneaker in lateral profile viewBox (500 x 300)
  const renderSingleSneakerSVG = (flipped = false) => {
    return (
      <svg
        viewBox="0 0 520 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto drop-shadow-xl ${flipped ? '-scale-x-100' : ''}`}
        style={{
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Flame Gradient */}
          <linearGradient id={`${idPrefix}-flameGrad`} x1="0%" y1="100%" x2="70%" y2="0%">
            <stop offset="0%" stopColor={colorway.flameSecondary} />
            <stop offset="60%" stopColor={colorway.flamePrimary} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>

          {/* Upper Leather Shadow Gradient */}
          <linearGradient id={`${idPrefix}-leatherGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor={colorway.upperColor} />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Sole Gradient */}
          <linearGradient id={`${idPrefix}-soleGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d2d2d" />
            <stop offset="50%" stopColor={colorway.soleColor} />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          {/* Heel Suede Gradient */}
          <linearGradient id={`${idPrefix}-heelGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorway.heelColor} />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Soft inner shadow */}
          <filter id={`${idPrefix}-innerGlow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* --- MAIN SNEAKER BODY --- */}
        <g id="sneaker-layer">
          {/* 1. Suede Heel Counter (Red in hero) */}
          <path
            d="M 68 155 C 55 130 50 95 75 70 C 85 60 95 55 105 58 C 112 60 115 70 112 85 C 108 105 106 135 110 160 Z"
            fill={`url(#${idPrefix}-heelGrad)`}
          />
          {/* Heel counter seam stitch line */}
          <path
            d="M 78 72 C 85 65 92 62 100 64 C 105 67 106 75 104 90 C 100 110 98 135 102 155"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.4"
          />

          {/* 2. Neon Heel Pull Tab with Palm Angels Gothic Text */}
          <g transform="translate(68, 50) rotate(-18)">
            <rect
              x="0"
              y="0"
              width="24"
              height="44"
              rx="4"
              fill={colorway.heelTabColor}
              stroke="#000000"
              strokeWidth="0.8"
            />
            {/* Palm Angels vertical brand lettering on tag */}
            <text
              x="12"
              y="26"
              fontSize="6.5"
              fontFamily="'Anton', 'Syne', sans-serif"
              fontWeight="900"
              fill={colorway.heelTabTextColor}
              textAnchor="middle"
              transform="rotate(90, 12, 22)"
              letterSpacing="0.8"
            >
              PALM
            </text>
          </g>

          {/* 3. Collar Lining & Padded Ankle Scoop */}
          <path
            d="M 105 58 C 125 58 150 78 175 90 C 185 95 195 98 200 98 C 190 108 170 110 150 108 C 130 106 112 90 105 58 Z"
            fill="#1e293b"
            opacity="0.85"
          />
          {/* Collar interior depth */}
          <ellipse cx="140" cy="85" rx="30" ry="12" fill="#0f172a" opacity="0.6" />

          {/* 4. White Leather Upper Quarter & Vamp */}
          <path
            d="M 75 160 
               C 85 110 105 65 130 65 
               C 160 65 210 100 240 105 
               C 280 110 330 120 370 145 
               C 410 170 440 190 460 205 
               C 440 215 390 220 310 220 
               C 210 220 120 220 70 215 
               C 65 195 68 175 75 160 Z"
            fill={`url(#${idPrefix}-leatherGrad)`}
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* 5. Tongue and Eyestay Structure */}
          <path
            d="M 175 88 C 205 98 250 115 285 130 C 275 145 230 135 195 115 C 182 108 176 96 175 88 Z"
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />
          {/* Tongue Peak */}
          <path
            d="M 180 82 C 195 72 215 72 225 80 C 215 88 198 90 180 82 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* Flat White Laces with Red/Dark Accent Points */}
          <g id="laces" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round">
            <line x1="195" y1="96" x2="228" y2="114" />
            <line x1="210" y1="104" x2="248" y2="124" />
            <line x1="230" y1="114" x2="270" y2="134" />
            <line x1="252" y1="126" x2="295" y2="145" />
            <line x1="278" y1="138" x2="320" y2="156" />
          </g>
          {/* Top subtle highlight on laces */}
          <g id="laces-highlight" stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
            <line x1="195" y1="96" x2="228" y2="114" />
            <line x1="210" y1="104" x2="248" y2="124" />
            <line x1="230" y1="114" x2="270" y2="134" />
            <line x1="252" y1="126" x2="295" y2="145" />
            <line x1="278" y1="138" x2="320" y2="156" />
          </g>

          {/* 6. SIGNATURE PALM ANGELS FLAME APPLIQUÉ */}
          {/* Flame Base / Shadow layer for 3D cutout depth */}
          <path
            d="M 125 185 
               C 145 155 170 120 195 105 
               C 192 120 185 135 178 145 
               C 200 130 230 115 255 110 
               C 248 128 238 142 225 155 
               C 255 140 290 135 325 130 
               C 310 150 288 165 260 175 
               C 295 170 335 168 375 175 
               C 340 195 290 205 230 205 
               C 175 205 138 200 125 185 Z"
            fill={colorway.flameOutline}
            opacity="0.9"
            transform="translate(2, 3)"
          />

          {/* Main Vivid Flame Cutout (Vibrant Lime/Neon Yellow) */}
          <path
            d="M 125 185 
               C 145 155 170 120 195 105 
               C 192 120 185 135 178 145 
               C 200 130 230 115 255 110 
               C 248 128 238 142 225 155 
               C 255 140 290 135 325 130 
               C 310 150 288 165 260 175 
               C 295 170 335 168 375 175 
               C 340 195 290 205 230 205 
               C 175 205 138 200 125 185 Z"
            fill={`url(#${idPrefix}-flameGrad)`}
            stroke={colorway.flameOutline}
            strokeWidth="1.8"
          />

          {/* Inner Flame Highlight licking upwards */}
          <path
            d="M 145 188 
               C 160 165 180 135 198 120 
               C 192 135 186 148 180 155 
               C 205 142 235 130 258 125 
               C 248 140 236 152 220 162 
               C 245 155 278 152 305 150 
               C 285 168 250 182 210 192 Z"
            fill={colorway.flamePrimary}
            opacity="0.85"
          />

          {/* Delicate Topstitching along Flame Silhouette */}
          <path
            d="M 130 182 
               C 148 158 172 125 192 112 
               C 190 124 184 136 178 145 
               C 200 133 226 120 250 116 
               C 244 130 234 142 222 154 
               C 250 142 282 138 315 134"
            stroke="#000000"
            strokeWidth="0.75"
            strokeDasharray="2.5 2.5"
            opacity="0.65"
          />

          {/* 7. Front Toe Bumper & Cap (Black Rubber) */}
          <path
            d="M 390 180 
               C 425 185 455 195 470 208 
               C 468 218 450 225 425 224 
               C 385 224 370 205 370 192 
               C 375 185 382 182 390 180 Z"
            fill={colorway.toeCapColor}
            stroke="#334155"
            strokeWidth="1"
          />
          {/* Toe cap textured grip lines */}
          <path
            d="M 430 195 L 436 218 M 442 198 L 448 221 M 454 202 L 458 223"
            stroke="#475569"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* 8. VULCANIZED RUBBER OUTSOLE & FOXING TAPE (Signature Black Sole) */}
          <path
            d="M 58 212 
               C 130 215 220 216 310 216 
               C 390 216 445 214 472 208 
               C 476 215 472 226 462 232 
               C 440 244 380 248 300 248 
               C 200 248 110 246 54 238 
               C 50 230 52 218 58 212 Z"
            fill={`url(#${idPrefix}-soleGrad)`}
          />

          {/* Foxing tape textured ribbed lines */}
          <line x1="56" y1="222" x2="470" y2="216" stroke="#404040" strokeWidth="1.2" />
          <line x1="55" y1="230" x2="465" y2="226" stroke="#262626" strokeWidth="1" />

          {/* Rubber Sole Heel License Plate / Bumper */}
          <rect x="52" y="218" width="18" height="14" rx="2" fill="#171717" stroke="#333333" strokeWidth="0.8" />
          <line x1="56" y1="224" x2="66" y2="224" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
        </g>
      </svg>
    );
  };

  // Render bottom tread sole pattern
  const renderSoleSVG = () => {
    return (
      <svg viewBox="0 0 500 240" fill="none" className="w-full h-auto drop-shadow-2xl">
        <path
          d="M 80 120 C 80 50 140 30 220 30 C 330 30 420 50 440 100 C 450 125 440 150 410 180 C 340 210 240 210 160 210 C 100 210 80 180 80 120 Z"
          fill={colorway.soleColor}
          stroke="#3f3f46"
          strokeWidth="3"
        />
        {/* Diamond tread grip texture */}
        <g stroke="#52525b" strokeWidth="1.5" opacity="0.6">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`tread-1-${i}`} x1={100 + i * 18} y1="40" x2={140 + i * 18} y2="200" />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`tread-2-${i}`} x1={140 + i * 18} y1="40" x2={100 + i * 18} y2="200" />
          ))}
        </g>
        {/* Palm Angels embossed logo oval in center */}
        <ellipse cx="250" cy="120" rx="45" ry="22" fill="#09090b" stroke="#71717a" strokeWidth="1.5" />
        <text
          x="250"
          y="124"
          fill="#ffffff"
          fontSize="9"
          fontFamily="'Anton', 'Syne', sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="1"
        >
          PALM ANGELS
        </text>
      </svg>
    );
  };

  if (angle === 'sole') {
    return <div className={`relative ${className}`}>{renderSoleSVG()}</div>;
  }

  if (angle === 'lateral') {
    return <div className={`relative ${className}`}>{renderSingleSneakerSVG(false)}</div>;
  }

  // Floating Hero composition matching image.png:
  // Foreground Sneaker balancing upright on toe (angled diagonally)
  // Crossing second sneaker behind
  // Soft ground contact drop shadow
  return (
    <div
      className={`relative select-none pointer-events-none ${className} ${
        isBackgroundBlur ? 'filter blur-[5px] opacity-40 scale-75' : ''
      }`}
    >
      {/* Dynamic Floating Sneaker Render */}
      <div className="relative w-full max-w-[560px] mx-auto aspect-square flex items-center justify-center">
        {/* Background Crossed Sneaker (if dual pose) */}
        <div
          className="absolute w-[82%] top-[24%] left-[12%] -rotate-[52deg] scale-[0.92] opacity-95 transition-transform duration-500"
          style={{
            transformOrigin: '40% 60%',
            filter: 'drop-shadow(-8px 12px 20px rgba(0,0,0,0.22))',
          }}
        >
          {renderSingleSneakerSVG(true)}
        </div>

        {/* Foreground Primary Sneaker standing upright dynamically on toe */}
        <div
          className="absolute w-[94%] top-[14%] right-[10%] rotate-[-44deg] transition-transform duration-300"
          style={{
            transformOrigin: '78% 78%',
            filter: 'drop-shadow(14px 20px 28px rgba(0,0,0,0.32))',
          }}
        >
          {renderSingleSneakerSVG(false)}
        </div>

        {/* Realistic Ground Contact Radial Blur Drop Shadow directly under where the toe balances */}
        <div
          className="absolute bottom-[16%] left-[47%] -translate-x-1/2 w-28 h-10 rounded-full pointer-events-none transition-all duration-300"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.48) 0%, rgba(15, 23, 42, 0.22) 42%, rgba(0,0,0,0) 72%)',
            filter: 'blur(3px)',
            transform: 'scale(1.1, 0.65)',
          }}
        />

        {/* Secondary softer broad ambient shadow */}
        <div
          className="absolute bottom-[12%] left-[45%] -translate-x-1/2 w-48 h-12 rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.3) 0%, rgba(0,0,0,0) 75%)',
            filter: 'blur(10px)',
          }}
        />
      </div>
    </div>
  );
};
