import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'closed' | 'opening' | 'revealed'>('closed');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already seen intro in this session
    const hasSeen = sessionStorage.getItem('2simoveis_intro_seen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeen || prefersReducedMotion) {
      onComplete();
      return;
    }

    // Sequence timing (~2.6s total)
    const t1 = setTimeout(() => {
      setStage('opening');
    }, 950);

    const t2 = setTimeout(() => {
      setStage('revealed');
    }, 2200);

    const t3 = setTimeout(() => {
      handleFinish();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem('2simoveis_intro_seen', 'true');
    setDismissed(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="cinematic-intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'revealed' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080A] text-[#FAF9F6] overflow-hidden select-none pointer-events-auto"
      >
        {/* Skip button in upper right */}
        <button
          id="skip-intro-btn"
          onClick={handleFinish}
          className="absolute top-6 right-6 z-40 flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-black/50 text-xs tracking-widest uppercase text-white/70 hover:text-white hover:border-[#C5A880] transition-colors backdrop-blur-md cursor-pointer"
        >
          <span>Saltar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Background glow of modern luxury villa revealed when doors open */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
            stage === 'opening' || stage === 'revealed' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Architectural warm interior light & ambient golden aura */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#1A1815]/80 to-[#07080A]" />
          <div className="w-[700px] h-[700px] rounded-full bg-[#E5C9A1]/20 blur-[140px] pointer-events-none" />
          
          <div className="relative text-center px-6 z-10">
            <span className="text-[#C5A880] text-xs uppercase tracking-[0.4em] font-medium block mb-2">
              Arquitectura & Exclusividade
            </span>
            <h2 className="font-serif text-3xl sm:text-6xl text-[#FAF9F6] font-normal tracking-wide">
              {BRAND_CONFIG.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light mt-2 tracking-widest uppercase">
              Maputo • Moçambique
            </p>
          </div>
        </div>

        {/* 3D Fluted Charcoal Architectural Double Doors */}
        <div
          className="relative w-full max-w-xl h-[78vh] max-h-[640px] flex justify-center [perspective:1400px] z-20 px-4"
        >
          {/* Left Charcoal Fluted Door */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: stage === 'opening' || stage === 'revealed' ? -80 : 0,
            }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            style={{ transformOrigin: 'left center' }}
            className="w-1/2 h-full bg-fluted-door border-l border-y border-white/15 rounded-l-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-6 overflow-hidden"
          >
            {/* Ambient edge shadow */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-[#C5A880]/50 to-white/20" />
            
            {/* Subtle top indicator */}
            <div className="text-[10px] tracking-[0.25em] text-[#C5A880]/50 uppercase font-mono">
              01 // L
            </div>

            {/* Left door handle (fluted brushed brass vertical bar) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-44 rounded-full bg-gradient-to-b from-[#E2C79A] via-[#C5A880] to-[#8C6D3F] shadow-[0_0_15px_rgba(197,168,128,0.4)]" />

            <div className="text-[9px] tracking-widest text-stone-500 uppercase font-mono">
              CURATED RESIDENCES
            </div>
          </motion.div>

          {/* Right Charcoal Fluted Door */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: stage === 'opening' || stage === 'revealed' ? 80 : 0,
            }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            style={{ transformOrigin: 'right center' }}
            className="w-1/2 h-full bg-fluted-door border-r border-y border-white/15 rounded-r-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-6 overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-[#C5A880]/50 to-white/20" />

            <div className="text-right text-[10px] tracking-[0.25em] text-[#C5A880]/50 uppercase font-mono">
              02 // R
            </div>

            {/* Right door handle (fluted brushed brass vertical bar) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-44 rounded-full bg-gradient-to-b from-[#E2C79A] via-[#C5A880] to-[#8C6D3F] shadow-[0_0_15px_rgba(197,168,128,0.4)]" />

            <div className="text-right text-[9px] tracking-widest text-stone-500 uppercase font-mono">
              MAPUTO, MZ
            </div>
          </motion.div>

          {/* The discrete temporary "X" monogram on the seam */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: stage === 'closed' ? 1 : 0,
              scale: stage === 'closed' ? 1 : 1.15,
            }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-full border border-[#C5A880]/60 bg-[#0E0F12]/95 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(197,168,128,0.25)]">
              <span className="font-serif text-3xl font-light text-[#E5C9A1] tracking-wider">
                {BRAND_CONFIG.introBrandSymbol}
              </span>
            </div>
            <span className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[#C5A880]/70 font-medium">
              {BRAND_CONFIG.introSubtitle}
            </span>
          </motion.div>
        </div>

        {/* Minimalist lower progress mark */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-stone-500 text-xs tracking-widest uppercase font-mono">
          <div className="w-10 h-[1px] bg-stone-700" />
          <span>Acesso Privado</span>
          <div className="w-10 h-[1px] bg-stone-700" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
