import React from 'react';
import { KalliColorway } from '../types';

interface KalliSneakerIllustrationProps {
  colorway: KalliColorway;
  viewAngle?: 'side' | 'front' | 'perspective' | 'top' | 'rear' | 'sole';
  className?: string;
  animateBounce?: boolean;
  rotationY?: number;
}

export const KalliSneakerIllustration: React.FC<KalliSneakerIllustrationProps> = ({
  colorway,
  viewAngle = 'side',
  className = '',
  animateBounce = false,
  rotationY = 0,
}) => {
  const id = React.useId().replace(/:/g, '');

  // Master Lateral Side Profile: Exact vector realization of "Crisp knit sneaker cutout.png"
  const renderSideView = () => {
    return (
      <svg
        viewBox="18 45 805 415"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
        style={{
          transform: `perspective(900px) rotateY(${rotationY}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <defs>
          {/* Engineered Honeycomb Knit Mesh Pattern */}
          <pattern id={`${id}-honeycombMesh`} width="10" height="10" patternUnits="userSpaceOnUse">
            <ellipse cx="5" cy="5" rx="2.5" ry="2" fill="#081432" opacity="0.45" />
            <path
              d="M 0 5 Q 2.5 2 5 5 Q 7.5 8 10 5"
              stroke="#254899"
              strokeWidth="0.8"
              fill="none"
              opacity="0.35"
            />
          </pattern>

          {/* Deep Navy/Royal Blue Knit Base Gradient */}
          <linearGradient id={`${id}-knitBaseGrad`} x1="10%" y1="10%" x2="90%" y2="80%">
            <stop offset="0%" stopColor="#1e3f8a" />
            <stop offset="45%" stopColor={colorway.knitColor} />
            <stop offset="100%" stopColor="#0c1b40" />
          </linearGradient>

          {/* Volumetric Upper Ambient Lighting */}
          <linearGradient id={`${id}-lightVolumetric`} x1="30%" y1="0%" x2="30%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>

          {/* White Sculpted Midsole Gradient */}
          <linearGradient id={`${id}-foamSoleGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>

          {/* Air Bubble Transparent Glass Gradient */}
          <linearGradient id={`${id}-airGlassGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#93c5fd" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#1e293b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>

          {/* Air Bubble Specular Glint */}
          <linearGradient id={`${id}-bubbleReflection`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* TPU Heel Counter Gradient */}
          <linearGradient id={`${id}-tpuCageGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d3d82" />
            <stop offset="60%" stopColor="#0f1f45" />
            <stop offset="100%" stopColor="#081024" />
          </linearGradient>

          {/* Racing Stripe White Metallic Luster */}
          <linearGradient id={`${id}-racingStripeGrad`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id={`${id}-bubbleInnerShadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        <g id="blue-air-sneaker-group">
          {/* ======================================================== */}
          {/* 1. REAR HEEL PULL TAB LOOP                                */}
          {/* ======================================================== */}
          <g id="heel-pull-tab">
            <path
              d="M 96 175 C 80 150 70 120 86 100 C 96 88 112 90 114 110 C 115 130 112 165 110 185 Z"
              fill="#0d1b3d"
              stroke="#1e3f8a"
              strokeWidth="2"
            />
            {/* Pull tab center opening hole */}
            <path
              d="M 96 150 C 90 135 88 120 96 110 C 102 105 106 108 106 118 C 106 130 102 148 96 150 Z"
              fill="#ffffff"
              opacity="0.8"
            />
          </g>

          {/* ======================================================== */}
          {/* 2. MAIN UPPER: ROYAL BLUE ENGINEERED HONEYCOMB KNIT      */}
          {/* ======================================================== */}
          <g id="knit-upper">
            {/* Main Upper Knit Contour */}
            <path
              d="M 98 220 
                 C 94 185 115 130 148 108 
                 C 175 90 230 115 285 75 
                 C 310 56 332 50 348 58 
                 C 365 66 372 90 376 122 
                 C 382 148 402 180 435 205 
                 C 475 235 540 258 630 270 
                 C 710 280 770 292 795 320 
                 C 804 330 802 344 790 354 
                 C 770 370 700 375 620 374 
                 C 520 372 420 370 320 370 
                 C 220 370 140 365 92 355 
                 C 75 330 76 270 98 220 Z"
              fill={`url(#${id}-knitBaseGrad)`}
            />

            {/* Honeycomb Porous Mesh Overlay */}
            <path
              d="M 98 220 
                 C 94 185 115 130 148 108 
                 C 175 90 230 115 285 75 
                 C 310 56 332 50 348 58 
                 C 365 66 372 90 376 122 
                 C 382 148 402 180 435 205 
                 C 475 235 540 258 630 270 
                 C 710 280 770 292 795 320 
                 C 804 330 802 344 790 354 
                 C 770 370 700 375 620 374 
                 C 520 372 420 370 320 370 
                 C 220 370 140 365 92 355 
                 C 75 330 76 270 98 220 Z"
              fill={`url(#${id}-honeycombMesh)`}
            />

            {/* Volumetric Specular Highlight on Upper */}
            <path
              d="M 98 220 
                 C 94 185 115 130 148 108 
                 C 175 90 230 115 285 75 
                 C 310 56 332 50 348 58 
                 C 365 66 372 90 376 122 
                 C 382 148 402 180 435 205 
                 C 475 235 540 258 630 270 
                 C 710 280 770 292 795 320 
                 C 804 330 802 344 790 354 
                 C 770 370 700 375 620 374 
                 C 520 372 420 370 320 370 
                 C 220 370 140 365 92 355 
                 C 75 330 76 270 98 220 Z"
              fill={`url(#${id}-lightVolumetric)`}
            />
          </g>

          {/* ======================================================== */}
          {/* 3. TONGUE, COLLAR & EYESTAY SYSTEM                        */}
          {/* ======================================================== */}
          <g id="tongue-and-eyestays">
            {/* Padded Ankle Collar Rim */}
            <path
              d="M 120 160 C 135 140 165 145 200 155 C 235 165 270 160 300 135"
              stroke="#0f1f45"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 120 160 C 135 140 165 145 200 155 C 235 165 270 160 300 135"
              stroke="#254899"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Sculpted Tongue Peak with Mesh Detailing */}
            <path
              d="M 285 75 C 310 56 332 50 348 58 C 365 66 372 90 376 122 C 350 120 315 105 285 75 Z"
              fill="#102555"
              stroke="#1e3f8a"
              strokeWidth="2"
            />
            {/* Tongue loop ribbon */}
            <rect x="325" y="70" width="14" height="24" rx="2" fill="#1e3f8a" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />

            {/* Molded Eyestay Support Panel */}
            <path
              d="M 330 115 
                 C 360 135 410 170 480 220 
                 C 490 235 500 248 520 256 
                 C 515 264 495 260 480 250 
                 C 440 225 385 180 345 140 
                 C 335 130 328 122 330 115 Z"
              fill="#102555"
              stroke="#254899"
              strokeWidth="1.5"
            />

            {/* Flat Navy Athletic Laces Crossing Eyestays */}
            <g id="athletic-laces" stroke="#1d3d82" strokeWidth="6" strokeLinecap="round">
              <line x1="345" y1="120" x2="385" y2="135" />
              <line x1="375" y1="140" x2="415" y2="160" />
              <line x1="405" y1="165" x2="445" y2="185" />
              <line x1="435" y1="190" x2="475" y2="212" />
              <line x1="465" y1="215" x2="505" y2="238" />
              <line x1="495" y1="240" x2="532" y2="260" />
            </g>
            {/* Laces top highlight */}
            <g id="athletic-laces-hl" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
              <line x1="345" y1="120" x2="385" y2="135" />
              <line x1="375" y1="140" x2="415" y2="160" />
              <line x1="405" y1="165" x2="445" y2="185" />
              <line x1="435" y1="190" x2="475" y2="212" />
              <line x1="465" y1="215" x2="505" y2="238" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 4. MOLDED TPU HEEL STABILITY CAGE                         */}
          {/* ======================================================== */}
          <g id="tpu-heel-cage">
            {/* Outer Geometric Frame */}
            <path
              d="M 85 240 
                 C 80 200 86 168 112 165 
                 C 135 162 175 180 185 220 
                 C 192 250 188 280 178 300 
                 C 145 305 100 295 85 240 Z"
              fill={`url(#${id}-tpuCageGrad)`}
              stroke="#2e5bb8"
              strokeWidth="2"
            />
            {/* Inner triangular negative cutout */}
            <path
              d="M 100 235 
                 C 98 205 106 185 125 180 
                 C 145 188 165 210 162 245 
                 C 152 272 125 272 105 258 Z"
              fill="#0a142c"
              stroke="#1a367c"
              strokeWidth="1.5"
            />
          </g>

          {/* ======================================================== */}
          {/* 5. SIGNATURE DOUBLE AERODYNAMIC WHITE RACING STRIPES      */}
          {/* ======================================================== */}
          <g id="aerodynamic-racing-stripes">
            {/* Upper Dominant Sweeping White Racing Stripe */}
            <path
              d="M 172 195 
                 C 255 208 360 225 440 252 
                 C 505 275 555 315 572 360 
                 C 552 355 505 320 460 290 
                 C 380 240 270 215 172 195 Z"
              fill={`url(#${id}-racingStripeGrad)`}
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Lower Dynamic Accent White Stripe running parallel */}
            <path
              d="M 230 225 
                 C 295 240 375 260 435 300 
                 C 460 318 472 342 478 360 
                 C 465 352 445 330 420 310 
                 C 355 260 280 235 230 225 Z"
              fill={`url(#${id}-racingStripeGrad)`}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />

            {/* Third subtle trailing fine silver pinstripe */}
            <path
              d="M 285 255 C 335 272 385 300 415 335"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* ======================================================== */}
          {/* 6. SCULPTED WHITE FOAM MIDSOLE                           */}
          {/* ======================================================== */}
          <g id="white-foam-midsole">
            {/* Main Sculpted Midsole Body */}
            <path
              d="M 52 320 
                 C 45 345 55 375 75 395 
                 C 105 425 210 428 340 426 
                 C 420 425 470 415 520 395 
                 C 580 372 650 365 720 366 
                 C 770 366 805 350 812 335 
                 C 810 320 780 300 750 310 
                 C 700 325 610 326 530 324 
                 C 430 322 340 320 230 322 
                 C 130 324 70 310 52 320 Z"
              fill={`url(#${id}-foamSoleGrad)`}
              stroke="#e2e8f0"
              strokeWidth="1.2"
            />

            {/* Midsole Sculpted Organic Curving Ridges & Grooves */}
            <g stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.75">
              <path d="M 68 338 C 110 348 200 354 320 352 C 400 350 480 342 550 345" />
              <path d="M 85 358 C 130 368 220 375 335 374 C 410 372 470 364 530 368" />
              <path d="M 530 378 C 600 376 680 376 755 365" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 7. DUAL VISIBLE AIR CUSHIONING PODS IN HEEL               */}
          {/* ======================================================== */}
          <g id="dual-air-cushion-system">
            {/* --- AIR POD 1: REAR CAPSULE (Under Calcaneus) --- */}
            <g id="air-pod-rear" transform="translate(32, 335)">
              {/* Outer Cavity Frame in Midsole */}
              <rect
                x="0"
                y="0"
                width="135"
                height="60"
                rx="30"
                fill="#0a142c"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Internal Cushioning Chamber Volume */}
              <rect
                x="4"
                y="4"
                width="127"
                height="52"
                rx="26"
                fill={`url(#${id}-airGlassGrad)`}
              />

              {/* Vertical Structural Support Pillars (Internal Gas Struts) */}
              <g fill="#1e293b" stroke="#475569" strokeWidth="1">
                <rect x="36" y="8" width="16" height="44" rx="4" />
                <rect x="80" y="8" width="16" height="44" rx="4" />
              </g>

              {/* Glass Air Bubble Reflections & Surface Specular Glints */}
              <ellipse
                cx="67"
                cy="14"
                rx="50"
                ry="6"
                fill={`url(#${id}-bubbleReflection)`}
              />
              <circle cx="28" cy="20" r="5" fill="#ffffff" opacity="0.75" />
              <circle cx="106" cy="20" r="5" fill="#ffffff" opacity="0.75" />

              {/* Bottom Ground Ambient Reflection */}
              <ellipse cx="67" cy="48" rx="42" ry="4" fill="#ffffff" opacity="0.35" />
            </g>

            {/* --- AIR POD 2: MID-HEEL CAPSULE (Under Arch Archway) --- */}
            <g id="air-pod-front" transform="translate(192, 342)">
              {/* Outer Cavity Frame in Midsole */}
              <rect
                x="0"
                y="0"
                width="155"
                height="58"
                rx="29"
                fill="#0a142c"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Internal Cushioning Chamber Volume */}
              <rect
                x="4"
                y="4"
                width="147"
                height="50"
                rx="25"
                fill={`url(#${id}-airGlassGrad)`}
              />

              {/* Vertical Structural Support Pillars */}
              <g fill="#1e293b" stroke="#475569" strokeWidth="1">
                <rect x="42" y="7" width="16" height="44" rx="4" />
                <rect x="94" y="7" width="16" height="44" rx="4" />
              </g>

              {/* Glass Reflections & Specular Glints */}
              <ellipse
                cx="77"
                cy="13"
                rx="60"
                ry="5"
                fill={`url(#${id}-bubbleReflection)`}
              />
              <circle cx="32" cy="18" r="4.5" fill="#ffffff" opacity="0.75" />
              <circle cx="120" cy="18" r="4.5" fill="#ffffff" opacity="0.75" />
              <ellipse cx="77" cy="46" rx="50" ry="3.5" fill="#ffffff" opacity="0.35" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 8. DARK NAVY CARBON RUBBER TRACTION OUTSOLE PODS          */}
          {/* ======================================================== */}
          <g id="carbon-rubber-outsole">
            {/* Heel Crash Pad Pod */}
            <path
              d="M 30 380 
                 C 25 395 35 418 55 432 
                 C 85 450 145 448 165 435 
                 C 170 425 160 412 140 405 
                 C 95 390 50 380 30 380 Z"
              fill="#08142c"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Midfoot Stability Bridge Pod */}
            <path
              d="M 185 430 
                 C 210 442 270 445 320 442 
                 C 330 435 325 425 305 420 
                 C 260 415 210 418 185 430 Z"
              fill="#08142c"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Forefoot Traction Pod 1 */}
            <path
              d="M 445 425 
                 C 470 445 520 448 555 445 
                 C 555 435 540 425 510 420 
                 C 480 418 455 420 445 425 Z"
              fill="#08142c"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Forefoot Traction Pod 2 */}
            <path
              d="M 565 442 
                 C 600 448 640 445 665 438 
                 C 665 430 650 422 620 420 
                 C 590 418 575 430 565 442 Z"
              fill="#08142c"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Forefoot Toe Rocker & Protective Bumper Cap */}
            <path
              d="M 685 430 
                 C 730 438 780 415 805 378 
                 C 818 358 820 338 815 328 
                 C 805 322 795 330 790 345 
                 C 775 385 735 410 685 430 Z"
              fill="#08142c"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Outsole Deep Flex Grooves for natural articulation */}
            <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round">
              <line x1="172" y1="422" x2="182" y2="435" />
              <line x1="330" y1="430" x2="345" y2="442" />
              <line x1="556" y1="432" x2="564" y2="446" />
              <line x1="670" y1="426" x2="682" y2="438" />
            </g>
          </g>
        </g>
      </svg>
    );
  };

  // 2. Perspective 3/4 Dynamic View
  const renderPerspectiveView = () => {
    return (
      <div className="relative w-full aspect-4/3 flex items-center justify-center">
        <div className="w-[94%] transform -rotate-3 scale-98 transition-transform duration-300">
          {renderSideView()}
        </div>
      </div>
    );
  };

  // 3. Top Down Insole & Mesh Lacing View
  const renderTopView = () => {
    return (
      <svg viewBox="0 0 420 380" fill="none" className="w-full h-auto drop-shadow-lg">
        {/* Left Shoe */}
        <g transform="translate(30, 20)">
          <path
            d="M 70 35 C 110 30 145 55 152 110 C 158 175 160 240 138 295 C 120 328 85 332 55 328 C 22 322 5 288 5 225 C 5 155 25 35 70 35 Z"
            fill={colorway.knitColor}
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Outer Midsole Rim */}
          <path
            d="M 70 25 C 120 20 160 45 168 110 C 175 180 175 250 150 310 C 130 345 90 350 55 345 C 15 338 -5 300 -5 225 C -5 145 18 25 70 25 Z"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
          />
          {/* Anatomical Insole */}
          <ellipse cx="78" cy="210" rx="42" ry="70" fill="#0c1b40" />
          <text
            x="78"
            y="215"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
            fill="#ffffff"
            textAnchor="middle"
            letterSpacing="1"
          >
            KORVA
          </text>
          {/* Lacing */}
          <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="50" y1="90" x2="105" y2="108" />
            <line x1="50" y1="120" x2="105" y2="138" />
            <line x1="50" y1="150" x2="105" y2="168" />
          </g>
        </g>
        {/* Right Shoe */}
        <g transform="translate(205, 20)">
          <path
            d="M 70 35 C 110 30 145 55 152 110 C 158 175 160 240 138 295 C 120 328 85 332 55 328 C 22 322 5 288 5 225 C 5 155 25 35 70 35 Z"
            fill={colorway.knitColor}
            stroke="#ffffff"
            strokeWidth="3"
          />
          <path
            d="M 70 25 C 120 20 160 45 168 110 C 175 180 175 250 150 310 C 130 345 90 350 55 345 C 15 338 -5 300 -5 225 C -5 145 18 25 70 25 Z"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
          />
          <ellipse cx="78" cy="210" rx="42" ry="70" fill="#0c1b40" />
          <text
            x="78"
            y="215"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
            fill="#ffffff"
            textAnchor="middle"
            letterSpacing="1"
          >
            KORVA
          </text>
          <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="50" y1="90" x2="105" y2="108" />
            <line x1="50" y1="120" x2="105" y2="138" />
            <line x1="50" y1="150" x2="105" y2="168" />
          </g>
        </g>
      </svg>
    );
  };

  // 4. Rear Heel & Dual Air Cushion Profile
  const renderRearView = () => {
    return (
      <svg viewBox="0 0 340 400" fill="none" className="w-full h-auto drop-shadow-md">
        {/* Rear Heel Upper */}
        <path
          d="M 125 45 C 150 40 190 40 215 45 C 235 75 250 160 255 250 C 255 295 230 315 170 315 C 110 315 85 295 85 250 C 90 160 105 75 125 45 Z"
          fill={colorway.knitColor}
          stroke="#0f1f45"
          strokeWidth="2"
        />
        {/* Heel Pull Tab */}
        <path d="M 155 45 L 155 15 C 155 5 185 5 185 15 L 185 45" stroke="#1d3d82" strokeWidth="8" strokeLinecap="round" />
        {/* TPU Frame */}
        <path d="M 95 240 C 130 220 210 220 245 240 C 250 270 240 290 230 300 C 190 305 150 305 110 300 Z" fill="#0c1b40" stroke="#254899" strokeWidth="1.5" />
        {/* Sculpted Sole Base with Air Pod Window */}
        <path
          d="M 65 290 C 110 280 230 280 275 290 C 290 325 280 355 260 365 C 210 375 130 375 80 365 C 60 355 50 325 65 290 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        {/* Air Chamber Window */}
        <rect x="110" y="315" width="120" height="36" rx="18" fill="#0a142c" stroke="#64748b" strokeWidth="1.5" />
        <rect x="114" y="318" width="112" height="30" rx="15" fill="#3b82f6" opacity="0.35" />
      </svg>
    );
  };

  // 5. Outsole Running Grip Tread View
  const renderSoleView = () => {
    return (
      <svg viewBox="0 0 340 460" fill="none" className="w-full h-auto drop-shadow-md">
        <path
          d="M 110 30 C 160 25 220 40 235 105 C 245 160 230 240 250 325 C 255 385 220 425 165 425 C 110 425 80 385 85 325 C 105 240 90 160 100 105 C 105 70 95 45 110 30 Z"
          fill="#08142c"
          stroke="#1e3f8a"
          strokeWidth="3"
        />
        {/* Air Unit Translucent Window on Outsole */}
        <ellipse cx="168" cy="335" rx="42" ry="24" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
        <text
          x="168"
          y="339"
          fill="#ffffff"
          fontSize="9"
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          DUAL AIR
        </text>
        {/* Flex Tread Grooves */}
        <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
          <path d="M 120 80 Q 168 95 218 80" />
          <path d="M 115 130 Q 168 145 222 130" />
          <path d="M 120 185 Q 168 200 218 185" />
          <path d="M 115 245 Q 168 260 220 245" />
        </g>
      </svg>
    );
  };

  // 6. Direct Front Elevation View (Exact match to "Deep navy sneaker on transparent background.png")
  const renderFrontView = () => {
    return (
      <svg
        viewBox="50 10 500 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[480px] mx-auto h-auto drop-shadow-2xl"
        style={{
          transform: `perspective(900px) rotateY(${rotationY}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <defs>
          {/* Honeycomb Pattern for Front Vamp */}
          <pattern id={`${id}-frontMesh`} width="8" height="8" patternUnits="userSpaceOnUse">
            <ellipse cx="4" cy="4" rx="2" ry="1.6" fill="#081432" opacity="0.5" />
            <path d="M 0 4 Q 2 1.5 4 4 Q 6 6.5 8 4" stroke="#254899" strokeWidth="0.7" fill="none" opacity="0.35" />
          </pattern>

          <linearGradient id={`${id}-frontKnitGrad`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1e3f8a" />
            <stop offset="60%" stopColor={colorway.knitColor} />
            <stop offset="100%" stopColor="#0c1b40" />
          </linearGradient>

          <linearGradient id={`${id}-frontSoleGrad`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id={`${id}-frontBubbleGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#0f172a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        <g id="front-sneaker-group">
          {/* ======================================================== */}
          {/* A. REAR HEEL COLLAR & PULL TAB AT APEX                   */}
          {/* ======================================================== */}
          {/* Left Padded Collar Wall (Behind Tongue) */}
          <path
            d="M 215 130 C 180 120 160 150 165 240 C 170 280 185 300 205 315"
            stroke="#0a142c"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 215 130 C 180 120 160 150 165 240 C 170 280 185 300 205 315"
            stroke="#1d3d82"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Padded Collar Wall (Behind Tongue) */}
          <path
            d="M 385 130 C 420 120 440 150 435 240 C 430 280 415 300 395 315"
            stroke="#0a142c"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 385 130 C 420 120 440 150 435 240 C 430 280 415 300 395 315"
            stroke="#1d3d82"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />

          {/* Vertical Apex Pull-Tab Ribbon at Top of Tongue */}
          <rect x="286" y="15" width="28" height="35" rx="4" fill="#0d1b3d" stroke="#254899" strokeWidth="2" />
          <line x1="300" y1="20" x2="300" y2="45" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

          {/* High Raised Tongue Dome */}
          <path
            d="M 235 155 C 240 85 260 45 300 45 C 340 45 360 85 365 155 Z"
            fill={`url(#${id}-frontKnitGrad)`}
            stroke="#254899"
            strokeWidth="2"
          />
          {/* Tongue Mesh Overlay */}
          <path
            d="M 235 155 C 240 85 260 45 300 45 C 340 45 360 85 365 155 Z"
            fill={`url(#${id}-frontMesh)`}
          />

          {/* ======================================================== */}
          {/* B. REAR AIR CUSHION BUBBLES PROTRUDING AT FLANKS         */}
          {/* ======================================================== */}
          {/* Left Flank Visible Air Capsule */}
          <g id="front-left-air-bubble">
            <ellipse cx="106" cy="495" rx="30" ry="40" fill="#081024" stroke="#475569" strokeWidth="2" />
            <ellipse cx="106" cy="495" rx="26" ry="36" fill={`url(#${id}-frontBubbleGrad)`} />
            <rect x="100" y="470" width="8" height="50" rx="3" fill="#1e293b" opacity="0.8" />
            <ellipse cx="98" cy="478" rx="8" ry="16" fill="#ffffff" opacity="0.5" />
          </g>

          {/* Right Flank Visible Air Capsule */}
          <g id="front-right-air-bubble">
            <ellipse cx="494" cy="495" rx="30" ry="40" fill="#081024" stroke="#475569" strokeWidth="2" />
            <ellipse cx="494" cy="495" rx="26" ry="36" fill={`url(#${id}-frontBubbleGrad)`} />
            <rect x="492" y="470" width="8" height="50" rx="3" fill="#1e293b" opacity="0.8" />
            <ellipse cx="502" cy="478" rx="8" ry="16" fill="#ffffff" opacity="0.5" />
          </g>

          {/* ======================================================== */}
          {/* C. SCULPTED WHITE FOAM MIDSOLE (Front Curve)              */}
          {/* ======================================================== */}
          <path
            d="M 100 520 
               C 120 450 160 460 210 475 
               C 255 490 280 488 300 488 
               C 320 488 345 490 390 475 
               C 440 460 480 450 500 520 
               C 515 570 480 585 435 588 
               C 380 592 335 590 300 590 
               C 265 590 220 592 165 588 
               C 120 585 85 570 100 520 Z"
            fill={`url(#${id}-frontSoleGrad)`}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Midsole Sculpted Organic Curving Wave Lines */}
          <path d="M 125 535 C 180 550 250 555 300 555 C 350 555 420 550 475 535" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 140 560 C 200 572 260 575 300 575 C 340 575 400 572 460 560" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

          {/* ======================================================== */}
          {/* D. MAIN BLUE HONEYCOMB UPPER & SYMMETRICAL RACING STRIPES*/}
          {/* ======================================================== */}
          {/* Main Upper Knit Contour */}
          <path
            d="M 130 455 
               C 135 340 165 240 210 185 
               C 235 155 265 140 300 140 
               C 335 140 365 155 390 185 
               C 435 240 465 340 470 455 
               C 460 485 390 485 300 485 
               C 210 485 140 485 130 455 Z"
            fill={`url(#${id}-frontKnitGrad)`}
          />
          {/* Honeycomb Knit Overlay */}
          <path
            d="M 130 455 
               C 135 340 165 240 210 185 
               C 235 155 265 140 300 140 
               C 335 140 365 155 390 185 
               C 435 240 465 340 470 455 
               C 460 485 390 485 300 485 
               C 210 485 140 485 130 455 Z"
            fill={`url(#${id}-frontMesh)`}
          />

          {/* Left Flank White Racing Stripes (Curving along outer quarter) */}
          <path
            d="M 148 340 C 145 375 148 420 156 460 C 165 460 165 420 162 375 C 160 340 152 320 148 340 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <path
            d="M 140 370 C 138 395 140 430 146 455 C 150 455 150 425 148 395 Z"
            fill="#ffffff"
            opacity="0.8"
          />

          {/* Right Flank White Racing Stripes (Curving along outer quarter) */}
          <path
            d="M 452 340 C 455 375 452 420 444 460 C 435 460 435 420 438 375 C 440 340 448 320 452 340 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <path
            d="M 460 370 C 462 395 460 430 454 455 C 450 455 450 425 452 395 Z"
            fill="#ffffff"
            opacity="0.8"
          />

          {/* ======================================================== */}
          {/* E. SYMMETRICAL EYESTAY REINFORCEMENTS & NAVY LACES       */}
          {/* ======================================================== */}
          {/* Left Eyestay Support Stay */}
          <path
            d="M 245 160 C 235 185 220 220 220 280 C 235 295 245 285 250 270 C 255 225 265 185 270 160 Z"
            fill="#102555"
            stroke="#254899"
            strokeWidth="1.2"
          />
          {/* Right Eyestay Support Stay */}
          <path
            d="M 355 160 C 365 185 380 220 380 280 C 365 295 355 285 350 270 C 345 225 335 185 330 160 Z"
            fill="#102555"
            stroke="#254899"
            strokeWidth="1.2"
          />

          {/* Flat Navy Athletic Laces Climbing Up Instep */}
          <g id="front-athletic-laces" stroke="#1d3d82" strokeWidth="6" strokeLinecap="round">
            <line x1="230" y1="285" x2="370" y2="285" />
            <line x1="235" y1="250" x2="365" y2="250" />
            <line x1="242" y1="215" x2="358" y2="215" />
            <line x1="250" y1="185" x2="350" y2="185" />
            <line x1="260" y1="160" x2="340" y2="160" />
          </g>
          {/* Laces Metallic Blue Highlight */}
          <g id="front-athletic-laces-hl" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
            <line x1="230" y1="285" x2="370" y2="285" />
            <line x1="235" y1="250" x2="365" y2="250" />
            <line x1="242" y1="215" x2="358" y2="215" />
            <line x1="250" y1="185" x2="350" y2="185" />
          </g>

          {/* ======================================================== */}
          {/* F. FRONT RUBBER TOE BUMPER (Curving up over the front)   */}
          {/* ======================================================== */}
          <path
            d="M 235 480 
               C 230 455 250 440 300 440 
               C 350 440 370 455 365 480 
               C 370 515 350 535 300 535 
               C 250 535 230 515 235 480 Z"
            fill="#08142c"
            stroke="#1e3f8a"
            strokeWidth="2"
          />
          {/* Knurled Grip Texture Lines on Toe Bumper */}
          <g stroke="#1e293b" strokeWidth="2" strokeLinecap="round">
            <path d="M 265 470 Q 300 475 335 470" />
            <path d="M 255 490 Q 300 495 345 490" />
            <path d="M 260 510 Q 300 515 340 510" />
          </g>

          {/* ======================================================== */}
          {/* G. OUTSOLE GROUND TRACTION LUGS AT THE VERY BOTTOM       */}
          {/* ======================================================== */}
          <path
            d="M 120 575 
               C 150 610 220 615 300 615 
               C 380 615 450 610 480 575 
               C 490 595 450 615 400 622 
               C 340 626 260 626 200 622 
               C 150 615 110 595 120 575 Z"
            fill="#050c1f"
            stroke="#0f172a"
            strokeWidth="2"
          />
          {/* Outsole Segmented Pod Lugs */}
          <g fill="#08142c" stroke="#1e293b" strokeWidth="1.5">
            <rect x="190" y="598" width="40" height="18" rx="4" />
            <rect x="245" y="602" width="50" height="20" rx="4" />
            <rect x="310" y="602" width="50" height="20" rx="4" />
            <rect x="375" y="598" width="40" height="18" rx="4" />
          </g>
        </g>
      </svg>
    );
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* Sneaker Vector Angle Renderer */}
      {viewAngle === 'side' && renderSideView()}
      {viewAngle === 'front' && renderFrontView()}
      {viewAngle === 'perspective' && renderPerspectiveView()}
      {viewAngle === 'top' && renderTopView()}
      {viewAngle === 'rear' && renderRearView()}
      {viewAngle === 'sole' && renderSoleView()}

      {/* Realistic Ground Contact Shadow under the air-cushion sole */}
      <div
        className="w-[84%] mx-auto h-8 rounded-full -mt-5 pointer-events-none transition-all duration-300"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10, 25, 60, 0.28) 0%, rgba(10, 25, 60, 0.1) 45%, rgba(0,0,0,0) 75%)',
          filter: 'blur(7px)',
        }}
      />
    </div>
  );
};
