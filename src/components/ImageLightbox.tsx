import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
  title,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      id="lightbox-modal"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header */}
      <div
        className="flex items-center justify-between text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-md truncate">
          <p className="font-serif text-base sm:text-lg text-white/90 truncate">{title}</p>
          <span className="text-xs text-white/50">
            Foto {currentIndex + 1} de {images.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Fechar (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Area with Navigation Buttons */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors backdrop-blur-xs cursor-pointer"
          title="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={images[currentIndex]}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
        />

        <button
          onClick={onNext}
          className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors backdrop-blur-xs cursor-pointer"
          title="Próxima foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div
        className="flex justify-center gap-2 overflow-x-auto py-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx > currentIndex) onNext();
              else if (idx < currentIndex) onPrev();
            }}
            className={`w-14 h-10 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              idx === currentIndex
                ? 'border-[#C5A880] opacity-100 scale-105'
                : 'border-transparent opacity-40 hover:opacity-80'
            }`}
          >
            <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
