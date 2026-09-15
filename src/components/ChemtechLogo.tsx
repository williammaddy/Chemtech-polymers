import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
interface ChemtechLogoProps {
  variant?: 'navbar' | 'footer' | 'mark-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  lightText?: boolean;
}

export const ChemtechLogo: React.FC<ChemtechLogoProps> = ({
  variant = 'navbar',
  size = 'md',
  className = '',
  lightText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Height settings for the real logo image
  const heights = {
    sm: 36,
    md: 46,
    lg: 58,
  }[size];

  // If the real uploaded logo image is available and hasn't errored out
  if (!imageError && variant !== 'mark-only') {
    return (
      <div
        className={`chemtech-logo-wrapper ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        <img
          src={Logo}
          alt="Chemtech Polymers"
          style={{
            height: `${heights}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            // On dark footer, brighten slightly or keep original crisp colors
            filter: lightText ? 'brightness(1.15) contrast(1.05)' : 'none',
          }}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Vector SVG Fallback / Mark-Only rendering
  const dimensions = {
    sm: { height: 36, markWidth: 38, fontSize: 24, subFontSize: 9 },
    md: { height: 46, markWidth: 48, fontSize: 30, subFontSize: 11 },
    lg: { height: 60, markWidth: 62, fontSize: 38, subFontSize: 13 },
  }[size];

  const primaryBlue = '#2B3A8F';
  const textColor = lightText ? '#FFFFFF' : primaryBlue;
  const subTextColor = lightText ? 'rgba(255, 255, 255, 0.75)' : '#475569';
  const gradId = 'c-grad-' + size + (lightText ? '-light' : '-dark');

  return (
    <div
      className={'chemtech-logo-container ' + className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'lg' ? '12px' : '8px',
        userSelect: 'none',
      }}
    >
      {/* SVG Icon Mark: 5 Dots + Stylized C with Arrow */}
      <svg
        width={dimensions.markWidth}
        height={dimensions.height}
        viewBox="0 0 70 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lightText ? '#7083FF' : '#3D4EB3'} />
            <stop offset="100%" stopColor={lightText ? '#FFFFFF' : primaryBlue} />
          </linearGradient>
        </defs>

        {/* 5 Distinct Colored Dots Arched Over The Mark */}
        <circle cx="12" cy="11" r="4.2" fill="#F37021" />
        <circle cx="23" cy="6" r="4.2" fill="#ED1C24" />
        <circle cx="35" cy="4" r="4.2" fill="#92278F" />
        <circle cx="47" cy="6" r="4.2" fill="#00A896" />
        <circle cx="58" cy="11" r="4.2" fill="#FBB03B" />

        {/* Stylized 'C' circular body */}
        <path
          d="M 52 27 
             C 47 21, 38 19, 29 21 
             C 18 24, 11 34, 13 44 
             C 15 54, 25 61, 36 60 
             C 45 59, 53 53, 55 45
             L 43.5 45
             C 42 49, 37 51.5, 33 51
             C 26.5 50.5, 22.5 45, 23 39
             C 23.5 32.5, 28.5 28.5, 35 29
             C 38.5 29.3, 42 31, 44 34
             Z"
          fill={'url(#' + gradId + ')'}
        />

        {/* Arrow element integrating into the dynamic C flow */}
        <polygon points="54,23 43,28 51,36" fill={lightText ? '#FFFFFF' : primaryBlue} />
      </svg>

      {/* Wordmark: 'hemtech' + 'INDIA' */}
      {variant !== 'mark-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: dimensions.fontSize + 'px',
              fontWeight: 800,
              color: textColor,
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span>hemtech</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: dimensions.subFontSize + 'px',
              fontWeight: 700,
              color: subTextColor,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginTop: '2px',
              paddingLeft: '2px',
            }}
          >
            India
          </div>
        </div>
      )}
    </div>
  );
};
