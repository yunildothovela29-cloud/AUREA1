import React, { FormEvent, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Loader2, Mail, MessageCircle, Phone, User } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getVisitWhatsAppUrl } from '../data/config';
import { useProperties } from '../hooks/useProperties';
import { BRAND_CONFIG } from '../data/config';

export const ScheduleVisitPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const selectedProperty = useMemo(() => properties.find((p) => p.id === propertyId || p.slug === propertyId), [properties, propertyId]);

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

    setSaving(true);

    const payload = {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.address,
      clientName: fullName.trim(),
      clientPhone: phone.trim(),
      clientEmail: email.trim(),
      preferredDate: date,
      preferredTime: time,
      message: message.trim(),
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    try {
      const visitRef = await addDoc(collection(db, 'visits'), payload);
      sessionStorage.setItem('2s_latest_booking', JSON.stringify({ ...payload, id: visitRef.id }));

      const whatsappUrl = getVisitWhatsAppUrl({
        clientName: payload.clientName,
        clientPhone: payload.clientPhone,
        clientEmail: payload.clientEmail,
        propertyTitle: payload.propertyTitle,
        propertyId: payload.propertyId,
        preferredDate: payload.preferredDate,
        preferredTime: payload.preferredTime,
      });

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      navigate('/confirmacao');
    } catch (err) {
      console.error(err);
      setError('Não foi possível registar o pedido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F7F9FC]">
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.18em] text-[#D93030] font-bold">Agendamento</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#14245F] mt-2">Marcar visita</h1>
          <p className="text-sm sm:text-base text-[#667085] mt-2">Escolha a casa, preencha os seus dados e indique quando gostaria de a visitar.</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#E1E6EE] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
          <div>
            <label className="label">Propriedade *</label>
            <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="field" disabled={loading}>
              <option value="">Escolha uma propriedade</option>
              {properties.map((property) => <option key={property.id} value={property.id}>{property.title} — {property.priceDisplay}</option>)}
            </select>
            {selectedProperty && <p className="text-xs text-[#667085] mt-2">{selectedProperty.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Nome *</label><div className="relative"><User className="icon" /><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="field pl-10" placeholder="Nome completo" /></div></div>
            <div><label className="label">Telefone *</label><div className="relative"><Phone className="icon" /><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field pl-10" placeholder="+258 ..." /></div></div>
          </div>

          <div><label className="label">Email *</label><div className="relative"><Mail className="icon" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-10" placeholder="seuemail@exemplo.com" /></div></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Data *</label><input type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} className="field" /></div>
            <div><label className="label">Hora *</label><div className="grid grid-cols-3 gap-2">{times.map((slot) => <button key={slot} type="button" onClick={() => setTime(slot)} className={'py-2.5 rounded-xl border text-sm font-semibold ' + (time === slot ? 'bg-[#14245F] text-white border-[#14245F]' : 'bg-[#F7F9FC] text-[#566176] border-[#E1E6EE]')}>{slot}</button>)}</div></div>
          </div>

          <div><label className="label">Mensagem (opcional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} className="field min-h-24" placeholder="Alguma informação que queira acrescentar?" /></div>

          <div className="rounded-2xl bg-[#F5F7FA] border border-[#E1E6EE] p-4 text-sm text-[#566176]">
            Ao clicar em <strong>Marcar visita</strong>, guardamos o pedido no painel da 2S e abrimos o WhatsApp com a mensagem pronta. No WhatsApp, o cliente só precisa de tocar em <strong>Enviar</strong>.
          </div>

          {error && <p className="text-sm text-[#B42318]">{error}</p>}

          <button disabled={saving} className="w-full py-3.5 rounded-xl bg-[#D93030] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#BF2525] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
            {saving ? 'A guardar…' : 'Marcar visita'}
          </button>

          <p className="text-xs text-[#7A8495] text-center">Contacto: {BRAND_CONFIG.phoneDisplay} · {BRAND_CONFIG.email}</p>
        </form>
      </section>

      <style>{'.label{display:block;font-size:13px;font-weight:600;color:#14245F;margin-bottom:7px}.field{width:100%;padding:12px 14px;border:1px solid #E1E6EE;border-radius:12px;background:#F7F9FC;color:#14245F;outline:none;font-size:14px}.field:focus{border-color:#14245F;box-shadow:0 0 0 3px rgba(20,36,95,.08)}.icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#8A95A7;pointer-events:none}'}</style>
    </div>
  );
};
