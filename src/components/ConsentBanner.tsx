import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, Settings, Info } from 'lucide-react';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState({
    functional: true,
    orders: true,
    blog: true
  });

  useEffect(() => {
    const consentSet = localStorage.getItem('crm_dsgvo_consent_v1');
    if (!consentSet) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('crm_dsgvo_consent_v1', JSON.stringify({
      functional: true,
      orders: true,
      blog: true,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('crm_dsgvo_consent_v1', JSON.stringify({
      ...consents,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-5 z-100 flex flex-col space-y-4 animate-fade-in font-sans">
      <div className="flex gap-3 items-start select-none">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-slate-100 tracking-tight">Privatsphäre & DSGVO-Datenschutz</h4>
          <p className="text-[10px] text-slate-400 leading-normal mt-1 text-justify">
            Dieses Portal speichert Funktionszustände (z.B. Logins, aktive Themen) in lokalen Speichermedien auf Ihrem Endgerät, um Funktionalität und bestmögliche Datensicherheit zu gewähren.
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-2 border-t border-slate-800 pt-3 text-[10px] select-none text-slate-350">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-semibold">
              <input 
                type="checkbox" 
                checked={consents.functional} 
                disabled 
                className="rounded-xs text-indigo-500 bg-slate-950 border-slate-800"
              />
              <span>Funktionale Cookies (Erforderlich)</span>
            </label>
            <span className="text-slate-500 text-[9px] font-mono">Immer Aktiv</span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input 
                type="checkbox" 
                checked={consents.orders} 
                onChange={(e) => setConsents({...consents, orders: e.target.checked})}
                className="rounded-xs text-indigo-500 bg-slate-950 border-slate-800"
              />
              <span>Bestellungs- & Shopdaten</span>
            </label>
            <span className="text-slate-500 text-[9px]">Warenkorb & ERP</span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-semibold cursor-pointer">
              <input 
                type="checkbox" 
                checked={consents.blog} 
                onChange={(e) => setConsents({...consents, blog: e.target.checked})}
                className="rounded-xs text-indigo-500 bg-slate-950 border-slate-800"
              />
              <span>Kommentar-Verarbeitung</span>
            </label>
            <span className="text-slate-500 text-[9px]">DSGVO Blog</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        {!showDetails ? (
          <button
            onClick={() => setShowDetails(true)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-transparent text-[10px] font-bold text-slate-400 hover:text-white transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <Settings className="h-3 w-3" /> Konfigurieren
          </button>
        ) : (
          <button
            onClick={handleSavePreferences}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-850 hover:bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            Auswahl speichern
          </button>
        )}

        <button
          onClick={handleAcceptAll}
          className="flex-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-white transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:shadow"
        >
          <Check className="h-3.5 w-3.5" /> Alle akzeptieren
        </button>
      </div>
    </div>
  );
}
