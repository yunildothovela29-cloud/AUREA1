import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { getVisitWhatsAppUrl } from '../data/config';

export const ConfirmationPage: React.FC = () => {
  const raw = sessionStorage.getItem('2s_latest_booking');
  const booking = raw ? JSON.parse(raw) : null;
  const whatsappUrl = booking ? getVisitWhatsAppUrl({
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    clientEmail: booking.clientEmail,
    propertyTitle: booking.propertyTitle,
    propertyId: booking.propertyId,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
  }) : null;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F7F9FC] grid place-items-center px-4">
      <div className="w-full max-w-xl bg-white border border-[#E1E6EE] rounded-3xl p-7 sm:p-10 text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-[#D93030] mx-auto" />
        <p className="text-xs uppercase tracking-[0.18em] text-[#D93030] font-bold mt-5">Pedido registado</p>
        <h1 className="text-3xl font-semibold text-[#14245F] mt-2">Só falta enviar a mensagem</h1>
        <p className="text-sm text-[#667085] leading-relaxed mt-3">
          O WhatsApp deve ter aberto com os dados da visita preenchidos. Confirme o texto e toque em <strong>Enviar</strong>.
        </p>
        {booking && <div className="mt-6 text-left bg-[#F7F9FC] rounded-2xl p-4 text-sm text-[#566176]"><strong className="text-[#14245F]">{booking.propertyTitle}</strong><br />{booking.preferredDate} às {booking.preferredTime}</div>}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl bg-[#D93030] text-white font-semibold text-sm inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Abrir WhatsApp</a>}
          <Link to="/" className="flex-1 py-3 rounded-xl border border-[#E1E6EE] text-[#14245F] font-semibold text-sm">Voltar ao site</Link>
        </div>
      </div>
    </div>
  );
};
