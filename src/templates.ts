import { RoadmapSubTask } from './components/CustomerPortal';

export interface RoadmapTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Marketing' | 'Software' | 'Projekt' | 'Enterprise';
  phases: {
    phase: number;
    title: string;
    desc: string;
  }[];
  tasks: RoadmapSubTask[];
}

export const ROADMAP_TEMPLATES: RoadmapTemplate[] = [
  {
    id: 'marketing',
    name: 'Social Media & Videomarketing',
    description: 'Effektive Mitarbeitergewinnung und Kundenakquise über Kurzvideos und Werbemittel.',
    icon: 'Video',
    category: 'Marketing',
    phases: [
      { phase: 1, title: 'Erstgespräch', desc: 'Briefing & Analyse' },
      { phase: 2, title: 'Bedarfsprüfung', desc: 'Audit & Datenanalyse' },
      { phase: 3, title: 'Strategiekonzepte', desc: 'Entwurf & Freigaben' },
      { phase: 4, title: 'Umsetzung', desc: 'Schnitt & Kampagnen' },
      { phase: 5, title: 'Erfolgsanalyse', desc: 'Auswertung & Plan' }
    ],
    tasks: [
      { id: 'm1t1', phase: 1, title: 'Kostenfreie Erst-Beratung & Bedarfsanalyse', desc: 'Briefing-Termin mit Ihrem Berater zur Klärung der strategischen Ausrichtung und Meilensteine.', role: 'Beide', actionLabel: 'Erstgespräch buchen', actionType: 'appointment' },
      { id: 'm1t2', phase: 1, title: 'Beratungs-Rahmenvertrag digital unterzeichnen', desc: 'Rechtliche Absicherung der Zusammenarbeit im Mandantenportal sichten und digital signieren.', role: 'Kunde', actionLabel: 'Zu den Verträgen', actionType: 'upload' },
      { id: 'm1t3', phase: 1, title: 'Onboarding-Fragebogen ausfüllen', desc: 'Einreichen aller Unternehmensziele und Fokus-KPIs für die Analysephase.', role: 'Kunde', actionLabel: 'Nachricht an Berater senden', actionType: 'chat' },
      
      { id: 'm2t1', phase: 2, title: 'Upload relevanter Geschäfts- & Werbedaten', desc: 'Sicheres Bereitstellen von aktuellen Reportings, Werbe-Budgets und Analytics-Zugängen.', role: 'Kunde', actionLabel: 'Dokument hochladen', actionType: 'upload' },
      { id: 'm2t2', phase: 2, title: 'Detaillierter Video- & Social-Media Audit', desc: 'Professionelle Analyse Ihres bisherigen Online-Auftritts und Contents durch unsere Experten.', role: 'Berater' },
      { id: 'm2t3', phase: 2, title: 'Identifikation primärer Optimierungshebel', desc: 'Schnittmuster- & Zielgruppen-Checkup zur Vorbereitung der finalen Konzepte.', role: 'Berater' },
      
      { id: 'm3t1', phase: 3, title: 'Ausarbeitung der maßgeschneiderten Content-Strategie', desc: 'Erstellung des individuellen Redaktionsplans und der Skript-Vorlagen.', role: 'Berater' },
      { id: 'm3t2', phase: 3, title: 'Entwurfs-Abstimmungstermin (Medien-Layout)', desc: 'Virtueller Workshop zur gemeinsamen Feinabstimmung der Strategie.', role: 'Beide', actionLabel: 'Termin vereinbaren', actionType: 'appointment' },
      { id: 'm3t3', phase: 3, title: 'Freigabe des Budget- und Ressourcenplans', desc: 'Finale Bestätigung der Drehtage, Ad-Spendings und Freigabeschritte.', role: 'Kunde', actionLabel: 'Freigabe bestätigen', actionType: 'chat' },
      
      { id: 'm4t1', phase: 4, title: 'Einreichung des Content-Rohmaterials', desc: 'Upload der Rohvideos und Bilddateien direkt über die gesicherte Datei-Schnittstelle im Portal.', role: 'Kunde', actionLabel: 'Videomaterial hochladen', actionType: 'upload' },
      { id: 'm4t2', phase: 4, title: 'Schnitt & Postproduktion der Social-Media Ads', desc: 'Postproduktion (Untertitel, Sound-Design, Color Grading) durch betreuende Experten.', role: 'Berater' },
      { id: 'm4t3', phase: 4, title: 'Kampagnen-Launch & Einpflegen in Ad-Kanäle', desc: 'Start der ersten organischen und bezahlten Marketing-Kanäle.', role: 'Beide' },
      
      { id: 'm5t1', phase: 5, title: 'Performance- & KPI-Dashboard Auswertung', desc: 'Vergleich der real erzielten Ergebnisse und Conversion-Rates mit den Onboarding-Zielen.', role: 'Beide' },
      { id: 'm5t2', phase: 5, title: 'Abschlussgespräch & Retainer-Planung', desc: 'Evaluation der Erfolge und Vereinbarung von Folgemodellen zur dauerhaften Skalierung.', role: 'Beide', actionLabel: 'Abschlusstermin buchen', actionType: 'appointment' },
      { id: 'm5t3', phase: 5, title: 'Übergabe aller finalen Projekt-Assets', desc: 'Bereitstellung hochauflösender Masterfiles und Kampagnenberichte zur Archivierung.', role: 'Berater' }
    ]
  },
  {
    id: 'vorsorge',
    name: 'E-Commerce & Shop-Setup',
    description: 'Umfassende Einrichtung Ihres Onlinestores, Warenwirtschaft, Zahlungsschnittstellen und Produktlagerregalen.',
    icon: 'ShoppingBag',
    category: 'Software',
    phases: [
      { phase: 1, title: 'Bedarfsgespräch', desc: 'Sortiment & Zielmarkt' },
      { phase: 2, title: 'Architekturcheck', desc: 'Schnittstellen & ERP-Audit' },
      { phase: 3, title: 'Optimierung', desc: 'Designs & Zahlungsabwicklungen' },
      { phase: 4, title: 'Einrichtung', desc: 'Live-Tests & Storefront Launch' },
      { phase: 5, title: 'Jahresservice', desc: 'Regelmäßiger Review & Updates' }
    ],
    tasks: [
      { id: 'v1t1', phase: 1, title: 'Persönlicher Erst-Checkup im Büro oder Videochat', desc: 'Besprechung der Produkt- und Marketingziele mit Ihrem Berater.', role: 'Beide', actionLabel: 'Erstgespräch buchen', actionType: 'appointment' },
      { id: 'v1t2', phase: 1, title: 'Datenschutz- & IT-Dienstleistungsvereinbarung zeichnen', desc: 'Rechtliche Legitimation zur API-Konfiguration und Shop-Zusammenarbeit.', role: 'Kunde', actionLabel: 'Vereinbarung unterzeichnen', actionType: 'upload' },
      { id: 'v1t3', phase: 1, title: 'Eingabe der Basis-Produktkategorien', desc: 'Angabe zu primären Produkten für exakte Systemberechnungen.', role: 'Kunde', actionLabel: 'Daten mitteilen', actionType: 'chat' },
      
      { id: 'v2t1', phase: 2, title: 'Upload bestehender Produktdaten & Preislisten', desc: 'Laden Sie Ihre aktuellen Inventarlisten als CSV/Excel oder PDF-Beleg hoch.', role: 'Kunde', actionLabel: 'Produkte hochladen', actionType: 'upload' },
      { id: 'v2t2', phase: 2, title: 'Detaillierter Systemvergleich & ERP-Prüfung', desc: 'Analyse bestehender Warenflüsse und Ermittlung von Automationspotenzialen.', role: 'Berater' },
      { id: 'v2t3', phase: 2, title: 'Beantragung Sandbox-Zugänge für Zahlungsanbieter', desc: 'Kopplung mit Stripe, PayPal und Klarna zur Absicherung der Zahlungsströme.', role: 'Berater' },
      
      { id: 'v3t1', phase: 3, title: 'Erstellung des maßgeschneiderten Shop-Layouts', desc: 'Ausarbeitung vorteilhafter Alternativen im Designsystem mit UI/UX-Vorteil.', role: 'Berater' },
      { id: 'v3t2', phase: 3, title: 'Gemeinsame Konzeptvorstellung & Templateauswahl', desc: 'Interaktive Videokonferenz zur Besprechung des optimalen Frontends.', role: 'Beide', actionLabel: 'Planungstermin buchen', actionType: 'appointment' },
      { id: 'v3t3', phase: 3, title: 'Bestätigung des gewünschten Designs', desc: 'Freigabe der ausgewählten Shop-Struktur zur schnellen Live-Setzung.', role: 'Kunde', actionLabel: 'Layouts bestätigen', actionType: 'chat' },
      
      { id: 'v4t1', phase: 4, title: 'Erstellung und Einpflegen der System-Datenbaken', desc: 'Vollständige Vorbereitung aller Datenbänke durch unsere Entwickler.', role: 'Berater' },
      { id: 'v4t2', phase: 4, title: 'Unterschrift der finalen Shop-Zustimmungen', desc: 'Einfaches und schnelles Unterzeichnen im Mandantenportal mittels digitaler Signatur.', role: 'Kunde', actionLabel: 'Zustimmung unterzeichnen', actionType: 'upload' },
      { id: 'v4t3', phase: 4, title: 'Begleitung der finalen Freigabe in den Stores', desc: 'Koordination der Veröffentlichung bis zum ersten echten Bezahlvorgang.', role: 'Berater' },
      
      { id: 'v5t1', phase: 5, title: 'Zustellung der Systemdokumentationen', desc: 'Bereitstellung aller Benutzerhandbücher in Ihrem digitalen Dokumentenbereich.', role: 'Berater' },
      { id: 'v5t2', phase: 5, title: 'Einpflegen der Produktregale im ERP', desc: 'Einrichtung Ihres mobilen Zugangs für schnelle Bestandsprüfungen und Bestell-Verläufe per Smartphone.', role: 'Beide' },
      { id: 'v5t3', phase: 5, title: 'Terminierung des jährlichen System-Reviews', desc: 'Automatische Wiedervorlage zur Anpassung an veränderte Marktgegebenheiten.', role: 'Beide', actionLabel: 'Review-Termin vereinbaren', actionType: 'appointment' }
    ]
  },
  {
    id: 'gewerbe',
    name: 'CRM & Support Integration',
    description: 'Risikoanalyse und Deckungsprüfungen für Kundendaten, Online-Support, Ticketsysteme und Bots.',
    icon: 'Cpu',
    category: 'Projekt',
    phases: [
      { phase: 1, title: 'Systemanalyse', desc: 'Zielgruppe & Ticketvolumen' },
      { phase: 2, title: 'Support-Audit', desc: 'Bewertung bestehender Kommunikationskanäle' },
      { phase: 3, title: 'Projektierung', desc: 'Systemkonfiguration und FAQ-Setup' },
      { phase: 4, title: 'Schnittstellen', desc: 'Live-Schaltung der Chatkanäle' },
      { phase: 5, title: 'Optimierung', desc: 'KI-Lernkurven & Erfolgsberichte' }
    ],
    tasks: [
      { id: 'g1t1', phase: 1, title: 'Projekt-Erstgespräch & Partnerprofil', desc: 'Gemeinsame Erfassung von Supportvolumen, Reaktionszeiten und CRM-Strukturen.', role: 'Beide', actionLabel: 'Planungs-Termin buchen', actionType: 'appointment' },
      { id: 'g1t2', phase: 1, title: 'Rahmenvertrag & Vollmacht für CMS-Schnittstellen', desc: 'Grundvoraussetzung für die Systemprüfung und Zusammenarbeit unterzeichnen.', role: 'Kunde', actionLabel: 'Vertrag digital signieren', actionType: 'upload' },
      
      { id: 'g2t1', phase: 2, title: 'Upload bestehender FAQs & Support-Leitfäden', desc: 'Bereitstellung aller bisherigen Hilfedokumente zur KI-Training und Bot-Integration.', role: 'Kunde', actionLabel: 'Hilfebelege hochladen', actionType: 'upload' },
      { id: 'g2t2', phase: 2, title: 'Datensicherheits- & DSGVO-Evaluierung', desc: 'Digitale Identifikation von Schwachstellen in Ihrer datenbezogenen Infrastruktur.', role: 'Berater' },
      { id: 'g2t3', phase: 2, title: 'Erstellung des umfassenden System-Protokolls', desc: 'Zusammenstellung aller Integrationsschritte nach gesetzlichen Vorgaben.', role: 'Berater' },
      
      { id: 'g3t1', phase: 3, title: 'Konfiguration des FAQ-Bots in Echtzeit', desc: 'Einpflegen spezifischer Frage-Antwort-Regeln und Intent-Erkennung im KI-System.', role: 'Berater' },
      { id: 'g3t2', phase: 3, title: 'Vorstellung der Zwischenergebnisse', desc: 'Support-Workshop zur Präsentation des fertigen Chatbots und Trainings-Umfangs.', role: 'Beide', actionLabel: 'Präsentation buchen', actionType: 'appointment' },
      { id: 'g3t3', phase: 3, title: 'Entscheidung & Freigabe Supportmodell', desc: 'Kundenfreigabe für das konfigurierte Kommunikationsportal.', role: 'Kunde', actionLabel: 'Freigabe im Chat senden', actionType: 'chat' },
      
      { id: 'g4t1', phase: 4, title: 'Ausstellung der API-Schlüssel & Token', desc: 'Sofortige vorläufige Systembereitstellung für Ihren Live-Betrieb.', role: 'Berater' },
      { id: 'g4t2', phase: 4, title: 'Digitale Freigabe der Schnittstellen-Protokolle', desc: 'Einfacher Online-Abschluss direkt im geschlossenen CRM-Backend.', role: 'Kunde', actionLabel: 'Dokumente signieren', actionType: 'upload' },
      { id: 'g4t3', phase: 4, title: 'Zustellung der Produkt-Lizenzen', desc: 'Rechtssichere Übermittlung aller Lizenzurkunden auf der Plattform.', role: 'Berater' },
      
      { id: 'g5t1', phase: 5, title: 'Einweisung für das Redaktionspersonal / Admin', desc: 'Schulung zu Vorgehensweisen bei komplexen ungelösten Ticketanfragen.', role: 'Beide' },
      { id: 'g5t2', phase: 5, title: 'Implementierung eines Multi-Channel Workflows', desc: 'Verbindung mit Social-Media-Kanälen zur weiteren Absatzstärkung.', role: 'Beide', actionLabel: 'Beratungsgespräch Workflow', actionType: 'appointment' },
      { id: 'g5t3', phase: 5, title: 'Regelmäßiges Bot-Update zur Reichweitenstärkung', desc: 'Feinabstimmung der Trigger-Keywords an reale Kundengespräche zur Vermeidung fehlerhafter Antworten.', role: 'Beide' }
    ]
  },
  {
    id: 'finance',
    name: 'Enterprise System-Migration',
    description: 'Strukturierte Begleitung von Datenbanksicherungen, API-Integrationen und Systemschulungen.',
    icon: 'Layers',
    category: 'Enterprise',
    phases: [
      { phase: 1, title: 'Bedarfsgespräch', desc: 'Migrationstiefe & Alt-Systeme' },
      { phase: 2, title: 'Unterlagencheck', desc: 'Datenschemata & ERP-Schnittstellen' },
      { phase: 3, title: 'Live-Spiegelung', desc: 'Prüfung von Datenflüssen im Testlauf' },
      { phase: 4, title: 'System-Launch', desc: 'Livegang & Qualitätssicherung' },
      { phase: 5, title: 'Supportpaket', desc: 'Betriebsüberwachung & Updates' }
    ],
    tasks: [
      { id: 'f1t1', phase: 1, title: 'Unverbindliche Rahmenermittlung & Erstgespräch', desc: 'Ermittlung des maximalen Migrationsaufwands basierend auf Ihren bestehenden Datensilos.', role: 'Beide', actionLabel: 'Termin vereinbaren', actionType: 'appointment' },
      { id: 'f1t2', phase: 1, title: 'Unterzeichnung der Vertraulichkeits-Erklärung (NDA)', desc: 'Sichere Freigabe zur Einsicht in die operativen Alt-Datenbänke.', role: 'Kunde', actionLabel: 'NDA unterzeichnen', actionType: 'upload' },
      
      { id: 'f2t1', phase: 2, title: 'Einreichung relevanter Datendateien & Exporte', desc: 'Upload der letzten 3 Datenbankbackups und Tabellenstrukturen.', role: 'Kunde', actionLabel: 'Datenbackups hochladen', actionType: 'upload' },
      { id: 'f2t2', phase: 2, title: 'Schema-Mapping & API-Prüfung', desc: 'Erstellung einer systemunabhängigen Mapping-Struktur.', role: 'Berater' },
      { id: 'f2t3', phase: 2, title: 'Prüfung staatlicher Innovationsförderungen', desc: 'Identifikation von zinsgünstigen Förderprogrammen für Digitalisierungsprojekte.', role: 'Berater' },
      
      { id: 'f3t1', phase: 3, title: 'Migrationstestlauf in Sandbox-Umgebung', desc: 'Spiegelung der Daten bei über 40 Testkonten zur Feststellung von Redundanzen.', role: 'Berater' },
      { id: 'f3t2', phase: 3, title: 'Gemeinsamer Migrations-Workshop', desc: 'Vorstellung der Migrationsergebnisse und Erklärung der neuen Navigationsmenüs.', role: 'Beide', actionLabel: 'Workshop buchen', actionType: 'appointment' },
      { id: 'f3t3', phase: 3, title: 'Freigabe der migrationskritischen Kernprozesse', desc: 'Schnittstellengenehmigung im Chat für die endgültige Live-Spiegelung.', role: 'Kunde', actionLabel: 'Freigabe erteilen', actionType: 'chat' },
      
      { id: 'f4t1', phase: 4, title: 'Livegang & Datenbankschlüssel-Integration', desc: 'Direkte Datenübertragung in die neue CMS Enterprise-Suite.', role: 'Berater' },
      { id: 'f4t2', phase: 4, title: 'Erhalt der System-Abschlussprotokolle', desc: 'Erfolgreiche Live-Meldung vorlegen und Bereitstellung aller Berichte.', role: 'Berater' },
      { id: 'f4t3', phase: 4, title: 'Sichtung der Live-Einträge & Schulung', desc: 'Digitales Sichten der neuen Admin-Dashboardkonten und Funktionen.', role: 'Kunde', actionLabel: 'Konten prüfen', actionType: 'upload' },
      
      { id: 'f5t1', phase: 5, title: 'Bereitstellung der Administrationsrechte', desc: 'Übergabe der Masterschlüssel an Ihre Systemverantwortlichen.', role: 'Beide' },
      { id: 'f5t2', phase: 5, title: 'Abruf der Support-Tickets im Backend', desc: 'Prüfung eingehender Chat-Tickets zur Qualitätssicherung nach dem Relaunch.', role: 'Beide', actionLabel: 'Tickets prüfen', actionType: 'upload' },
      { id: 'f5t3', phase: 5, title: 'Jährliches System- & Update-Abonnement', desc: 'Laufender Wartungsvertrag und Support-Paket zur permanenten Sicherstellung der Portaldienste.', role: 'Beide' }
    ]
  }
];
