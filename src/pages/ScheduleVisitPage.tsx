import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PROPERTIES } from '../data/properties';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  MessageCircle,
  Loader2
} from 'lucide-react';

export const ScheduleVisitPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedPropertyId = searchParams.get('imovel') || '';

  // Form State
  const [propertyId, setPropertyId] = useState(preselectedPropertyId);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedPropertyId) {
      setPropertyId(preselectedPropertyId);
    }
  }, [preselectedPropertyId]);

  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Por favor indique o seu nome completo.';
    if (!phone.trim() || phone.length < 8) errs.phone = 'Indique um número de contacto válido.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Indique um e-mail válido.';
    if (!propertyId) errs.propertyId = 'Por favor seleccione o imóvel pretendido.';
    if (!preferredDate) errs.preferredDate = 'Seleccione a data pretendida.';
    if (!preferredTime) errs.preferredTime = 'Seleccione o horário pretendido.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const selectedProp = PROPERTIES.find(
      (p) => p.id === propertyId || p.slug === propertyId
    );

    const bookingPayload = {
      propertyId: propertyId,
      propertyTitle: selectedProp ? selectedProp.title : 'Imóvel Geral Aurea',
      propertyLocation: selectedProp ? `${selectedProp.neighborhood}, ${selectedProp.location}` : 'Maputo',
      clientName: fullName,
      clientPhone: phone,
      clientEmail: email,
      preferredDate,
      preferredTime,
      message,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const docRef = await addDoc(collection(db, 'visits'), bookingPayload);

      // Call our API to send email
      await fetch('/api/schedule-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingPayload, id: docRef.id }),
      });

      sessionStorage.setItem('aurea_latest_booking', JSON.stringify({ ...bookingPayload, id: docRef.id }));
    } catch (error) {
      console.error('Error saving visit:', error);
    }

    setTimeout(() => {
      setSubmitting(false);
      navigate('/confirmacao');
    }, 900);
  };

  const timeSlots = [
    '09:00', '10:00', '11:30', '14:00', '15:30', '17:00'
  ];

  return (
    <div className="pt-32 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-[#261B14]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block mb-4">
          Atendimento Exclusivo
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#221A15] font-normal tracking-tight mb-6">
          Agendar Visita Presencial
        </h1>
        <p className="text-base text-[#5E5249] leading-relaxed tracking-wide">
          Preencha o formulário para marcar uma visita guiada com um dos nossos consultores seniores em Maputo.
        </p>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D6] shadow-md p-8 sm:p-14">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">
              Imóvel Escolhido <span className="text-[#825A39]">*</span>
            </label>
            <div className="relative">
              <select
                value={propertyId}
                onChange={(e) => {
                  setPropertyId(e.target.value);
                  if (errors.propertyId) setErrors((prev) => ({ ...prev, propertyId: '' }));
                }}
                className={`w-full py-3 px-4 bg-[#FAF8F5] border rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] cursor-pointer ${
                  errors.propertyId ? 'border-red-400' : 'border-[#E0D7C9]'
                }`}
              >
                <option value="">-- Seleccione a propriedade --</option>
                {PROPERTIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.location} • {p.priceDisplay})
                  </option>
                ))}
              </select>
            </div>
            {errors.propertyId && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.propertyId}</p>
            )}
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">
                Nome Completo <span className="text-[#825A39]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Ex: Carlos Mondlane"
                  className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] ${
                    errors.fullName ? 'border-red-400' : 'border-[#E0D7C9]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">
                Número de Telefone <span className="text-[#825A39]">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8C8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="+258 84 000 0000"
                  className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] ${
                    errors.phone ? 'border-red-400' : 'border-[#E0D7C9]'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">
              E-mail Profissional <span className="text-[#825A39]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="seu.email@empresa.com"
                className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] ${
                  errors.email ? 'border-red-400' : 'border-[#E0D7C9]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">
                Data Preferida <span className="text-[#825A39]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={tomorrowStr}
                  value={preferredDate}
                  onChange={(e) => {
                    setPreferredDate(e.target.value);
                    if (errors.preferredDate) setErrors((prev) => ({ ...prev, preferredDate: '' }));
                  }}
                  className={`w-full py-3 px-4 bg-[#FAF8F5] border rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] ${
                    errors.preferredDate ? 'border-red-400' : 'border-[#E0D7C9]'
                  }`}
                />
              </div>
              {errors.preferredDate && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.preferredDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">
                Hora Preferida <span className="text-[#825A39]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPreferredTime(slot)}
                    className={`py-2 px-2 text-xs rounded-lg border font-mono transition-colors cursor-pointer ${
                      preferredTime === slot
                        ? 'bg-[#3E2819] text-[#FAF8F5] border-[#3E2819] font-bold'
                        : 'bg-[#FAF8F5] text-[#5E5249] border-[#E0D7C9] hover:border-[#825A39]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message / Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E54] mb-3">
              Observações ou Questões Específicas
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Gostaria de saber se a garagem comporta duas viaturas altas ou se os anexos estão prontos para habitação imediata."
              className="w-full p-4 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] resize-none"
            />
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-3 text-[11px] text-[#6B5E54] tracking-wide bg-[#FAF8F5] p-4 rounded-xl border border-[#E0D7C9]">
            <ShieldCheck className="w-4 h-4 text-[#825A39] shrink-0 mt-0.5" />
            <span>
              Os seus dados serão tratados com estrita discrição pela equipa da {BRAND_CONFIG.name} exclusivamente para a organização desta visita.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              id="submit-booking-btn"
              className="w-full py-4 px-6 rounded-full bg-[#3E2819] hover:bg-[#26180E] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A processar o agendamento...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirmar Pedido de Visita</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* WhatsApp Alternative */}
        <div className="mt-8 pt-6 border-t border-[#F0EBE1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B5E54]">
          <span>Prefere agendar de imediato por mensagem directa?</span>
          <a
            href={getWhatsAppUrl('Olá! Gostaria de agendar uma visita com a Aurea Properties.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0D7C9] bg-[#FAF8F5] text-[#221A15] hover:bg-[#F2ECE1] font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Agendar via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
