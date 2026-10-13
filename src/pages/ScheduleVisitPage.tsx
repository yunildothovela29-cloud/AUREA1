import React, { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Loader2, Mail, Phone, User } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getVisitWhatsAppUrl, BRAND_CONFIG } from '../data/config';
import { useProperties } from '../hooks/useProperties';

export const ScheduleVisitPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { properties, loading } = useProperties();
  const selectedId = searchParams.get('imovel') || '';

  const [propertyId, setPropertyId] = useState(selectedId);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === propertyId || p.slug === propertyId),
    [properties, propertyId]
  );

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const times = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!propertyId || !fullName.trim() || !phone.trim() || !email.trim() || !date || !time) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const property = properties.find((p) => p.id === propertyId || p.slug === propertyId);
    if (!property) {
      setError('Seleccione uma propriedade válida.');
      return;
    }

    // Prepare WhatsApp before awaiting network requests, so browser popup
    // blockers do not prevent the client from contacting the agent.
    const booking = {
      clientName: fullName.trim(),
      clientPhone: phone.trim(),
      clientEmail: email.trim(),
      propertyTitle: property.title,
      propertyId: property.id,
      preferredDate: date,
      preferredTime: time,
      propertyAddress: property.address,
      extraMessage: message.trim(),
    };
    const whatsappUrl = getVisitWhatsAppUrl(booking);
    const whatsappWindow = window.open('about:blank', '_blank');

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.document.title = 'A abrir WhatsApp…';
      whatsappWindow.document.body.innerHTML = '<p style="font-family: sans-serif; padding: 24px">A preparar a mensagem para o WhatsApp do Sérgio…</p>';
    }

    setSaving(true);

    // WhatsApp remains the primary path. A database/schema/network error
    // must never cancel the user's ability to send the visit request.
    let saved = false;
    let saveErrorMessage = '';

    if (isSupabaseConfigured) {
      const payload = {
        property_id: property.id,
        property_title: property.title,
        property_location: property.address,
        client_name: booking.clientName,
        client_phone: booking.clientPhone,
        client_email: booking.clientEmail,
        preferred_date: booking.preferredDate,
        preferred_time: booking.preferredTime,
        message: message.trim() || null,
        status: 'pendente',
      };

      try {
        const { error: insertError } = await supabase.from('visits').insert(payload);
        if (insertError) {
          console.error('Erro ao guardar pedido de visita:', insertError);
          saveErrorMessage = insertError.message;
        } else {
          saved = true;
        }
      } catch (err) {
        console.error('Falha inesperada ao guardar pedido de visita:', err);
        saveErrorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      }
    } else {
      saveErrorMessage = 'Supabase não configurado';
    }

    try {
      sessionStorage.setItem('2s_latest_booking', JSON.stringify({
        ...booking,
        propertyAddress: property.address,
        extraMessage: message.trim(),
        savedInDatabase: saved,
      }));
    } catch (err) {
      console.warn('Não foi possível guardar a cópia local do pedido:', err);
    }

    setSaving(false);

    if (whatsappWindow && !whatsappWindow.closed) {
      whatsappWindow.location.href = whatsappUrl;
    } else {
      // Fallback if the browser blocked the new tab.
      window.location.href = whatsappUrl;
    }

    if (!saved) {
      setError('O WhatsApp será aberto com o pedido preparado, mas o site não conseguiu guardar uma cópia na base de dados. ' +
        (saveErrorMessage ? 'Detalhe técnico: ' + saveErrorMessage : ''));
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F7F9FC]">
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.18em] text-[#D93030] font-bold">Agendamento</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#14245F] mt-2">Marcar visita</h1>
          <p className="text-sm sm:text-base text-[#667085] mt-2">
            Escolha a propriedade, preencha os seus dados e indique a data e a hora.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#E1E6EE] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
          <div>
            <label className="label">Propriedade *</label>
            <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="field" disabled={loading}>
              <option value="">Escolha uma propriedade</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title} — {property.priceDisplay}
                </option>
              ))}
            </select>
            {selectedProperty && <p className="text-xs text-[#667085] mt-2">{selectedProperty.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nome *</label>
              <div className="relative"><User className="icon" /><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="field pl-10" placeholder="Nome completo" /></div>
            </div>
            <div>
              <label className="label">Telefone *</label>
              <div className="relative"><Phone className="icon" /><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field pl-10" placeholder="+258 ..." /></div>
            </div>
          </div>

          <div>
            <label className="label">Email *</label>
            <div className="relative"><Mail className="icon" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-10" placeholder="seuemail@exemplo.com" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Data *</label><input type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} className="field" /></div>
            <div>
              <label className="label">Hora *</label>
              <div className="grid grid-cols-3 gap-2">{times.map((slot) => (
                <button key={slot} type="button" onClick={() => setTime(slot)} className={'py-2.5 rounded-xl border text-sm font-semibold ' + (time === slot ? 'bg-[#14245F] text-white border-[#14245F]' : 'bg-[#F7F9FC] text-[#566176] border-[#E1E6EE]')}>{slot}</button>
              ))}</div>
            </div>
          </div>

          <div><label className="label">Mensagem (opcional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} className="field min-h-24" placeholder="Alguma informação adicional?" /></div>

          <div className="rounded-2xl bg-[#F5F7FA] border border-[#E1E6EE] p-4 text-sm text-[#566176]">
            O WhatsApp abrirá com os seus dados, o imóvel, a data e a hora preenchidos. Confirme a mensagem e toque em Enviar. Se a ligação à base de dados falhar, ainda poderá contactar o Sérgio pelo WhatsApp.
          </div>

          {error && <p className="text-sm text-[#B42318]">{error}</p>}

          <button disabled={saving} className="w-full py-3.5 rounded-xl bg-[#D93030] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#BF2525] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
            {saving ? 'A guardar…' : 'Marcar visita'}
          </button>

          <p className="text-xs text-[#7A8495] text-center">{BRAND_CONFIG.phoneDisplay} · {BRAND_CONFIG.email}</p>
        </form>
      </section>
      <style>{'.label{display:block;font-size:13px;font-weight:600;color:#14245F;margin-bottom:7px}.field{width:100%;box-sizing:border-box;min-height:46px;padding:12px 14px;border:1px solid #E1E6EE;border-radius:12px;background:#F7F9FC;color:#14245F;outline:none;font-size:14px;line-height:1.4}.field:focus{border-color:#14245F;box-shadow:0 0 0 3px rgba(20,36,95,.08)}.field.pl-10{padding-left:42px}.icon{position:absolute;left:12px;top:0;bottom:0;margin:auto;width:16px;height:16px;color:#8A95A7;pointer-events:none}'}</style>
    </div>
  );
};
