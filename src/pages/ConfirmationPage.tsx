import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, User, Phone, ArrowRight, MessageCircle, Home } from 'lucide-react';
import { getWhatsAppUrl } from '../data/config';

export const ConfirmationPage: React.FC = () => {
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = sessionStorage.getItem('aurea_latest_booking');
    if (saved) {
      try {
        setBooking(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <div className="pt-32 pb-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-[#261B14]">
      <div className="bg-white rounded-3xl border border-[#E8E2D6] shadow-sm p-10 sm:p-14 text-center">
        {/* Animated Architectural Icon */}
        <div className="w-20 h-20 rounded-full bg-[#EDF6EE] border border-[#C6E2C9] text-[#2C6B38] flex items-center justify-center mx-auto mb-8 shadow-xs animate-in zoom-in-90 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Brand Tag */}
        <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block mb-4">
          Pedido Confirmado
        </span>

        {/* Required Primary Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl text-[#221A15] font-normal mb-6 tracking-tight">
          Recebemos o seu pedido.
        </h1>

        {/* Exact phrase from specification */}
        <p className="text-lg text-[#5E5249] max-w-lg mx-auto mb-10 leading-relaxed tracking-wide">
          Um dos nossos consultores entrará em contacto consigo brevemente para alinhar os detalhes da visita e confirmar a disponibilidade do proprietário.
        </p>

        {/* Booking Summary Box (if present from submission) */}
        {booking && (
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] rounded-2xl p-8 mb-10 text-left max-w-lg mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-6">
              <span className="text-xs font-mono uppercase text-[#6B5E54]">
                Referência do Pedido
              </span>
              <span className="text-xs font-mono font-bold text-[#825A39]">
                {booking.id}
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#5E5249]">
              <div className="flex items-start gap-2.5">
                <Home className="w-4 h-4 text-[#825A39] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[#221A15]">{booking.propertyTitle}</span>
                  <span className="text-[#6B5E54]">{booking.propertyLocation}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#825A39] shrink-0" />
                <span>
                  Data: <strong className="text-[#221A15]">{booking.preferredDate}</strong> às <strong className="text-[#221A15]">{booking.preferredTime}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#825A39] shrink-0" />
                <span>Titular: <strong className="text-[#221A15]">{booking.fullName}</strong></span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#825A39] shrink-0" />
                <span>Contacto: <strong className="text-[#221A15]">{booking.phone}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Immediate Next Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/comprar"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#3E2819] text-[#FAF8F5] hover:bg-[#26180E] text-xs uppercase tracking-widest font-semibold transition-all shadow-xs"
          >
            Explorar mais imóveis
          </Link>

          <a
            href={getWhatsAppUrl(
              booking
                ? `Olá! Acabei de enviar o pedido de visita ${booking.id} para o imóvel "${booking.propertyTitle}".`
                : undefined
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#E0D7C9] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#221A15] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Falar no WhatsApp agora</span>
          </a>
        </div>

        {/* Back to Home link */}
        <div className="mt-8">
          <Link
            to="/"
            className="text-xs text-[#6B5E54] hover:text-[#221A15] font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>Voltar à Página Inicial</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
