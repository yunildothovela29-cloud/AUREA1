import React from 'react';

interface BrandLogoProps { compact?: boolean; light?: boolean; className?: string; }

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, light = false, className = '' }) => {
  const ink = light ? '#FFFFFF' : '#14245F';
  const red = '#D93030';

  return (
    <div className={'flex items-center gap-3 ' + className} aria-label="2Simoveis">
      <div className="flex items-center justify-center shrink-0 select-none" style={{ color: red }}>
        <span
          className="font-black italic leading-none tracking-[-0.12em]"
          style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: compact ? 26 : 34 }}
        >
          2S
        </span>
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="font-medium tracking-[-0.02em]" style={{ color: ink, fontSize: 20 }}>
            Imobiliária <span className="font-normal">&amp;</span>
          </span>
          <span className="font-medium tracking-[-0.02em]" style={{ color: ink, fontSize: 20 }}>
            Serviços
          </span>
        </div>
      )}
    </div>
  );
};
