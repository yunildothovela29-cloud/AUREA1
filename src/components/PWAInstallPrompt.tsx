import React, { useEffect, useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }> };
const DISMISS_KEY = '2simoveis-pwa-dismissed-until';
const VISITS_KEY = '2simoveis-pwa-visits';
const DISMISS_DAYS = 14;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export const PWAInstallPrompt: React.FC = () => {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const dismissedUntil = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedUntil > Date.now()) return;

    const previousVisits = Number(window.localStorage.getItem(VISITS_KEY) || 0);
    window.localStorage.setItem(VISITS_KEY, String(previousVisits + 1));

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      window.setTimeout(() => setVisible(true), 1800);
    };
    const onInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // iOS has no browser install-prompt event; show a brief manual guide after a small delay.
    let iosTimer: number | undefined;
    if (ios && previousVisits < 3) iosTimer = window.setTimeout(() => setVisible(true), 4500);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      if (iosTimer) window.clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
    setVisible(false);
    setIosHelp(false);
  };

  const install = async () => {
    if (!installEvent) {
      setIosHelp(true);
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setVisible(false);
    setInstallEvent(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md" role="dialog" aria-label="Instalar 2Simoveis" aria-live="polite">
      <div className="rounded-2xl border border-[#E1E6EE] bg-white p-4 shadow-[0_16px_50px_rgba(20,36,95,0.18)]">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E1E6EE] bg-[#F7F9FC] text-lg font-black italic text-[#D93030]" aria-hidden="true">2S</div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#14245F]">Tenha a 2Simoveis no seu ecrã inicial</p>
            <p className="mt-1 text-sm leading-relaxed text-[#667085]">Aceda ao catálogo de imóveis mais rapidamente, como numa aplicação.</p>
          </div>
          <button type="button" onClick={dismiss} aria-label="Fechar sugestão de instalação" className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F3F6FB]"><X size={18} /></button>
        </div>
        {iosHelp ? (
          <div className="mt-3 rounded-xl bg-[#F7F9FC] p-3 text-sm leading-relaxed text-[#475467]">
            <p className="font-semibold text-[#14245F]">Instalar no iPhone ou iPad</p>
            <p className="mt-1">1. Abra este site no Safari.</p>
            <p>2. Toque em <Share className="mx-0.5 inline h-4 w-4 align-[-3px]" /> Partilhar.</p>
            <p>3. Escolha “Adicionar ao ecrã principal” e confirme.</p>
          </div>
        ) : null}
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={install} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#14245F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0E1944]">
            {isIOS ? <Smartphone size={17} /> : <Download size={17} />}
            {iosHelp ? 'Ver instruções' : isIOS ? 'Como instalar' : 'Instalar aplicação'}
          </button>
          <button type="button" onClick={dismiss} className="rounded-xl border border-[#E1E6EE] px-4 py-3 text-sm font-medium text-[#475467] hover:bg-[#F7F9FC]">Agora não</button>
        </div>
      </div>
    </div>
  );
};
