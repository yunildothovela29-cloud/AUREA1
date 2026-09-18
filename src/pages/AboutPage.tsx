import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Compass, 
  ShieldCheck, 
  CheckCircle2,
  Award
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export const AboutPage: React.FC = () => {
  const values = [
    {
      title: 'Rigor Arquitectónico',
      desc: 'Não avaliamos apenas a metragem. Estudamos ventilação cruzada, incidência solar, materiais nobres e a durabilidade estrutural de cada edificação.',
    },
    {
      title: 'Discrição Absoluta',
      desc: 'Entendemos que transacções de alto património exigem reserva e privacidade. Operamos com sigilo contratual para proprietários e adquirentes.',
    },
    {
      title: 'Transparência Notarial',
      desc: 'Todas as certidões prediais, DUATs e averbamentos camarários são integralmente validados antes de qualquer sinal ou minuta de compromisso.',
    },
    {
      title: 'Atendimento de Autor',
      desc: 'Sem abordagens invasivas ou intermediários apressados. Cada interlocutor é acompanhado directamente por um consultor sénior de confiança.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Diagnóstico & Escuta',
      desc: 'Compreendemos o estilo de vida, as preferências espaciais, os requisitos familiares e os objectivos financeiros da sua próxima etapa.',
    },
    {
      num: '02',
      title: 'Curadoria Restrita',
      desc: 'Apresentamos uma lista enxuta de propriedades verificadas que realmente dialogam com o seu perfil, poupando o seu tempo e energia.',
    },
    {
      num: '03',
      title: 'Visitas Guiadas Sem Pressa',
      desc: 'Acompanhamos pessoalmente cada visita com um olhar técnico sobre acabamentos, vizinhança, acústica e potencial de personalização.',
    },
    {
      num: '04',
      title: 'Negociação & Apoio Jurídico',
      desc: 'Conduzimos a mediação de valores com elegância e preparamos toda a documentação legal até à formalização final e entrega das chaves.',
    },
  ];

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 text-[#14245F]">
      {/* 1. Header & Brand Story */}
      <section className="max-w-4xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D93030] font-semibold block mb-4">
          História & Identidade
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-[#14245F] font-normal tracking-tight leading-[1.15] mb-8">
          Nascemos da convicção de que cada casa é um manifesto de vida.
        </h1>
        <p className="text-lg sm:text-xl text-[#566176] leading-relaxed tracking-wide">
          A {BRAND_CONFIG.name} começou a desenhar o seu percurso a partir do encontro entre profissionais de arquitectura e consultores patrimoniais em Maputo. Desenvolvemos uma agência focada na qualidade espacial, no respeito pelos clientes e na valorização do património edificado na nossa cidade.
        </p>
      </section>

      {/* 2. Visual Collage with Architecture */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 relative">
          <div className="aspect-16/10 rounded-3xl overflow-hidden shadow-lg border border-[#E1E6EE]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              alt="Arquitectura moderna em Maputo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="p-10 rounded-3xl bg-white border border-[#E1E6EE] shadow-sm space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D93030] font-semibold block">
              A Nossa Missão
            </span>
            <h3 className="font-serif text-3xl text-[#14245F] font-normal">
              Conectar pessoas a lugares de significado duradouro.
            </h3>
            <p className="text-base text-[#566176] leading-relaxed tracking-wide">
              O nosso compromisso diário é elevar o padrão da mediação imobiliária em Moçambique, oferecendo assessoria honesta, curadoria sem artifícios e um atendimento genuinamente humano do primeiro contacto à celebração da escritura.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section: Como Ajudamos */}
      <section className="bg-white rounded-3xl p-10 sm:p-16 lg:p-24 border border-[#E1E6EE] shadow-xs">
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D93030] font-semibold block mb-4">
            Serviços & Soluções
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#14245F] font-normal tracking-tight">
            Como Ajudamos os Nossos Clientes
          </h2>
          <p className="text-base text-[#566176] mt-4 tracking-wide">
            Actuamos em diferentes frentes com a mesma dedicação técnica e humana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#E1E6EE] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] text-[#D93030] flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-normal text-[#14245F]">
              Aquisição Residencial
            </h4>
            <p className="text-sm text-[#667085] leading-relaxed tracking-wide">
              Pesquisa personalizada para compradores nacionais e internacionais que procuram moradias ou apartamentos de excepção nas melhores localizações de Maputo.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#E1E6EE] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] text-[#D93030] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-normal text-[#14245F]">
              Arrendamento Executivo
            </h4>
            <p className="text-sm text-[#667085] leading-relaxed tracking-wide">
              Gestão de arrendamento e apoio a embaixadas, missões internacionais e empresas multinacionais que necessitam de alojamento nobre com segurança comprovada.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#E1E6EE] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] text-[#D93030] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-normal text-[#14245F]">
              Avaliação & Consultoria
            </h4>
            <p className="text-sm text-[#667085] leading-relaxed tracking-wide">
              Pareceres técnicos de valor de mercado, análise de viabilidade para novos projectos residenciais e orientação jurídica sobre património imobiliário.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Valores Fundamentais */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D93030] font-semibold block mb-4">
            Princípios Imutáveis
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#14245F] font-normal tracking-tight">
            Os Valores Que Nos Orientam
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white border border-[#E1E6EE] hover:border-[#D93030]/50 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] flex items-center justify-center text-[#D93030] mb-5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-normal text-[#14245F] mb-3">
                {v.title}
              </h4>
              <p className="text-sm text-[#667085] leading-relaxed tracking-wide">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Processo de Trabalho */}
      <section className="bg-[#14245F] text-[#F7F9FC] rounded-3xl p-12 sm:p-20 lg:p-24 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D8BFA6] font-medium block mb-4">
            Metodologia
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F7F9FC] font-normal tracking-tight">
            O Nosso Processo de Trabalho
          </h2>
          <p className="text-base text-[#D8C9BB] mt-4 tracking-wide">
            Um caminho estruturado e tranquilo para que cada decisão seja tomada com segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((s) => (
            <div key={s.num} className="space-y-4 relative">
              <span className="font-serif text-4xl text-[#E8D4BE] block font-light">
                {s.num}
              </span>
              <h4 className="font-serif text-2xl text-[#F7F9FC] font-normal">
                {s.title}
              </h4>
              <p className="text-sm text-[#D8C9BB] leading-relaxed tracking-wide">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA */}
      <section className="text-center max-w-2xl mx-auto space-y-8 pt-8">
        <h3 className="font-serif text-4xl text-[#14245F] font-normal tracking-tight">
          Deseja conhecer o nosso portfólio em detalhe?
        </h3>
        <p className="text-base text-[#566176] tracking-wide">
          Estamos prontos para recebê-lo no nosso escritório na Polana ou agendar uma conversa inicial por videoconferência ou WhatsApp.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <Link
            to="/agendar"
            className="px-10 py-4 rounded-full bg-[#14245F] text-[#F7F9FC] hover:bg-[#26180E] text-xs uppercase tracking-widest font-semibold transition-all shadow-md"
          >
            Agendar Visita
          </Link>
          <Link
            to="/contactos"
            className="px-10 py-4 rounded-full border border-[#D5C9B8] text-[#14245F] bg-white hover:bg-[#F4F7FB] text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Falar com a Equipa
          </Link>
        </div>
      </section>
    </div>
  );
};
