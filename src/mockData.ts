import { CRMData } from './types';

export const INITIAL_MOCK_DATA: CRMData = {
  customers: [
    {
      id: "cust-max",
      name: "Max Mustermann",
      company: "Muster GmbH",
      email: "max@muster.de",
      phone: "+49 123 456789",
      address: "Musterstraße 1, 80331 München",
      status: "Stammkunde",
      username: "max.muster",
      passwordHash: "fc46231ef64c5be7f0580970877990159f8a379373bd33e46c7ad7208d2b2707", // SHA256 of 'kunde123'
      notes: "Stammkunde seit 2024. Sehr interessiert an neuen KI-Consulting-Formaten und monatlichen Videoberichten.",
      createdAt: "2026-01-10T12:00:00.000Z",
      activePhase: 3
    },
    {
      id: "cust-anna",
      name: "Anna Schmidt",
      company: "Schmidt AG",
      email: "anna@schmidt.de",
      phone: "+49 987 654321",
      address: "Hauptstraße 15, 80335 München",
      status: "Neukunde",
      username: "anna.schmidt",
      passwordHash: "fc46231ef64c5be7f0580970877990159f8a379373bd33e46c7ad7208d2b2707", // SHA256 of 'kunde123'
      notes: "Neuzugang aus Empfehlung. Sucht administrative Beratung für Videomarketing-Verträge.",
      createdAt: "2026-05-15T09:30:00.000Z",
      activePhase: 1
    },
    {
      id: "cust-tom",
      name: "Tom Weber",
      company: "Weber Solutions",
      email: "tom@weber.de",
      phone: "+49 555 123456",
      address: "Bahnhofsplatz 5, 80335 München",
      status: "Aktiv",
      username: "tom.weber",
      passwordHash: "fc46231ef64c5be7f0580970877990159f8a379373bd33e46c7ad7208d2b2707", // SHA256 of 'kunde123'
      notes: "Technologiepartner und Beratungskunde. Reicht monatlich Berichte und Verträge ein.",
      createdAt: "2026-03-22T14:45:00.000Z",
      activePhase: 4
    }
  ],
  files: [
    {
      id: "file-1",
      customerId: "cust-max",
      customerName: "Max Mustermann",
      name: "Kooperationsvertrag_2026_MusterGmbH.pdf",
      type: "application/pdf",
      size: 1048576, // 1 MB
      category: "Vertrag",
      uploadDate: "2026-05-20T10:15:30.000Z",
      status: "Genehmigt",
      adminNote: "Vertrag wurde geprüft und entspricht den Richtlinien. Kopie unterschrieben im Portal hinterlegt."
    },
    {
      id: "file-2",
      customerId: "cust-max",
      customerName: "Max Mustermann",
      name: "Vorstellungsvideo_MusterGmbH_HQ.mp4",
      type: "video/mp4",
      size: 47185920, // 45 MB
      category: "Video",
      uploadDate: "2026-05-24T16:20:00.000Z",
      status: "In Bearbeitung",
      adminNote: "Video-Schnitt-Feedback wird vorbereitet."
    },
    {
      id: "file-3",
      customerId: "cust-tom",
      customerName: "Tom Weber",
      name: "Umsatzbericht_Q1_WeberSolutions.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 154850, // ~150 KB
      category: "Datei",
      uploadDate: "2026-05-28T11:05:00.000Z",
      status: "Eingereicht"
    },
    {
      id: "file-4",
      customerId: "cust-anna",
      customerName: "Anna Schmidt",
      name: "Angebotsentwurf_Marketingkampagne.pdf",
      type: "application/pdf",
      size: 2048576, // 2 MB
      category: "Vertrag",
      uploadDate: "2026-05-29T14:00:00.000Z",
      status: "Eingereicht"
    }
  ],
  messages: [
    {
      id: "msg-1",
      senderId: "admin",
      receiverId: "cust-max",
      content: "Hallo Herr Mustermann, willkommen in Ihrem neuen Kundenportal! Hier können Sie wie besprochen alle Verträge und Projektvideos hochladen.",
      timestamp: "2026-05-20T08:30:00.000Z",
      isRead: true
    },
    {
      id: "msg-2",
      senderId: "cust-max",
      receiverId: "admin",
      content: "Hallo Frau Kraft, das sieht wirklich fantastisch und sehr übersichtlich aus! Ich habe direkt den unterschriebenen Kooperationsvertrag und das neue Vorstellungsvideo hochgeladen.",
      timestamp: "2026-05-20T10:20:00.000Z",
      isRead: true
    },
    {
      id: "msg-3",
      senderId: "admin",
      receiverId: "cust-max",
      content: "Wunderbar! Den Kooperationsvertrag habe ich soeben bereits als genehmigt markiert. Wir prüfen morgen direkt das Vorstellungsvideo und senden Ihnen unser detailliertes Feedback hier im Chat.",
      timestamp: "2026-05-20T11:05:00.000Z",
      isRead: true
    },
    {
      id: "msg-4",
      senderId: "cust-max",
      receiverId: "admin",
      content: "Super, vielen Dank für die extrem schnelle Bearbeitung! Ich freue mich auf die Rückmeldung zum Video.",
      timestamp: "2026-05-20T11:15:00.000Z",
      isRead: true
    },
    {
      id: "msg-5",
      senderId: "cust-tom",
      receiverId: "admin",
      content: "Hallo, ich habe unseren aktuellen Umsatzbericht für Q1 hochgeladen. Könnten wir dazu nächste Woche kurz sprechen?",
      timestamp: "2026-05-28T11:10:00.000Z",
      isRead: false
    }
  ],
  appointments: [
    {
      id: "appt-1",
      title: "Vertrags-Review Muster GmbH",
      date: "2026-06-02",
      time: "10:00",
      description: "Abschlussbesprechung der neuen Kooperationsvereinbarung",
      customerId: "cust-max"
    },
    {
      id: "appt-2",
      title: "Umsatzbericht-Analyse Weber Solutions",
      date: "2026-06-03",
      time: "14:30",
      description: "Gemeinsame Analyse der Q1-Kennzahlen im Online-Meeting",
      customerId: "cust-tom"
    },
    {
      id: "appt-3",
      title: "Onboarding-Gespräch Schmidt AG",
      date: "2026-06-05",
      time: "09:00",
      description: "Erstes Onboarding und Bedarfsanalyse für Marketingverträge",
      customerId: "cust-anna"
    }
  ],
  botRules: [
    {
      id: "rule-preise",
      triggerKeywords: ["preis", "preise", "kosten", "honorar", "angebot", "günstig", "teuer", "geld", "zahlen", "lizenz", "vertrag"],
      answer: "Unsere CMS Enterprise Consulting Beratung erfolgt in transparenter Absprache. Bei reinen System-Integrations, Custom-Modulen, und aufwendigen Social-Media / Video-Marketingprojekten vereinbaren wir im Voraus ein faires Festhonorar auf Stunden- oder Projektsatzbasis. Ihr Erstgespräch (Phase 1) zur Live-Demonstration ist in jedem Fall 100% kostenfrei!",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-videos",
      triggerKeywords: ["video", "videos", "schnitt", "rendering", "sound", "mp4", "bearbeitung", "cutter", "marketing", "social", "instagram", "tiktok"],
      answer: "Für Ihr Social-Media Recruiting oder die Kundenakquise bearbeiten unsere Experten Ihre eingereichten Rohvideos (z.B. Kurzclips oder Firmenporträts). Laden Sie Ihr Material einfach im Register 'Dokumente' hoch. Unsere Cutter kümmern sich um Audio-Abmischung, professionelle Untertitel, Color Grading und Effekte. Das fertige Ergebnis stellen wir Ihnen im Portal zur Freigabe bereit.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-dgm",
      triggerKeywords: ["vertrag", "unterschrift", "unterschreiben", "signieren", "signatur", "dgm", "rechtskräftig", "freigabe", "vollmacht", "onboarding"],
      answer: "Über unser integriertes DGM (Dezentrales Dispositions-Signaturverfahren) können Sie Verträge, Onboarding-Protokolle oder Angebote absolut rechtssicher und digital im Portal signieren. Klicken Sie neben dem Dokument auf 'Signieren', verifizieren Sie Ihre Daten per SMS-/E-Mail-Pin und zeichnen Sie das Dokument digital ab. Das spart lästige Postwege und beschleunigt Ihren Systemstart!",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-termine",
      triggerKeywords: ["termin", "kalender", "meeting", "treffen", "buchung", "buchen", "uhrzeit", "datum", "online", "videochat", "beratung"],
      answer: "Einen persönlichen Beratungstermin oder eine Live-Demonstration buchen Sie bequem im Bereich 'Termine & Planung'. Wählen Sie Ihr Anliegen (z.B. Onboarding-Checkup, Modul-Konfiguration oder System-Review), suchen Sie sich einen freien Slot im Kalender aus, und der Termin wird automatisch für Sie reserviert und nach Freigabe im Dashboard angezeigt.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-roadmap",
      triggerKeywords: ["phase", "fortschritt", "roadmap", "schritt", "prozess", "status", "abgeschlossen", "meilenstein"],
      answer: "Ihre interaktive Projekt-Roadmap gliedert sich in 5 strukturierte Phasen – von der System-Bedarfsanalyse über das detaillierte Konzept bis zur finalen Umsetzung und laufenden Betreuung. Der Administrator schaltet diese Roadmap individuell für Sie frei, so dass Sie zu jedem Zeitpunkt exakt wissen, welche Aufgaben für Sie anstehen und was unser Serviceteam gerade für Sie erledigt.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-kontakt",
      triggerKeywords: ["kontakt", "support", "telefon", "email", "mail", "anrufen", "telefonnummer", "erreichbar", "öffnungszeiten", "adresse", "büro"],
      answer: "Sie erreichen das IT- und Beratungsbüro der Kraftwerk-Unternehmensberatung telefonisch von Montag bis Freitag von 08:30 bis 17:30 Uhr unter **+49 1234 567890** oder per E-Mail unter **support@musterdomain.de**. Unser Team berät Kunden bundesweit komplett digital. Für hochsensible Daten nutzen Sie bitte stets den integrierten Chat mit E2E-Verschlüsselung hier im Portal.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-shop",
      triggerKeywords: ["shop", "webshop", "warenwirtschaft", "erp", "artikel", "e-commerce", "bestellung", "lager", "verkauf", "kasse"],
      answer: "Mit unserem E-Commerce-Plugin richten wir Ihnen ein maßgeschneidertes digitales Verkaufsportal ein. Es beinhaltet eine integrierte Warenwirtschaft (ERP) mit Lagerbestandskontrollen, bequeme Zahlungsschnittstellen für Kundencard, PayPal, Klarna oder Stripe und vollautomatisierte Bestellübersichten inklusive DHL/UPS Tracking.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-crm",
      triggerKeywords: ["cms", "kunden", "datenbank", "verwaltung", "nutzer", "mandanten", "rollen", "admin", "passwort"],
      answer: "Das CMS-Zentralmodul ermöglicht Ihnen eine volldigitalisierte Kundenverwaltung. Sie können Profile pflegen, Verträge hinterlegen, Zugriffsrechte granular erteilen, Roadmaps freischalten und die Frontends Ihrer Mandanten live simulieren, um Features wie in einer Produktvorschau zu testen.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-cloud",
      triggerKeywords: ["cloud", "server", "hosting", "backup", "daten", "sicherheit", "dsgvo", "verschlüsselung", "backup", "sichern"],
      answer: "Ihr Enterprise CMS wird in ISO-27001 zertifizierten Hochsicherheitsrechenzentren in Deutschland gehostet. Tägliche automatisierte Backups, modernste Web-Application-Firewalls und vollständige AES-256 E2E-Verschlüsselungen für vertrauliche DMs sichern Ihre Geschäftsgeheimnisse DSGVO-konform zu jeder Sekunde.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-mobile",
      triggerKeywords: ["mobile", "app", "smartphone", "responsive", "pwa", "handy", "tablet", "darstellung"],
      answer: "Unsere Systemportale sind als modernste Progressive Web App (PWA) programmiert. Sie passen sich flüssig jedem Smartphone und Tablet an, können direkt als Startbildschirm-App ohne App Store installiert werden und bieten somit erstklassigen mobilen Dienstleistungszugriff für Ihre Kunden unterwegs.",
      usagesCount: 0,
      lastEditedBy: "System"
    },
    {
      id: "rule-bugs",
      triggerKeywords: ["bug", "fehler", "problem", "absturz", "hotfix", "patch", "hilfe", "support", "ticket", "geht nicht"],
      answer: "Sollte es im CMS zu unerwarteten Störungen oder fehlerhafter Darstellung kommen, melden Sie dies bitte sofort über den sicheren Admin-Chat oder laden Sie einen Screenshot in Ihrer Dokumentenzentrale hoch. Unser technisches Support-Team behebt kritische Vorfälle in der Regel innerhalb von 2 Stunden im Rahmen unseres laufenden Update-Abonnements.",
      usagesCount: 0,
      lastEditedBy: "System"
    }
  ],
  unresolvedQueries: [],
  invoices: [
    {
      id: "inv-1",
      invoiceNumber: "RE-2026-001",
      customerId: "cust-max",
      customerName: "Max Mustermann",
      amount: 1190.00,
      taxAmount: 190.00,
      netAmount: 1000.00,
      taxRate: 19,
      issueDate: "2026-05-15",
      dueDate: "2026-06-15",
      status: "Bezahlt",
      description: "CMS System-Setup & CRM-Integration",
      paymentMethod: "Überweisung",
      paidAt: "2026-05-18",
      items: [
        {
          id: "item-1",
          description: "Strukturierte Bedarfsanalyse und Migrationstests nach modernem CMS-Standard",
          quantity: 1,
          unitPrice: 1000.00,
          total: 1000.00
        }
      ]
    },
    {
      id: "inv-2",
      invoiceNumber: "RE-2026-002",
      customerId: "cust-max",
      customerName: "Max Mustermann",
      amount: 345.10,
      taxAmount: 55.10,
      netAmount: 290.00,
      taxRate: 19,
      issueDate: "2026-05-28",
      dueDate: "2026-06-28",
      status: "Offen",
      description: "Core-Modul Customization & API-Audit",
      paymentMethod: "Überweisung",
      items: [
        {
          id: "item-2",
          description: "Sicherheits-Auditierung & API-Protokolle inkl. Entwickler-Einführung",
          quantity: 1,
          unitPrice: 290.00,
          total: 290.00
        }
      ]
    },
    {
      id: "inv-3",
      invoiceNumber: "RE-2026-003",
      customerId: "cust-anna",
      customerName: "Anna Schmidt",
      amount: 595.00,
      taxAmount: 95.00,
      netAmount: 500.00,
      taxRate: 19,
      issueDate: "2026-05-10",
      dueDate: "2026-05-24",
      status: "Überfällig",
      description: "Medienproduktion: Onboarding Video-Schnitt & Sound",
      paymentMethod: "Überweisung",
      items: [
        {
          id: "item-3",
          description: "Schnitt & Postproduction Social-Media Recruitment-Video (45s)",
          quantity: 1,
          unitPrice: 500.00,
          total: 500.00
        }
      ]
    }
  ],
  customTemplates: [],
  products: [
    {
      id: "prod-cms-core",
      name: "Kraftwerk Suite Enterprise Jahreslizenz",
      sku: "CMS-ENT-001",
      description: "Vollständige Jahreslizenz inklusive aller Core-Updates, unlimitierter Mandantenspeicher-Kapazität und SSL-Integritätsprüfung.",
      price: 1499.00,
      stock: 99,
      category: "Software & Lizenzen",
      status: "In Stock"
    },
    {
      id: "prod-cms-booking",
      name: "Kraftwerk Booking Pro Add-on",
      sku: "CMS-BKP-005",
      description: "Ermöglicht Online-Terminbuchen direkt im Frontend, automatische Synchronisation mit dem Kalender und E-Mail-Notizen.",
      price: 289.00,
      stock: 150,
      category: "Software & Lizenzen",
      status: "In Stock"
    },
    {
      id: "prod-cms-shop",
      name: "Kraftwerk Webshop Core Add-on",
      sku: "CMS-SHP-002",
      description: "E-Commerce Modul inklusive Echtzeit-Lagerbestand, Checkout und integriertem Stripe/PayPal Gateway.",
      price: 499.00,
      stock: 45,
      category: "E-Commerce",
      status: "In Stock"
    },
    {
      id: "prod-cms-ai",
      name: "Kraftwerk AI Business Assistant",
      sku: "CMS-AI-009",
      description: "Künstliche Intelligenz zur automatischen Wissensanlernung und Klärung von ungelösten Mandantenfragen rund um die Uhr.",
      price: 199.00,
      stock: 200,
      category: "Enterprise Integration",
      status: "In Stock"
    }
  ],
  orders: [],
  blogPosts: [
    {
      id: "post-security",
      title: "Maximale Datensicherheit: Warum wir auf Offline-First und lokale Verschlüsselung setzen",
      slug: "maximale-datensicherheit-offline-first",
      summary: "In Zeiten steigender Cyberangriffe ist lokaler Datenschutz das wertvollste Gut. Wir erklären unser integriertes Sicherheitskonzept.",
      content: "Die digitale Transformation schreitet rasant voran, doch mit ihr steigen auch die Risiken für sensible Unternehmensdaten. Bei Kraftwerk Suite haben wir uns bewusst für eine kompromisslose 'Offline-First' Systemarchitektur entschieden. \n\nDas bedeutet für Sie: Sämtliche Mandantendaten, Verträge, Video-Schnittmaterialien und interne Chats verbleiben primär in einer sicheren, lokalen Sandbox direkt auf Ihrem Rechner. Es gibt keine ungeschützten Cloud-Datenbanken oder unverschlüsselte API-Schnittstellen im Standardbetrieb.\n\nDurch den Einsatz moderner AES-256 Verschlüsselungsverfahren stellen wir sicher, dass nur berechtigte Personen Zugriff erhalten. So bleiben Ihre Geschäftsgeheimnisse zu jeder Sekunde geschützt.",
      category: "Sicherheit",
      status: "Published",
      createdAt: "2026-06-01T10:00:00.000Z",
      authorName: "System-Admin",
      comments: [
        {
          id: "comm-1",
          authorName: "Max Mustermann",
          authorEmail: "max@muster.de",
          content: "Das Konzept ist klasse. Endlich mal ein System, das Datenschutz wirklich ernst nimmt!",
          createdAt: "2026-06-02T12:30:00.000Z",
          isApproved: true,
          dsgvoConsent: true
        }
      ]
    },
    {
      id: "post-excellence",
      title: "Erfolgreiche Prozessdigitalisierung im Mittelstand: Leitfaden für 2026",
      slug: "prozessdigitalisierung-mittelstand-leitfaden",
      summary: "Erfahren Sie, wie mittelständische Beratungsunternehmen manuelle Freigaben reduzieren, Medienbrüche vermeiden und Kunden automatisiert onboarden.",
      content: "Viele Beratungs- und Agenturbetriebe verschwenden wertvolle Arbeitsstunden mit dem Versand von PDF-Verträgen über klassische Postwege, unübersichtlichen E-Mail-Ketten und redundanten Terminabsprachen.\n\nEine vollintegrierte Mandanten-Zentrale löst diese Hürden auf elegante Weise: Von der ersten Rahmenvereinbarung bis zum Lastschriftmandat werden alle Zustimmungen digital im geschlossenen Portal verifiziert.\n\nZusätzlich sorgt ein modular aufgebautes Backend dafür, dass benötigte Features wie Warenwirtschaft, Online-Terminplaner oder Medienbelege bei Bedarf in Sekunden scharfgeschaltet oder deaktiviert werden können, um den administrativem Aufwand für Ihre Mitarbeiter minimal zu halten.",
      category: "Digitalisierung",
      status: "Published",
      createdAt: "2026-06-03T09:15:00.000Z",
      authorName: "System-Admin",
      comments: []
    },
    {
      id: "post-architecture",
      title: "Modulare Software-Architekturen: Warum monolithische Riesen ausgedient haben",
      slug: "modulare-software-architekturen-vorteile",
      summary: "Warum überladene Systeme die Agilität einbremsen – und wie hochgradig anpassbare Plug-and-Play Dashboards die Effizienz steigern.",
      content: "Große Enterprise-Softwarelösungen leiden oft unter ihrer eigenen Komplexität. Benutzer fühlen sich von Navigationsleisten mit Hunderten von Unterpunkten erdrückt, und die Wartungskosten steigen ins Unermessliche.\n\nDas Gegenmittel ist ein granular steuerbares System. Bei der Kraftwerk Suite steuert der Administrator die Sichtbarkeit sämtlicher Hauptmodule flexibel aus dem Kontrollzentrum heraus. \n\nIst ein Feature wie das E-Commerce-System oder das Videoportal vorübergehend nicht mehr aktiv, blendet das System sämtliche Menüpunkte, Rechnungsverläufe und Benutzeroberflächen in Echtzeit und datensicher aus. Das ist modernes Softwaredesign: aufgeräumt, reaktionsschnell und maßgeschneidert auf Ihre betrieblichen Anforderungen.",
      category: "Software-Design",
      status: "Published",
      createdAt: "2026-06-15T14:20:00.000Z",
      authorName: "System-Admin",
      comments: []
    },
    {
      id: "post-ecommerce",
      title: "Die Zukunft des E-Commerce: Personalisierung & API-First im Jahr 2026",
      slug: "zukunft-ecommerce-personalisierung-api-first",
      summary: "Erfahren Sie, auf welche technischen Meilensteine Online-Händler im Jahr 2026 unbedingt setzen müssen, um konkurrenzfähig zu bleiben.",
      content: "Der Online-Handel wandelt sich rasant von statischen Onlineshops hin zu dynamischen Verkaufs-Ökosystemen. Statische Systeme, die mühsam manuell gepflegt werden müssen, haben ausgedient.\n\nZukünftige Gewinner setzen auf hochgradig anpassbare API-First Architekturen (auch Headless Commerce genannt). Dadurch können Produktdaten nahtlos in native Smartphone-Apps, Smart-TVs oder Social-Media Shopping-Dienste gestreut werden.\n\nZudem spielt die Hyper-Personalisierung eine Schlüsselrolle: Individuelle Preiskalkulationen, maßgeschneiderte Navigationselemente und dynamic Checkout-Flows machen den Einkauf so flüssig und bequem, dass Warenkorbabbrüche um bis zu 40% verringert werden können. Wir beraten Sie gern beim Upgrade Ihres Onlineshops auf flexible Modul-Schnittstellen.",
      category: "E-Commerce",
      status: "Published",
      createdAt: "2026-06-16T10:00:00.000Z",
      authorName: "System-Admin",
      comments: []
    },
    {
      id: "post-communication",
      title: "Kundenkommunikation 2.0: Digitale Portale schlagen E-Mail-Chaos",
      slug: "kundenkommunikation-portale-schlagen-email",
      summary: "Der direkte Draht zum Mandanten. Warum dedizierte geschlossene Systeme die Transparenz und Kundenzufriedenheit verdoppeln.",
      content: "Seien wir ehrlich: Klassische E-Mails sind extrem ineffizient und unsicher für sensible geschäftliche Absprachen. Verträge hängen als PDF-Anhang in Postfächern fest, Feedback zu Designentwürfen wird in langen CC-Schleifen verstreut und wichtige Anhänge gehen im Spam-Ordner verloren.\n\nEin geschlossenes Mandanten-Portal sorgt für Struktur und Ordnung: Ein zentraler Echtzeit-Chat mit integrierter FAQ-Datenbank beantwortet wiederkehrende Kundenfragen sofort und automatisch.\n\nAlle Verträge, Rechnungsbelege und Projektfortschritte sind strukturiert an einem Ort einsehbar und direkt digital freigebbar. Das spart Zeit auf beiden Seiten, erhöht die DSGVO-Konformität auf 100% und reduziert Rückfragen per Telefon drastisch.",
      category: "Kommunikation",
      status: "Published",
      createdAt: "2026-06-16T15:30:00.000Z",
      authorName: "System-Admin",
      comments: []
    },
    {
      id: "post-workflows",
      title: "Effektive Workflows im modernen Webdesign und Frontend-Entwicklung",
      slug: "effektive-workflows-webdesign-frontend",
      summary: "Wie Sie durch den geschickten Einsatz von Komponentenbibliotheken und Prototyping-Verfahren doppelten CSS-Aufwand vermeiden.",
      content: "Im modernen Frontend-Design gilt ein eiserner Grundsatz: 'Don't Repeat Yourself' (DRY). Dennoch schreiben viele Entwickler immer noch redundantes CSS für Button-Komponenten, Eingabefelder und Tabellen.\n\nDurch den Einsatz moderner CSS-Frameworks wie Tailwind CSS und komponentenbasierter Architekturen (wie React) können Sie Ihren Code extrem verschlanken.\n\nDurch diese modulare Bauweise lassen sich Änderungen an der Corporate Identity im Handumdrehen global ausrollen. Gepaart mit schnellen, interaktiven Test-Simulationen im Backend können Prototypen vorab realistisch geprüft und mit echten Kundendaten gefüttert werden – ohne ein einziges Byte an redundanten Produktivanwendungen zu gefährden.",
      category: "Software-Design",
      status: "Published",
      createdAt: "2026-06-17T08:00:00.000Z",
      authorName: "System-Admin",
      comments: []
    },
    {
      id: "post-seo-trends",
      title: "SEO Trends 2026: Search Generative Experience meistern",
      slug: "seo-trends-2026-search-generative-experience",
      summary: "Die Google-Suchmaschine wandelt sich fundamental. So optimieren Sie Ihre Webpräsenz für KI-gestützte Suchanfragen.",
      content: "Die Zeiten, in denen eine einfache Keyword-Optimierung für Topplatzierungen bei Suchmaschinen ausreichte, sind endgültig vorbei. Mit der breiten Einführung von Search Generative Experiences (SGE) beantworten generative Suchergebnisse die Fragen der Nutzer direkt im Browser-Tab.\n\nUm 2026 online sichtbar zu bleiben, müssen Webinhalte extrem präzise, tiefgründig und vertrauenswürdig (E-E-A-T-Kriterien) formuliert werden. Strukturierte Schema-Daten und semantische HTML5-Grundgerüste helfen Suchalgorithmen, Zusammenhänge fehlerfrei zu deuten.\n\nQualitativ hochwertige Fachartikel und Praxisratgeber, die echten Nutzwert bieten, gewinnen massiv an Bedeutung, da sie als direkte Referenzquellen in den KI-Zusammenfassungen zitiert werden. Wir helfen Ihnen gern bei der Suchmaschinen-Auditing Ihres Portals.",
      category: "Digitalisierung",
      status: "Published",
      createdAt: "2026-06-17T11:45:00.000Z",
      authorName: "System-Admin",
      comments: []
    }
  ]
};
