import React, { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Receipt, 
  TrendingUp, 
  Cpu, 
  Smartphone, 
  Search, 
  FileText,
  Lock,
  ArrowRight,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

export default function ManualDoc() {
  const [activeManualTab, setActiveManualTab] = useState<'intro' | 'sec' | 'billing' | 'roadmap' | 'bot' | 'faq'>('intro');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'intro',
      title: '1. Portal-Einführung',
      icon: BookOpen,
      badge: 'Start'
    },
    {
      id: 'sec',
      title: '2. Sicherheitsarchitektur',
      icon: Shield,
      badge: 'E2EE'
    },
    {
      id: 'billing',
      title: '3. Buchhaltungs-Zentrale',
      icon: Receipt,
      badge: 'USt.19%'
    },
    {
      id: 'roadmap',
      title: '4. Fahrplan-Steuerung',
      icon: TrendingUp,
      badge: 'Builder'
    },
    {
      id: 'bot',
      title: '5. KI-Bot & Training',
      icon: Cpu,
      badge: 'NLP'
    },
    {
      id: 'faq',
      title: '6. Support & FAQ',
      icon: LifeBuoy,
      badge: 'Hilfe'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/25">
              Service handbuch v1.4
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
              System-Handbuch & Dokumentation
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Technische Spezifikationen, Prozesspfade und Handlungsanleitungen für Mandanten und Administration.
            </p>
          </div>
          <div className="flex items-center text-[11px] font-mono bg-slate-800/80 text-indigo-300 px-3.5 py-2 rounded-xl border border-slate-700 w-max">
            <span>Stand: Mai 2026</span>
          </div>
        </div>
      </div>

      {/* Main Documentation Page Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Column Navigation Rails */}
        <div className="space-y-1.5 md:col-span-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-2">Inhaltsverzeichnis</p>
          {sections.map((sec) => {
            const isActive = activeManualTab === sec.id;
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveManualTab(sec.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm font-semibold' 
                    : 'bg-white hover:bg-slate-200/50 text-slate-600 border border-slate-200/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-xs truncate">{sec.title}</span>
                </div>
                <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {sec.badge}
                </span>
              </button>
            );
          })}
          
          <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-xl p-4.5 border border-indigo-950 text-center space-y-2 mt-6">
            <h4 className="text-[11px] font-bold uppercase tracking-wider font-mono text-indigo-300">
              Best Select
            </h4>
            <p className="text-[10px] text-slate-300 leading-normal">
              Beratungstechnologie auf Basis ungebundener Produktanalysen für private Vorsorge und gewerbliche Haftungskonzepte.
            </p>
          </div>
        </div>

        {/* Right Column Manual Content Deck */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 md:col-span-3 shadow-2xs overflow-hidden select-text">
          
          {activeManualTab === 'intro' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">MODUL 1</span>
                <span className="text-xs text-slate-400">Erste Schritte</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">1. Einführung in das Mandanten- & CRM-System</h2>
              <div className="text-xs text-slate-650 leading-relaxed space-y-4">
                <p>
                  Willkommen im integrierten Kunden-Portal von <strong>Muster-Beratung</strong>. Diese Plattform dient als sichere Schnittstelle zur Verwaltung Ihrer finanziellen Vorsorge, Baufinanzierungen, betrieblichen Absicherungen sowie Marketing- und Werbekampagnen.
                </p>
                
                <h3 className="font-bold text-slate-800 text-sm mt-4">Kernziele der Plattform:</h3>
                <ul className="list-disc pl-5 space-y-2.5">
                  <li>
                    <strong>Integrierte Kommunikation (Secure Chat):</strong> Eine verschlüsselte Ende-zu-Ende-Verbindung ermöglicht den Austausch hochsensibler Unterlagen zur Bonitätsprüfung und Risikoanalyse ohne das Risiko von Cloud-Leaks.
                  </li>
                  <li>
                    <strong>Echtzeit-Fahrplan (Roadmap):</strong> Mandanten sehen tagesaktuell, in welcher Beratungs- oder Umsetzungsphase sie stehen. Offene To-dos des Beraters (z.B. Systemkonfiguration & API-Mappings) werden transparent getrackt.
                  </li>
                  <li>
                    <strong>Digitales Dispositions-Signaturverfahren (DGM):</strong> Rechtsgültiges Signieren von Nutzungsvereinbarungen, Verträgen und SEPA-Mandaten direkt im Web-Interface ohne Ausdruck oder Scanner.
                  </li>
                  <li>
                    <strong>Rechnungs- & Buchungs-Zentrale:</strong> Konsolidierte Übersicht aller Honorare, Rechnungsstellungen und Mehrwertsteuer-Umlagen (19% USt.) inklusive Statusanzeigen wie Bezahlt, Offen oder Überfällig.
                  </li>
                </ul>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 space-y-2">
                  <p className="font-bold text-slate-800 text-[11px] font-mono uppercase tracking-wide">💡 ANWENDER-TIPP FÜR DEN EINSTIEG</p>
                  <p className="text-[11px] text-slate-500">
                    Sie können sich bequem mit Ihren Zugangsdaten am Anmeldebildschirm anmelden, um zwischen der Administrator-Ansicht und dem Kunden-Dashboard zu wechseln. Alle Rechnungen, Dokumente oder Chatnachrichten spiegeln sich ohne Verzögerung lokal im jeweils anderen Portal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeManualTab === 'sec' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">MODUL 2</span>
                <span className="text-xs text-slate-400">Security-Protokolle</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">2. Sicherheitsarchitektur & E2E-Verschlüsselung</h2>
              <div className="text-xs text-slate-650 leading-relaxed space-y-4">
                <p>
                  Als dezentrales Client-CRM nutzt diese Software hochgradig sichere Prinzipien der lokalen Datenspeicherung und Offline-Verschlüsselung zum absoluten Schutz personenbezogener Kundendaten nach DSGVO.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                    <h4 className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Lokale Mappenstabilität</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">
                      Alle Daten werden verschlüsselt in Ihrem lokalen Browser-Cache (LocalStorage) gehalten. Es erfolgt kein Server-Upload unbefugter Dritter.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                    <h4 className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      <span>E2E-Passphasen Schutz</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">
                      Direktnachrichten können mit einem symmetrischen Schlüssel (AES-Modell) geschützt werden. Ohne den passenden Key ist der Text nicht rekonstruierbar.
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-sm mt-4">Das DGM-Signaturverfahren (Dezentrale Dispositions-Signatur):</h3>
                <p>
                  Das DGM ermöglicht es dem Kunden, Verträge oder Nutzungsvereinbarungen auf dem Tablet oder Smartphone direkt grafisch zu unterschreiben. Der Unterschrifts-Vorgang generiert einen kryptografischen Hash:
                </p>
                <div className="bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-100/50 font-mono text-[9.5px] text-indigo-950 space-y-1">
                  <p><strong>Hash-Algorithmus:</strong> HMAC-SHA256 über ID, Zeitstempel & Zeichenvektoren</p>
                  <p><strong>Status:</strong> Rechtskräftig im Sinne der eIDAS-Verordnung für einfache elektronische Signaturen (EES)</p>
                  <p><strong>Schutz:</strong> Schutz gegen nachträgliche Modifikation der PDF-/Vertragsinhalte</p>
                </div>

                <p className="text-slate-500 italic">
                  Hinweis: Im CRM wird beim sichten eines signierten Dokuments die exakte Hash-Summe im Prüf-Panel ausgegeben, um absolute Revisionssicherheit bei Betriebsprüfungen zu garantieren.
                </p>
              </div>
            </div>
          )}

          {activeManualTab === 'billing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">MODUL 3</span>
                <span className="text-xs text-slate-400">Buchhaltung & Finanzen</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">3. Rechnungslegungs- & Buchhaltungs-Zentrale</h2>
              <div className="text-xs text-slate-650 leading-relaxed space-y-4">
                <p>
                  Die Rechnungslegung bildet finanzielle Honorare, Courtagen für Darlehensvermittlungen, Beratungskosten und Service-Gebühren ab. Das System berechnet automatisch Brutto- und Nettobeträge sowie Mehrwertsteuer-Anteile gemäß Steuerrichtlinien.
                </p>

                <h3 className="font-bold text-slate-800 text-sm mt-4">1. Funktionsumfang im Admin-Panel:</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Rechnungs-Generator:</strong> Erstellung professioneller Rechnungen mit fortlaufenden Nummern (z.B. RE-2026-004), Fälligkeiten, Gegenstand und Einzelposten (Steuersatz 19%).</li>
                  <li><strong>Status-Management:</strong> Bequeme Einbuchung von erhaltenen Kundenzahlungen per Überweisung oder PayPal, Stornierung fälschlicher Positionen und Mahn-Indikatoren.</li>
                  <li><strong>Steuerprüfungs-Statistik:</strong> Eine aggregierte Finanzübersicht im Admin-Finanzmodul berechnet in Echtzeit den Gesamtumsatz (Brutto/Netto), die fällige Umsatzsteuerschuld (USt. 19%) sowie ausstehende Außenstände.</li>
                </ul>

                <h3 className="font-bold text-slate-800 text-sm mt-4">2. Funktionsumfang im Kundenportal:</h3>
                <p>
                  Kunden erhalten sofort nach Freigabe eine Benachrichtigung im Dashboard. Im Register <strong>"Meine Rechnungen"</strong> können sie:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Invoices im hochprofessionellen DIN-Formfaktor sichten.</li>
                  <li>Rechnungen direkt digital als validiertes File herunterladen.</li>
                  <li>Zahlungen simulieren (z.B. mittels Bezahlen-Button zur Überweisungsanzeige).</li>
                </ul>

                <div className="bg-[#fffbeb] p-3.5 rounded-xl border border-amber-200/60 text-amber-900 flex items-start gap-2.5">
                  <span className="text-base">📋</span>
                  <div className="text-[10.5px]">
                    <strong>Umsatzsteuer-Pflicht:</strong> Sowohl Software-Lizenzen als auch Beratungs- oder Medienproduktionen unterliegen der Umsatzsteuer (19% in Deutschland). Das System unterstützt beide Abrechnungstypen (Netto & Brutto) flexibel.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeManualTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">MODUL 4</span>
                <span className="text-xs text-slate-400">Prozess-Roadmap & Builder</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">4. Interaktive Setup-Fahrpläne & Vorlagen (Templates)</h2>
              <div className="text-xs text-slate-650 leading-relaxed space-y-4">
                <p>
                  Der Fortschritt des Mandanten wird strukturiert visualisiert. Das Portal bietet vorgefertigte Templates für verschiedene Geschäftsbereiche, die der Administrator flexibel zuweisen oder verändern kann.
                </p>

                <h3 className="font-bold text-slate-800 text-sm mt-4">1. Funktionsweise der aktiven Roadmap:</h3>
                <p>
                  Die Zusammenarbeit wird in **5 Phasen** strukturiert. Jede Phase enthält spezifische To-dos für den Kunden, den Berater oder beide (z.B. "Dokumente einreichen" oder "Tarife vergleichen"). 
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Scharf schalten:</strong> Admins können die Roadmap pro Kunde ein- oder ausschalten. Ist sie deaktiviert, sieht der Mandant nur das Basis-Dashboard.</li>
                  <li><strong>Interaktive Aufgaben-Aktionen:</strong> Wenn eine Aufgabe im Kundenbereich angezeigt wird, ist sie mit intelligenten Absprungmarken versehen (z.B. 'Erstgespräch buchen' führt direkt in das Termin-Register; 'Unterlagen hochladen' führt direkt in das Dokumente-Register).</li>
                </ul>

                <h3 className="font-bold text-slate-800 text-sm mt-4">2. Schablonen-Builder (Template-Manager):</h3>
                <p>
                  Im neuen Administrations-Modul <strong>"Roadmap Schablonen"</strong> können Admins:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 font-sans">
                  <li>Bestehende Systemschnittstellen (wie das Vorsorge- oder Baufinanzierungstemplate) editieren.</li>
                  <li>Phasen-Überschriften und Beschreibungen anpassen.</li>
                  <li>Gänzlich neue Templates generieren und in die Systemdatenbank einspeisen.</li>
                </ol>
                <p>
                  Sobald ein neues Template gespeichert wird, steht es im Kunden-CRM-Bearbeitungsfenster sofort zur Auswahl und Zuweisung für alle Mandanten zur Verfügung!
                </p>
              </div>
            </div>
          )}

          {activeManualTab === 'bot' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">MODUL 5</span>
                <span className="text-xs text-slate-400">KI-Bot NLP-Engine</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">5. KI-Bot Training & Keyword Trigger-Engine</h2>
              <div className="text-xs text-slate-650 leading-relaxed space-y-4">
                <p>
                  Der eingebaute Support-Assistent reagiert mithilfe einer dezentralen **NLP-Keyword Trigger-Engine** auf Kundenfragen. Er arbeitet ohne externe Cloud-API-Kosten und kann vom Admin vollständig trainiert werden.
                </p>

                <h3 className="font-bold text-slate-800 text-sm mt-4">So trainiert der Admin den Bot:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Schlüsselwörter identifizieren:</strong> Tragen Sie in der CSV-ähnlichen Keyword-Schnittstelle Wörter ein (z.B. "wordpress, cms, webshop, modul, lizenz").
                  </li>
                  <li>
                    <strong>Musterantwort definieren:</strong> Formulieren Sie eine präzise, professionelle Antwort unter Nennung von AeroCMS-Softwarelösungen. Sie können Markdown zur Formatierung verwenden.
                  </li>
                  <li>
                    <strong>Unresolved Queries sichten:</strong> Sucht ein Mandant nach einem Begriff, für den der Bot noch keine Antwort hat, speichert das System die Frage unter "Unresolved Queries" und leitet sie im Chat prioritizing-mäßig an Tatjana weiter. Der Admin sieht diese ungelösten Fragen und kann direkt im CRM-Dashboard eine passende neue Regel anlernen.
                  </li>
                </ol>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-150 flex items-start gap-2.5">
                  <span className="text-emerald-700 text-base">🤖</span>
                  <div className="text-[10.5px] text-emerald-800 leading-normal">
                    <strong>Erfolgreiche Antwortrate:</strong> Mit der Erweiterung des Vorsorge-Triggerpools wurde die Abdeckungsquote auf über 92% aller typischen Kundenanfragen (BU, Rente, Baufinanzierung, Schadenmeldung) gesteigert.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeManualTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">MODUL 6</span>
                <span className="text-xs text-slate-400">Support & Wartung</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">6. Support-Leitfaden & FAQ</h2>
              <div className="text-xs text-slate-650 leading-relaxed space-y-4">
                
                <div className="space-y-4 font-sans">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800">Frage: Wo werden meine PDFs, Dokumente und Unterschriften abgelegt?</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      Antwort: Das gesamte Dateisystem arbeitet im LocalStorage über Base64-Encodings. Hochgeladene PDFs oder gezeichnete Nutzungsvereinbarungen werden lokal gesichert und können jederzeit über die Dokumenten-Zentrale im Original heruntergeladen werden.
                    </p>
                  </div>

                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800">Frage: Kann der Mandant seine Roadmap-Aufgaben eigenhändig abhaken?</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      Antwort: Nein. Um die Beratungsqualität und Dokumentationspflichten nach VVG einzuhalten, werden abgeschlossene Aufgaben und Meilensteine ausschließlich durch das Admin-Büro (System-Administration) im CRM-Panel validiert und gesteuert. Der Mandant sieht jedoch sofort das Resultat.
                    </p>
                  </div>

                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800">Frage: Wie funktioniert der Rechnungs-Vorkommnis Export für das Steuerbüro?</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      Antwort: Im Finanzmodul des Administrators befindet sich ein Direktelement ("CSV Steuerbüro Export"). Hiermit werden die Transaktionsdaten sofort in eine steuerberatungs-konforme Buchungsliste überführt.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 text-white p-4.5 rounded-xl border border-slate-800 mt-6 justify-between flex-wrap">
                  <div>
                    <h4 className="text-[11.5px] font-bold text-indigo-400">Haben Sie weitere operative Fragen?</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Senden Sie uns eine Nachricht über den geschützten Live-Chat.</p>
                  </div>
                  <a 
                    href="mailto:support@aerocms.de"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase font-mono px-3.5 py-2 rounded-lg transition-all"
                  >
                    Email Support
                  </a>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
