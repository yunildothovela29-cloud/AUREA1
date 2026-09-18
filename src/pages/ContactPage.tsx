import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Informações Gerais');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Por favor indique o seu nome.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Indique um e-mail válido.';
    if (!phone.trim()) errs.phone = 'Indique um número para contacto.';
    if (!message.trim() || message.length < 10) errs.message = 'A mensagem deve conter pelo menos 10 caracteres.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#14245F]">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D93030] font-semibold block mb-4">
          Canais Directos
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14245F] font-normal tracking-tight mb-6">
          Contacte a {BRAND_CONFIG.name}
        </h1>
        <p className="text-base sm:text-lg text-[#566176] leading-relaxed tracking-wide">
          Tem interesse numa propriedade do nosso catálogo, deseja disponibilizar o seu imóvel para curadoria ou procura aconselhamento de investimento em Maputo? A nossa equipa responderá com discrição e celeridade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Coordinates, WhatsApp and Architectural Visual */}
        <div className="lg:col-span-5 space-y-10">
          {/* Office Information Card */}
          <div className="bg-white rounded-3xl border border-[#E1E6EE] p-10 shadow-sm space-y-8">
            <h3 className="font-serif text-3xl text-[#14245F] font-normal">
              Sede em Maputo
            </h3>

            <div className="space-y-6 text-sm text-[#566176]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D93030] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14245F] block font-medium">Endereço Físico</strong>
                  <span>{BRAND_CONFIG.location.street}</span>
                  <br />
                  <span>{BRAND_CONFIG.location.building}</span>
                  <br />
                  <span className="text-[#667085]">{BRAND_CONFIG.location.neighborhood}, {BRAND_CONFIG.location.city}, {BRAND_CONFIG.location.country}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Phone className="w-5 h-5 text-[#D93030] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14245F] block font-medium">Linhas Telefónicas</strong>
                  <a href={`tel:${BRAND_CONFIG.phone}`} className="hover:text-[#D93030] block transition-colors">
                    Principal: {BRAND_CONFIG.phoneDisplay}
                  </a>
                  <a href={`tel:${BRAND_CONFIG.secondaryPhone}`} className="text-xs text-[#667085] hover:text-[#14245F] block transition-colors">
                    Fixo Corporativo: {BRAND_CONFIG.secondaryPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Mail className="w-5 h-5 text-[#D93030] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14245F] block font-medium">Correspondência Electrónica</strong>
                  <a href={`mailto:${BRAND_CONFIG.email}`} className="hover:text-[#D93030] block transition-colors">
                    {BRAND_CONFIG.email}
                  </a>
                  <a href={`mailto:${BRAND_CONFIG.salesEmail}`} className="text-xs text-[#667085] hover:text-[#14245F] block transition-colors">
                    {BRAND_CONFIG.salesEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-[#D93030] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14245F] block font-medium">Horário de Atendimento</strong>
                  <span>{BRAND_CONFIG.officeHours.weekdays}</span>
                  <br />
                  <span className="text-xs text-[#667085]">{BRAND_CONFIG.officeHours.saturdays}</span>
                  <br />
                  <span className="text-xs text-[#667085]">{BRAND_CONFIG.officeHours.sundays}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-6 border-t border-[#F0EBE1]">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl bg-[#F7F9FC] hover:bg-[#F1F4F8] border border-[#DDE3EE] text-[#14245F] text-[11px] uppercase tracking-widest font-semibold transition-all shadow-sm"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Architecture Office Visual */}
          <div className="rounded-2xl overflow-hidden border border-[#E1E6EE] shadow-sm relative aspect-16/9">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
              alt="Escritório da 2S Imobiliária & Serviços em Maputo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-[#F7F9FC] text-xs font-mono tracking-wider">
                Polana Corporate Center • Maputo
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#E1E6EE] p-10 sm:p-14 shadow-md">
            {submitted ? (
              <div className="text-center py-16 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-[#ECFDF3] text-[#2C6B38] border border-[#C6E2C9] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-3xl text-[#14245F] font-normal">
                  Mensagem enviada com sucesso!
                </h3>
                <p className="text-base text-[#566176] max-w-md mx-auto leading-relaxed tracking-wide">
                  Agradecemos o seu contacto. A nossa equipa de consultores seniores responderá à sua mensagem com brevidade.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-8 py-3.5 rounded-full bg-[#14245F] text-[#F7F9FC] text-xs uppercase tracking-widest font-semibold hover:bg-[#26180E] transition-colors cursor-pointer shadow-sm"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-8">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#D93030] font-semibold block mb-2">
                    Formulário Directo
                  </span>
                  <h3 className="font-serif text-3xl text-[#14245F] font-normal mb-2">
                    Envie-nos uma Mensagem
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1.5">
                      Nome Completo <span className="text-[#D93030]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Seu nome"
                      className={`w-full py-3 px-4 bg-[#F7F9FC] border rounded-xl text-xs sm:text-sm text-[#14245F] focus:outline-hidden focus:border-[#D93030] ${
                        errors.name ? 'border-red-400' : 'border-[#DDE3EE]'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1.5">
                      Telefone / WhatsApp <span className="text-[#D93030]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="+258 84 000 0000"
                      className={`w-full py-3 px-4 bg-[#F7F9FC] border rounded-xl text-xs sm:text-sm text-[#14245F] focus:outline-hidden focus:border-[#D93030] ${
                        errors.phone ? 'border-red-400' : 'border-[#DDE3EE]'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1.5">
                      E-mail <span className="text-[#D93030]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="email@dominio.com"
                      className={`w-full py-3 px-4 bg-[#F7F9FC] border rounded-xl text-xs sm:text-sm text-[#14245F] focus:outline-hidden focus:border-[#D93030] ${
                        errors.email ? 'border-red-400' : 'border-[#DDE3EE]'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1.5">
                      Assunto
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full py-3 px-4 bg-[#F7F9FC] border border-[#DDE3EE] rounded-xl text-xs sm:text-sm text-[#14245F] focus:outline-hidden focus:border-[#D93030] cursor-pointer"
                    >
                      <option value="Informações Gerais">Informações Gerais</option>
                      <option value="Interesse em Comprar">Interesse em Comprar</option>
                      <option value="Interesse em Arrendar">Interesse em Arrendar</option>
                      <option value="Colocar Imóvel em Curadoria">Colocar Imóvel em Curadoria</option>
                      <option value="Outro Assunto">Outro Assunto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1.5">
                    Mensagem <span className="text-[#D93030]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder="Descreva o tipo de imóvel que procura, localização de preferência ou detalhes da sua consulta..."
                    className={`w-full p-4 bg-[#F7F9FC] border rounded-xl text-xs sm:text-sm text-[#14245F] focus:outline-hidden focus:border-[#D93030] resize-none ${
                      errors.message ? 'border-red-400' : 'border-[#DDE3EE]'
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#14245F] hover:bg-[#26180E] text-[#F7F9FC] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A enviar mensagem...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
