import React, { useState, useMemo } from 'react';
import { Customer, UploadedFile, DirectMessage, CalendarAppointment, CRMData } from '../types';
import { encryptMessage, decryptMessage } from '../cryptoUtils';
import { hashPassword } from '../storage';
import { ROADMAP_SUBTASKS, RoadmapSubTask } from './CustomerPortal';
import { ROADMAP_TEMPLATES } from '../templates';
import ManualDoc from './ManualDoc';
import Warenwirtschaft from './Warenwirtschaft';
import BillingAndShipping from './BillingAndShipping';
import BlogSystem from './BlogSystem';
import TemplatesManager from './TemplatesManager';
import { getActiveTemplate, STYLE_TEMPLATES } from '../styleTemplates';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  FileText, 
  Video, 
  File, 
  MessageSquare,
  Calendar,
  Send,
  Download,
  AlertCircle,
  CheckCircle,
  Eye,
  Clock,
  XCircle,
  TrendingUp,
  Sliders,
  Euro,
  User,
  ExternalLink,
  ChevronRight,
  Users,
  Wifi,
  WifiOff,
  ShieldCheck,
  Unlock,
  LockKeyhole,
  RefreshCw,
  Paperclip,
  Trash,
  Cpu,
  Sparkles,
  HelpCircle,
  Receipt,
  Layers,
  BookOpen,
  Tag,
  BarChart3,
  Palette,
  ShoppingBag,
  GripVertical,
  EyeOff,
  LayoutGrid,
  Settings
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const getPlausibleContracts = (cust: Customer) => [
  {
    id: 'pc1',
    name: 'Gewerbliche Betriebshaftpflicht',
    insurer: 'Allianz Gewerbe AG',
    policyNumber: `BH-${cust.id.substring(0, 3).toUpperCase()}-982-11`,
    premium: 340.00,
    paymentInterval: 'Jahr',
    status: 'Aktiv',
    startDate: '2023-01-01',
    deductible: '500,00 €',
    contactPerson: 'Muster-Administrator',
    coverage: '5.000.000 € pauschal',
    scope: `Standort ${cust.company || 'Hauptsitz'}`,
    mainDueDate: '2027-01-01',
    billingMethod: 'Lastschrifteinzug',
    details: [
      'Personen-, Lizenz- und Softwareschäden integriert',
      'Erweiterte Softwarerechte inkl. Updates',
      'Einschluss von On-Premise & Cloud-Deployments',
      'Verlustrisiko von Daten-Schnittstellen abgedeckt',
      'Integrierte API-Schnittstelle für Drohnen/UAV-Medien-Uploads'
    ]
  },
  {
    id: 'pc2',
    name: 'Aura Shop-Modul & Payment-Integration',
    insurer: 'Aura Core Dev-Team AG',
    policyNumber: `CMS-${cust.id.substring(0, 3).toUpperCase()}-509-AA`,
    premium: 520.00,
    paymentInterval: 'Jahr',
    status: 'Aktiv',
    startDate: '2024-03-15',
    deductible: 'SLA Support Gold inkl.',
    contactPerson: 'Muster-Administrator',
    coverage: 'Reaktionszeit < 4h garantiert',
    scope: 'Geografisches Europa',
    mainDueDate: '2027-03-15',
    billingMethod: 'Lastschrifteinzug',
    details: [
      'Ausführlicher Warenkorb- und Checkout-Modul-Support',
      'Neupreis-Entschädigung für API-Ausfallzeit bis 24 Stunden',
      'Echtzeit-Transaktionsprüfung im In- und Ausland',
      'Stripe & PayPal Zahlungsschnittstellen fertig vorkonfiguriert',
      'Inklusive SEO-Erweiterungen für ausländische Shops'
    ]
  },
  {
    id: 'pc3',
    name: 'Aura Enterprise Cloud Hosting',
    insurer: 'Aura Operations Team',
    policyNumber: `HST-${cust.id.substring(0, 3).toUpperCase()}-224-BB`,
    premium: 480.00,
    paymentInterval: 'Jahr',
    status: 'Aktiv',
    startDate: '2024-05-01',
    deductible: 'SLA Support Platin inkl.',
    contactPerson: 'Muster-Administrator',
    coverage: '99.9% Verfügbarkeitsgarantie',
    scope: 'Geografisches Europa',
    mainDueDate: '2027-05-01',
    billingMethod: 'Lastschrifteinzug',
    details: [
      'Gewerblich genutzter SSD-Server-Nutzungstarif',
      'Sicherheitsupdates & SSL-Zertifikate inklusive',
      'Absicherung von Kundendatenbanken bei Ausfällen',
      '24/7 Monitoring-Dienst mit automatischem SMS-Escalation-Service',
      'Zweitdomain-Einstufung mit vorteilhafter IP-Subnet-Adresse'
    ]
  },
  {
    id: 'pc4',
    name: 'Aura Update- & SLA-Supportvertrag',
    insurer: 'Aura Systems AG',
    policyNumber: `SLA-${cust.id.substring(0, 3).toUpperCase()}-220-33`,
    premium: 290.00,
    paymentInterval: 'Jahr',
    status: 'Aktiv',
    startDate: '2023-01-01',
    deductible: 'Keine (0,00 €)',
    contactPerson: 'Muster-Administrator',
    coverage: '99.99% Core-Betriebsbereitschaft',
    scope: `Betriebsstätte ${cust.company || 'Hauptsitz'}`,
    mainDueDate: '2027-01-01',
    billingMethod: 'Überweisung',
    details: [
      'Fortlaufender Update-Service aller CMS-Module',
      'Übernahme von Bugfixing-Aufwänden',
      'Greift bei Server-Ausfällen durch Feuer, Sturm, Leitungswasser und Cyberangriffe',
      'Schließt auch behördlich angeordnete DSGVO-Sicherheitsaudits mit ein',
      'System-Optimierungs-Berechnung auf Entwickler-Basis'
    ]
  },
  {
    id: 'pc5',
    name: 'Aura Backup & Cloud-Storage Suite',
    insurer: 'Aura Solutions Inc.',
    policyNumber: `STG-${cust.id.substring(0, 3).toUpperCase()}-445-98`,
    premium: 210.05,
    paymentInterval: 'Jahr',
    status: 'Aktiv',
    startDate: '2023-10-01',
    deductible: '250,00 €',
    contactPerson: 'Muster-Administrator',
    coverage: '1 TB Cloud-Backup-Volumen',
    scope: `Betriebsstätte ${cust.company || 'Hauptsitz'}`,
    mainDueDate: '2027-10-01',
    billingMethod: 'Lastschrifteinzug',
    details: [
      'Umfassende verschlüsselte Offsite-Ablage',
      'Spezial-Elektronikschutz für Server-Equipment',
      'Wiederherstellung von Kundendaten und Software-Versionierung',
      'Sicherung von Medieninhalten & Bilddatenbanken vor Vandalismusschäden',
      'Offsite-Backups, Ransomware-Schutz und automatische Wiederherstellung'
    ]
  }
];

interface AdminCRMProps {
  data: CRMData;
  onDataChange: (newData: CRMData | ((prev: CRMData) => CRMData)) => void;
  activeTab: string;
  isOnline: boolean;
  onOnlineToggle: (online: boolean) => void;
  onTabChange?: (tab: string) => void;
  onSimulateCustomer?: (id: string | null) => void;
  onPreviewPublicFrontend?: () => void;
  forcedCustomerSearch?: string;
  onClearForcedCustomerSearch?: () => void;
  forcedFileSearch?: string;
  onClearForcedFileSearch?: () => void;
  forcedActiveChatCustomerId?: string;
  onClearForcedActiveChatCustomerId?: () => void;
}

export default function AdminCRM({ 
  data, 
  onDataChange, 
  activeTab, 
  isOnline, 
  onOnlineToggle, 
  onTabChange, 
  onSimulateCustomer, 
  onPreviewPublicFrontend,
  forcedCustomerSearch,
  onClearForcedCustomerSearch,
  forcedFileSearch,
  onClearForcedFileSearch,
  forcedActiveChatCustomerId,
  onClearForcedActiveChatCustomerId
}: AdminCRMProps) {
  const activeTemplate = useMemo(() => {
    return getActiveTemplate(data.settings?.activeTemplateId);
  }, [data.settings?.activeTemplateId]);

  const handleLogAction = (action: string, details: string) => {
    const newLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      userId: 'admin',
      userDisplayName: 'Portal-Admin',
      details
    };
    onDataChange((prev: CRMData) => ({
      ...prev,
      auditLogs: [...(prev.auditLogs || []), newLogItem]
    }));
  };

  const handleTogglePlugin = (pluginKey: string) => {
    const currentSettings = data.settings || {
      activeTemplateId: 'marketing',
      cookieConsentRequired: false,
      gdprLoggingEnabled: true,
      shopEnabled: true,
      blogEnabled: true,
      appointmentsEnabled: true,
      invoicesEnabled: true,
      videosEnabled: true,
      botEnabled: true,
      chatEnabled: true,
      companyName: 'Aura Suite Enterprise',
      companyAddress: 'Musterstraße 1, 80331 München',
      companyEmail: 'support@aura-suite.de',
      companyPhone: '+49 123 456789',
      iban: 'DE49 7835 1520 1883 1941 12',
      bic: 'BYLADEM1LIC',
      taxId: 'DE 123456789'
    };
    
    const currentVal = currentSettings[pluginKey as keyof typeof currentSettings] !== false;
    const updatedSettings = {
      ...currentSettings,
      [pluginKey]: !currentVal
    };

    onDataChange((prev: CRMData) => ({
      ...prev,
      settings: updatedSettings
    }));

    handleLogAction(
      'PLUGIN_TOGGLE',
      `Modul '${pluginKey}' wurde ${!currentVal ? 'aktiviert' : 'deaktiviert'}.`
    );
  };

  // --- DYNAMIC ALL TEMPLATES INJECTOR ---
  const allTemplates = useMemo(() => {
    return [
      ...ROADMAP_TEMPLATES,
      ...(data.customTemplates || [])
    ];
  }, [data.customTemplates]);

  // --- STATE FOR BILLING & BOOKKEEPING ---
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoicePreviewObject, setInvoicePreviewObject] = useState<any | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: '',
    invoiceNumber: '',
    issueDate: '2026-05-31',
    dueDate: '2026-06-14',
    description: 'Finanz- & Vorsorgeberatung',
    taxRate: 19,
    items: [
      { id: 'item-1', description: 'Beratungspauschale gem. § 4 Nr. 11 UStG / Honoror', quantity: 1, unitPrice: 350.00 }
    ]
  });

  // --- STATE FOR MOUNTING TEMPLATE CUSTOMIZER ---
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  // --- STATE FOR PREDEFINED COMMUNICATION TEMPLATES ---
  const [editingCommTemplate, setEditingCommTemplate] = useState<{
    id?: string;
    title: string;
    subject: string;
    content: string;
    type: 'email' | 'chat' | 'all';
    category: string;
  } | null>(null);
  const [isCommTemplateModalOpen, setIsCommTemplateModalOpen] = useState(false);
  const [commTemplateFilterCategory, setCommTemplateFilterCategory] = useState('all');
  const [commTemplateFilterType, setCommTemplateFilterType] = useState('all');
  const [commTemplateSearch, setCommTemplateSearch] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    icon: 'Layers',
    category: 'Software' as 'Marketing' | 'Software' | 'Projekt' | 'Enterprise',
    phases: [
      { phase: 1, title: 'Bedarf & Analyse', desc: 'Erstgespräch & Erfassung' },
      { phase: 2, title: 'Konzeptentwicklung', desc: 'Sichtung & Tarifierung' },
      { phase: 3, title: 'Präsentation', desc: 'Abstimmung & Auswahl' },
      { phase: 4, title: 'System-Setup', desc: 'Deploy & Anpassung' },
      { phase: 5, title: 'Laufender Service', desc: 'Updates & Jahrestermin' }
    ],
    tasks: [
      { id: 'custom-t1', phase: 1, title: 'Erstberatung & Analyse', desc: 'Persönlicher Erst-Checkup im System-Büro oder per Video.', role: 'Beide' as 'Kunde' | 'Berater' | 'Beide', actionLabel: 'Erstgespräch buchen', actionType: 'appointment' as any }
    ]
  });

  // --- SYNC & SECURE MESSAGING STATES ---
  const [isSyncing, setIsSyncing] = useState(false);
  const [e2eePassphrase, setE2eePassphrase] = useState('LE_E2E_SECURE_KEY');
  const [showRawCiphers, setShowRawCiphers] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  } | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  // --- STATE FOR CUSTOMER MANAGEMENT ---
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustForContracts, setSelectedCustForContracts] = useState<Customer | null>(null);
  const [selectedAdminDetailPolicy, setSelectedAdminDetailPolicy] = useState<any | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    status: 'Neukunde' as Customer['status'],
    username: '',
    password: '',
    notes: '',
    activePhase: 1,
    completedTasks: [] as string[],
    roadmapEnabled: true,
    roadmapTemplateId: 'marketing'
  });

  // --- STATE FOR DOCUMENT CENTRE ---
  const [fileSearch, setFileSearch] = useState('');
  const [fileCategoryFilter, setFileCategoryFilter] = useState<string>('all');
  const [fileCustomerFilter, setFileCustomerFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [editingFileNote, setEditingFileNote] = useState('');
  const [editingFileStatus, setEditingFileStatus] = useState<UploadedFile['status']>('Eingereicht');

  // --- STATE FOR MESSAGING (DMs) ---
  const [videoTitle, setVideoTitle] = useState('');
  const [videoSelectedCustomerId, setVideoSelectedCustomerId] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoAdminNote, setVideoAdminNote] = useState('');
  const [videoStatus, setVideoStatus] = useState<UploadedFile['status']>('Genehmigt');
  const [videoUploadSuccessMsg, setVideoUploadSuccessMsg] = useState<string | null>(null);

  const [activeChatCustomerId, setActiveChatCustomerId] = useState<string>(
    data.customers.length > 0 ? data.customers[0].id : ''
  );
  const [chatInput, setChatInput] = useState('');

  // --- STATE FOR DASHBOARD WIDGETS DRAG & DROP & VISIBILITY ---
  const [showLayoutCustomizer, setShowLayoutCustomizer] = useState(false);
  const [localDraggedWidgetId, setLocalDraggedWidgetId] = useState<string | null>(null);
  const [localDragOverWidgetId, setLocalDragOverWidgetId] = useState<string | null>(null);

  const handleWidgetDragStart = (id: string) => {
    setLocalDraggedWidgetId(id);
  };

  const handleWidgetDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (localDraggedWidgetId && localDraggedWidgetId !== id) {
      setLocalDragOverWidgetId(id);
    }
  };

  const handleWidgetDrop = (targetId: string) => {
    if (!localDraggedWidgetId || localDraggedWidgetId === targetId) return;
    
    const currentOrder = [...(data.settings?.dashboardWidgetsOrder || ['revenue', 'news', 'blog'])];
    const draggedIndex = currentOrder.indexOf(localDraggedWidgetId);
    const targetIndex = currentOrder.indexOf(targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Reorder
      currentOrder.splice(draggedIndex, 1);
      currentOrder.splice(targetIndex, 0, localDraggedWidgetId);
      
      onDataChange((prev: CRMData) => ({
        ...prev,
        settings: {
          ...(prev.settings || {} as any),
          dashboardWidgetsOrder: currentOrder,
        }
      }));

      handleLogAction(
        'DASHBOARD_LAYOUT_CHANGE',
        `Reihenfolge der Dashboard-Widgets geändert: ${currentOrder.join(', ')}`
      );
    }
    
    setLocalDraggedWidgetId(null);
    setLocalDragOverWidgetId(null);
  };

  const handleToggleWidgetVisibility = (id: string) => {
    const currentVisibility = { ...(data.settings?.dashboardWidgetsVisibility || { revenue: true, news: true, blog: true }) };
    const nextVal = currentVisibility[id] === false; // toggle
    currentVisibility[id] = nextVal;

    onDataChange((prev: CRMData) => ({
      ...prev,
      settings: {
        ...(prev.settings || {} as any),
        dashboardWidgetsVisibility: currentVisibility,
      }
    }));

    handleLogAction(
      'DASHBOARD_LAYOUT_VISIBILITY',
      `Dashboard-Widget '${id}' wurde ${nextVal ? 'eingeblendet' : 'ausgeblendet'}.`
    );
  };

  // --- STATE FOR CALENDAR (APPOINTMENTS) ---
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    customerId: ''
  });

  // --- STATE FOR KI-BOT TRAINING & SIMULATION ---
  const [isBotRuleModalOpen, setIsBotRuleModalOpen] = useState(false);
  const [selectedBotRuleId, setSelectedBotRuleId] = useState<string | null>(null);
  const [promotingUnresolvedId, setPromotingUnresolvedId] = useState<string | null>(null);
  const [botRuleForm, setBotRuleForm] = useState({
    triggerKeywordsText: '',
    answer: ''
  });
  const [botTestInput, setBotTestInput] = useState('');
  const [botTestResult, setBotTestResult] = useState<{
    matched: boolean;
    ruleTitle?: string;
    score: number;
    answer: string;
  } | null>(null);

  // Synchronise search/filter state triggered globally from Sidebar search bar
  React.useEffect(() => {
    if (forcedCustomerSearch) {
      setCustomerSearch(forcedCustomerSearch);
      if (onClearForcedCustomerSearch) onClearForcedCustomerSearch();
    }
  }, [forcedCustomerSearch, onClearForcedCustomerSearch]);

  React.useEffect(() => {
    if (forcedFileSearch) {
      setFileSearch(forcedFileSearch);
      if (onClearForcedFileSearch) onClearForcedFileSearch();
    }
  }, [forcedFileSearch, onClearForcedFileSearch]);

  React.useEffect(() => {
    if (forcedActiveChatCustomerId) {
      setActiveChatCustomerId(forcedActiveChatCustomerId);
      if (onClearForcedActiveChatCustomerId) onClearForcedActiveChatCustomerId();
    }
  }, [forcedActiveChatCustomerId, onClearForcedActiveChatCustomerId]);

  // --- KI-BOT TRAINING ACTIONS ---
  const handleOpenBotRuleModal = (ruleId: string | null = null) => {
    if (ruleId) {
      const rule = (data.botRules || []).find(r => r.id === ruleId);
      if (rule) {
        setSelectedBotRuleId(ruleId);
        setBotRuleForm({
          triggerKeywordsText: rule.triggerKeywords.join(', '),
          answer: rule.answer
        });
      }
    } else {
      setSelectedBotRuleId(null);
      setBotRuleForm({
        triggerKeywordsText: '',
        answer: ''
      });
    }
    setIsBotRuleModalOpen(true);
  };

  const handleSaveBotRule = () => {
    if (!botRuleForm.triggerKeywordsText.trim() || !botRuleForm.answer.trim()) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus!');
      return;
    }

    const keywords = botRuleForm.triggerKeywordsText
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    const currentRules = data.botRules || [];
    let updatedRules = [...currentRules];
    let nextUnresolved = data.unresolvedQueries || [];

    if (selectedBotRuleId) {
      updatedRules = currentRules.map(r => {
        if (r.id === selectedBotRuleId) {
          return {
            ...r,
            triggerKeywords: keywords,
            answer: botRuleForm.answer,
            lastEditedBy: 'M. Weber'
          };
        }
        return r;
      });
    } else {
      const newRule = {
        id: `rule-${Date.now()}`,
        triggerKeywords: keywords,
        answer: botRuleForm.answer,
        usagesCount: 0,
        lastEditedBy: 'M. Weber'
      };
      updatedRules = [...currentRules, newRule];
    }

    if (promotingUnresolvedId) {
      nextUnresolved = nextUnresolved.filter(q => q.id !== promotingUnresolvedId);
    }

    onDataChange({
      ...data,
      botRules: updatedRules,
      unresolvedQueries: nextUnresolved
    });

    setIsBotRuleModalOpen(false);
    setSelectedBotRuleId(null);
    setPromotingUnresolvedId(null);
    setBotRuleForm({ triggerKeywordsText: '', answer: '' });
  };

  const handleDeleteBotRule = (ruleId: string) => {
    if (window.confirm('Möchten Sie diese KI-Antwortregel wirklich unwiderruflich löschen?')) {
      const updatedRules = (data.botRules || []).filter(r => r.id !== ruleId);
      onDataChange({
        ...data,
        botRules: updatedRules
      });
    }
  };

  // --- CORE SYSTEM: BOOKKEEPING & INVOICES ACTIONS ---
  const handleOpenCreateInvoiceModal = () => {
    const nextSeq = ((data.invoices || []).length + 1).toString().padStart(3, '0');
    const todayStr = new Date().toISOString().split('T')[0];
    const dueStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setInvoiceForm({
      customerId: data.customers.length > 0 ? data.customers[0].id : '',
      invoiceNumber: `RE-2026-${nextSeq}`,
      issueDate: todayStr,
      dueDate: dueStr,
      description: 'Dienstleistungen & Vorsorge-Honorar',
      taxRate: 19,
      items: [
        { id: `item-${Date.now()}`, description: 'Best-Select Beratungspauschale § 4 Nr. 11 UStG', quantity: 1, unitPrice: 350.00 }
      ]
    });
    setIsInvoiceModalOpen(true);
  };

  const handleInvoiceItemAdd = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [
        ...invoiceForm.items,
        { id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }
      ]
    });
  };

  const handleInvoiceItemRemove = (itemId: string) => {
    if (invoiceForm.items.length <= 1) return;
    setInvoiceForm({
      ...invoiceForm,
      items: invoiceForm.items.filter(it => it.id !== itemId)
    });
  };

  const handleInvoiceItemChange = (itemId: string, field: string, value: any) => {
    const updated = invoiceForm.items.map(it => {
      if (it.id === itemId) {
        return { ...it, [field]: value };
      }
      return it;
    });
    setInvoiceForm({
      ...invoiceForm,
      items: updated
    });
  };

  const handleSaveInvoice = () => {
    if (!invoiceForm.customerId) {
      alert('Bitte wählen Sie einen Mandanten aus.');
      return;
    }
    if (!invoiceForm.invoiceNumber.trim()) {
      alert('Rechnungsnummer darf nicht leer sein.');
      return;
    }

    // Live aggregated finance values
    let netTotal = 0;
    const validatedItems = invoiceForm.items.map(it => {
      const q = Number(it.quantity) || 0;
      const p = Number(it.unitPrice) || 0;
      const rowTot = Number((q * p).toFixed(2));
      netTotal += rowTot;
      return {
        id: it.id,
        description: it.description || 'Position',
        quantity: q,
        unitPrice: p,
        total: rowTot
      };
    });

    const taxAmount = Number((netTotal * (Number(invoiceForm.taxRate) / 100)).toFixed(2));
    const grossTotal = Number((netTotal + taxAmount).toFixed(2));

    const selectedCust = data.customers.find(c => c.id === invoiceForm.customerId);

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceForm.invoiceNumber,
      customerId: invoiceForm.customerId,
      customerName: selectedCust ? selectedCust.name : 'Unbekannt',
      netAmount: netTotal,
      taxAmount: taxAmount,
      amount: grossTotal,
      taxRate: Number(invoiceForm.taxRate),
      issueDate: invoiceForm.issueDate,
      dueDate: invoiceForm.dueDate,
      status: 'Offen' as const,
      description: invoiceForm.description,
      items: validatedItems
    };

    onDataChange({
      ...data,
      invoices: [...(data.invoices || []), newInvoice]
    });

    setIsInvoiceModalOpen(false);
  };

  const handleUpdateInvoiceStatus = (invId: string, status: 'Bezahlt' | 'Storno' | 'Offen') => {
    const todayStr = new Date().toLocaleDateString('de-DE');
    const updated = (data.invoices || []).map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          status,
          paymentMethod: status === 'Bezahlt' ? 'Überweisung' as const : undefined,
          paidAt: status === 'Bezahlt' ? todayStr : undefined
        };
      }
      return inv;
    });

    onDataChange({
      ...data,
      invoices: updated
    });
  };

  const handleExportInvoicesCSV = () => {
    const list = data.invoices || [];
    if (list.length === 0) {
      alert('Keine Rechnungsdaten vorhanden.');
      return;
    }

    let csvContent = "Rechnungsnummer;Mandantenname;Netto;MwSt;Brutto;Ausstellungsdatum;Faelligkeitsdatum;Status;Zahlungsart;Gezahlt Am\n";
    
    list.forEach(inv => {
      csvContent += `${inv.invoiceNumber};${inv.customerName};${inv.netAmount.toFixed(2)};${inv.taxAmount.toFixed(2)};${inv.amount.toFixed(2)};${inv.issueDate};${inv.dueDate};${inv.status};${inv.paymentMethod || ''};${inv.paidAt || ''}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Umsatz_Export_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CORE SYSTEM: CUSTOM DESIGN ROADMAP TEMPLATE ACTIONS ---
  const handleOpenCreateTemplateModal = (tplId: string | null = null) => {
    if (tplId) {
      const target = allTemplates.find(t => t.id === tplId);
      if (target) {
        setEditingTemplateId(tplId);
        setTemplateForm({
          name: target.name,
          description: target.description,
          icon: target.icon || 'Layers',
          category: target.category || 'Software',
          phases: JSON.parse(JSON.stringify(target.phases)), // Deep copy
          tasks: JSON.parse(JSON.stringify(target.tasks))
        });
      }
    } else {
      setEditingTemplateId(null);
      setTemplateForm({
        name: 'Gewerbe Risiko-Vermeidungstaktik v3',
        description: 'Spezifisches Beratungstemplate für Neugewerbe und KMUs im bayerischen Raum.',
        icon: 'Layers',
        category: 'Gewerbe',
        phases: [
          { phase: 1, title: 'Bedarf & Analyse', desc: 'Erstgespräch & Erfassung' },
          { phase: 2, title: 'Konzeptentwicklung', desc: 'Sichtung & Tarifierung' },
          { phase: 3, title: 'Präsentation', desc: 'Abstimmung & Auswahl' },
          { phase: 4, title: 'System-Setup', desc: 'Deploy & Anpassung' },
          { phase: 5, title: 'Laufender Support', desc: 'Updates und Jahrestermine' }
        ],
        tasks: [
          { id: `t-${Date.now()}-1`, phase: 1, title: 'Erstgespräch & Anforderungs-Briefing', desc: 'Persönliche Absprachen zur System-Zielsetzung.', role: 'Beide', actionLabel: 'Erstgespräch buchen', actionType: 'appointment' },
          { id: `t-${Date.now()}-2`, phase: 1, title: 'Nutzungsvereinbarung \& SEPA', desc: 'Elektronische Freigabe der Vereinbarung einholen.', role: 'Kunde', actionLabel: 'Systemvertrag digital signieren', actionType: 'upload' },
          { id: `t-${Date.now()}-3`, phase: 2, title: 'Auswertung der Systemanforderungsprotokolle', desc: 'Sichtung aller Systemstrukturen.', role: 'Berater' }
        ]
      });
    }
    setIsTemplateModalOpen(true);
  };

  const handleTemplateTaskAdd = () => {
    setTemplateForm({
      ...templateForm,
      tasks: [
        ...templateForm.tasks,
        { id: `t-${Date.now()}`, phase: 1, title: '', desc: '', role: 'Kunde' }
      ]
    });
  };

  const handleTemplateTaskRemove = (taskId: string) => {
    setTemplateForm({
      ...templateForm,
      tasks: templateForm.tasks.filter(t => t.id !== taskId)
    });
  };

  const handleTemplateTaskChange = (taskId: string, field: string, value: any) => {
    const updated = templateForm.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setTemplateForm({
      ...templateForm,
      tasks: updated
    });
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name.trim()) {
      alert('Der Name der Schablone darf nicht leer sein.');
      return;
    }

    const nextId = editingTemplateId || `tpl-${Date.now()}`;
    const targetTemplate = {
      id: nextId,
      name: templateForm.name,
      description: templateForm.description,
      icon: templateForm.icon,
      category: templateForm.category,
      phases: templateForm.phases,
      tasks: templateForm.tasks
    };

    const currentCustoms = data.customTemplates || [];
    let updatedCustoms = [...currentCustoms];

    if (editingTemplateId) {
      const isSystem = ROADMAP_TEMPLATES.some(t => t.id === editingTemplateId);
      if (isSystem) {
        const uniqueId = `tpl-custom-${Date.now()}`;
        targetTemplate.id = uniqueId;
        updatedCustoms.push(targetTemplate);
        alert(`System-Template wurde als bearbeitete Kopie "${targetTemplate.name}" entworfen und abgespeichert!`);
      } else {
        updatedCustoms = currentCustoms.map(t => t.id === editingTemplateId ? targetTemplate : t);
      }
    } else {
      updatedCustoms.push(targetTemplate);
    }

    onDataChange({
      ...data,
      customTemplates: updatedCustoms
    });

    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (tplId: string) => {
    if (confirm('Möchten Sie dieses custom Roadmap-Template wirklich unwiderruflich löschen?')) {
      const updated = (data.customTemplates || []).filter(t => t.id !== tplId);
      onDataChange({
        ...data,
        customTemplates: updated
      });
    }
  };

  const handleSaveCommTemplate = () => {
    if (!editingCommTemplate) return;
    if (!editingCommTemplate.title.trim() || !editingCommTemplate.content.trim()) {
      alert('Titel und Inhalt dürfen nicht leer sein.');
      return;
    }

    const currentTemplates = data.communicationTemplates || [];
    let updated;

    if (editingCommTemplate.id) {
      updated = currentTemplates.map(t => t.id === editingCommTemplate.id ? {
        ...t,
        title: editingCommTemplate.title,
        subject: editingCommTemplate.subject,
        content: editingCommTemplate.content,
        type: editingCommTemplate.type,
        category: editingCommTemplate.category
      } : t);
      handleLogAction('Antwort-Vorlage geändert', `ID: ${editingCommTemplate.id}, Titel: ${editingCommTemplate.title}`);
    } else {
      const newTpl = {
        id: `comm-tpl-${Date.now()}`,
        title: editingCommTemplate.title,
        subject: editingCommTemplate.subject,
        content: editingCommTemplate.content,
        type: editingCommTemplate.type,
        category: editingCommTemplate.category || 'Allgemein',
        createdAt: new Date().toISOString()
      };
      updated = [...currentTemplates, newTpl];
      handleLogAction('Antwort-Vorlage erstellt', `Titel: ${editingCommTemplate.title}`);
    }

    onDataChange(prev => ({
      ...prev,
      communicationTemplates: updated
    }));
    setIsCommTemplateModalOpen(false);
    setEditingCommTemplate(null);
  };

  const handleDeleteCommTemplate = (tplId: string) => {
    if (confirm('Möchten Sie diese Antwort-Vorlage wirklich dauerhaft löschen?')) {
      const currentTemplates = data.communicationTemplates || [];
      const updated = currentTemplates.filter(t => t.id !== tplId);
      onDataChange(prev => ({
        ...prev,
        communicationTemplates: updated
      }));
      handleLogAction('Antwort-Vorlage gelöscht', `ID: ${tplId}`);
    }
  };

  const handleTestBotResponse = (text: string) => {
    setBotTestInput(text);
    if (!text.trim()) {
      setBotTestResult(null);
      return;
    }

    const activeRules = data.botRules || [];
    const tokens = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").split(/\s+/);
    
    let bestRule: any = null;
    let maxScore = 0;

    for (const rule of activeRules) {
      let score = 0;
      for (const kw of rule.triggerKeywords) {
        if (text.toLowerCase().includes(kw.toLowerCase())) {
          score += 2;
        }
        for (const token of tokens) {
          if (token === kw.toLowerCase()) {
            score += 1;
          }
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestRule = rule;
      }
    }

    if (bestRule && maxScore > 0) {
      setBotTestResult({
        matched: true,
        ruleTitle: `Regel mit Auslösern: "${bestRule.triggerKeywords.slice(0, 3).join(', ')}${bestRule.triggerKeywords.length > 3 ? '...' : ''}"`,
        score: maxScore,
        answer: bestRule.answer
      });
    } else {
      setBotTestResult({
        matched: false,
        score: 0,
        answer: `Oha! Das ist ein sehr interessanter Aspekt. Da mir dazu aktuell noch keine konkreten Trainingsdaten vorliegen, habe ich Ihr Anliegen soeben mit Priorität an meine persönliche Leitstelle und die **Administration** weitergeleitet. 📞\n\nWir werden uns in Kürze persönlich bei Ihnen melden!\n\n💡 *Tipp für den Administrator: Dieses Thema kann im CMS Admin-Panel unter "KI-Bot Training" ausgebildet werden, damit ich beim nächsten Mal direkt automatisiert antworten kann.*`
      });
    }
  };

  // --- CUSTOMER MUTATIONS ---
  const handleOpenCustomerModal = (customer: Customer | null = null) => {
    if (customer) {
      setSelectedCustomer(customer);
      setCustomerForm({
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
        username: customer.username,
        password: '', // Keep empty if not updating
        notes: customer.notes,
        activePhase: customer.activePhase || 1,
        completedTasks: customer.completedTasks || [],
        roadmapEnabled: customer.roadmapEnabled !== false,
        roadmapTemplateId: customer.roadmapTemplateId || 'marketing'
      });
    } else {
      setSelectedCustomer(null);
      setCustomerForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        status: 'Neukunde',
        username: '',
        password: '',
        activePhase: 1,
        completedTasks: [],
        roadmapEnabled: true,
        roadmapTemplateId: 'marketing'
      });
    }
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    if (!customerForm.name || !customerForm.username || !customerForm.email) {
      alert('Bitte füllen Sie mindestens Name, E-Mail und Benutzername aus.');
      return;
    }

    if (!selectedCustomer) {
      const existingUser = data.customers.find(c => c.username === customerForm.username);
      if (existingUser) {
        alert('Dieser Benutzername ist bereits vergeben. Bitte wählen Sie einen anderen.');
        return;
      }

      if (!customerForm.password) {
        alert('Geben Sie ein Anfangspasswort für den Kunden an.');
        return;
      }
    }

    // Pre-calculate the secure password hash asynchronously
    let computedPasswordHash = '';
    if (customerForm.password) {
      computedPasswordHash = await hashPassword(customerForm.password);
    }

    onDataChange(prev => {
      let updatedCustomers = [...prev.customers];

      if (selectedCustomer) {
        // Edit existing
        updatedCustomers = updatedCustomers.map(c => {
          if (c.id === selectedCustomer.id) {
            let passwordHash = c.passwordHash;
            if (customerForm.password) {
              passwordHash = computedPasswordHash;
            }
            return {
              ...c,
              name: customerForm.name,
              company: customerForm.company,
              email: customerForm.email,
              phone: customerForm.phone,
              address: customerForm.address,
              status: customerForm.status,
              username: customerForm.username,
              notes: customerForm.notes,
              passwordHash,
              activePhase: customerForm.activePhase,
              completedTasks: customerForm.completedTasks,
              roadmapEnabled: customerForm.roadmapEnabled,
              roadmapTemplateId: customerForm.roadmapTemplateId,
              lastModified: new Date().toISOString()
            };
          }
          return c;
        });
      } else {
        // Create new customer
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: customerForm.name,
          company: customerForm.company,
          email: customerForm.email,
          phone: customerForm.phone,
          address: customerForm.address,
          status: customerForm.status,
          username: customerForm.username,
          passwordHash: computedPasswordHash,
          notes: customerForm.notes,
          createdAt: new Date().toISOString(),
          activePhase: customerForm.activePhase,
          completedTasks: [],
          roadmapEnabled: customerForm.roadmapEnabled,
          roadmapTemplateId: customerForm.roadmapTemplateId
        };
        updatedCustomers.push(newCustomer);
      }

      return { ...prev, customers: updatedCustomers };
    });

    setIsCustomerModalOpen(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Möchten Sie diesen Kunden wirklich permanent löschen? Alle zugehörigen Dokumente und Chats werden ebenfalls entfernt.')) {
      const updatedCustomers = data.customers.filter(c => c.id !== customerId);
      const updatedFiles = data.files.filter(f => f.customerId !== customerId);
      const updatedMessages = data.messages.filter(m => m.senderId !== customerId && m.receiverId !== customerId);
      const updatedAppointments = data.appointments.filter(a => a.customerId !== customerId);
      
      onDataChange({
        customers: updatedCustomers,
        files: updatedFiles,
        messages: updatedMessages,
        appointments: updatedAppointments
      });

      if (activeChatCustomerId === customerId) {
        setActiveChatCustomerId(updatedCustomers.length > 0 ? updatedCustomers[0].id : '');
      }
    }
  };

  // --- VIDEO UPLOAD MUTATION ---
  const handleAdminUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoSelectedCustomerId || !videoTitle || !videoFileName) {
      alert('Bitte füllen Sie alle Pflichtfelder aus (Kunde, Videotitel, Dateiname).');
      return;
    }
    const customerObj = data.customers.find(c => c.id === videoSelectedCustomerId);
    if (!customerObj) return;

    const newVideoFile: UploadedFile = {
      id: `file-vid-${Date.now()}`,
      customerId: videoSelectedCustomerId,
      customerName: customerObj.name,
      name: videoFileName,
      type: 'video/mp4',
      size: Math.floor(Math.random() * 50000000) + 15000000, // 15MB to 65MB
      category: 'Video',
      uploadDate: new Date().toISOString().split('T')[0],
      status: videoStatus,
      adminNote: videoAdminNote || `Dieses Video wurde für ${customerObj.name} bereitgestellt.`
    };

    onDataChange({
      ...data,
      files: [newVideoFile, ...data.files]
    });

    setVideoUploadSuccessMsg(`Das Video "${videoTitle}" (${videoFileName}) wurde erfolgreich für ${customerObj.name} freigegeben!`);
    setVideoTitle('');
    setVideoFileName('');
    setVideoAdminNote('');
    setTimeout(() => setVideoUploadSuccessMsg(null), 5000);
  };

  // --- APPOINTMENTS MUTATIONS ---
  const handleSaveAppointment = () => {
    if (!appointmentForm.title || !appointmentForm.date || !appointmentForm.time) {
      alert('Bitte füllen Sie Titel, Datum und Uhrzeit aus.');
      return;
    }

    const newAppointment: CalendarAppointment = {
      id: `appt-${Date.now()}`,
      title: appointmentForm.title,
      date: appointmentForm.date,
      time: appointmentForm.time,
      description: appointmentForm.description,
      customerId: appointmentForm.customerId || undefined,
      status: 'Bestätigt'
    };

    onDataChange({
      ...data,
      appointments: [...data.appointments, newAppointment]
    });

    setIsAppointmentModalOpen(false);
    setAppointmentForm({ title: '', date: '', time: '', description: '', customerId: '' });
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Möchten Sie diesen Termin permanent löschen?')) {
      onDataChange({
        ...data,
        appointments: data.appointments.filter(a => a.id !== id)
      });
    }
  };

  const handleConfirmAppointment = (id: string) => {
    const appt = data.appointments.find(a => a.id === id);
    if (!appt) return;

    // 1. Update appointment status
    const updatedAppointments = data.appointments.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Bestätigt' as const };
      }
      return a;
    });

    // 2. Draft and E2EE encrypt the confirmation message to the client
    let updatedMessages = [...data.messages];
    if (appt.customerId) {
      const confirmationText = `Hallo! Ich freue mich, Ihren Termin '${appt.title}' am ${appt.date} um ${appt.time} Uhr hiermit zu bestätigen. Viele Grüße, Ihr Beratungsteam`;
      const encryptedContent = encryptMessage(confirmationText, e2eePassphrase);
      
      const newMsg: DirectMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'admin',
        receiverId: appt.customerId,
        content: confirmationText,
        encryptedContent: encryptedContent,
        isEncrypted: true,
        timestamp: new Date().toISOString(),
        isRead: false,
        syncStatus: isOnline ? 'Synced' : 'PendingSync'
      };
      
      updatedMessages.push(newMsg);
    }

    onDataChange({
      ...data,
      appointments: updatedAppointments,
      messages: updatedMessages
    });

    alert('Der Termin wurde erfolgreich bestätigt und eine Benachrichtigung (DM) wurde automatisch an den Klienten gesendet.');
  };

  const handleRejectAppointment = (id: string) => {
    const appt = data.appointments.find(a => a.id === id);
    if (!appt) return;

    if (!confirm('Möchten Sie diesen Termin ablehnen?')) return;

    // 1. Update appointment status
    const updatedAppointments = data.appointments.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Abgelehnt' as const };
      }
      return a;
    });

    onDataChange({
      ...data,
      appointments: updatedAppointments
    });

    alert('Der Termin wurde abgelehnt.');
  };

  // --- DOCUMENT CENTRE CHANGES ---
  const handleSelectFile = (file: UploadedFile) => {
    setSelectedFile(file);
    setEditingFileNote(file.adminNote || '');
    setEditingFileStatus(file.status);
  };

  const handleUpdateFileStatus = () => {
    if (!selectedFile) return;

    const updatedFiles = data.files.map(f => {
      if (f.id === selectedFile.id) {
        return {
          ...f,
          status: editingFileStatus,
          adminNote: editingFileNote
        };
      }
      return f;
    });

    onDataChange({ ...data, files: updatedFiles });
    setSelectedFile(null);
  };

  // --- DM MUTATIONS ---
  const activeChatCustomer = useMemo(() => {
    return data.customers.find(c => c.id === activeChatCustomerId);
  }, [data.customers, activeChatCustomerId]);

  const activeChatMessages = useMemo(() => {
    return data.messages.filter(
      m => (m.senderId === 'admin' && m.receiverId === activeChatCustomerId) ||
           (m.senderId === activeChatCustomerId && m.receiverId === 'admin')
    ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data.messages, activeChatCustomerId]);

  const pendingSyncCount = useMemo(() => {
    return data.messages.filter(m => m.syncStatus === 'PendingSync').length;
  }, [data.messages]);

  const handleSyncOfflineMessages = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updatedMessages = data.messages.map(m => {
        if (m.syncStatus === 'PendingSync') {
          return { ...m, syncStatus: 'Synced' as const };
        }
        return m;
      });
      onDataChange({
        ...data,
        messages: updatedMessages
      });
      setIsSyncing(false);
    }, 1200);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAttachmentError(null);
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setAttachmentError('Die Anhangsgröße ist auf max. 2 MB begrenzt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result as string
      });
    };
    reader.onerror = () => {
      setAttachmentError('Datei konnte nicht geladen werden.');
    };
    reader.readAsDataURL(file);
    // Clear input
    e.target.value = '';
  };

  const handleSendDM = () => {
    if ((!chatInput.trim() && !selectedAttachment) || !activeChatCustomerId) return;

    const textContent = chatInput.trim();
    // Default system text representation in case decryption keys mismatch
    const fallbackText = textContent || `Datei gesendet: ${selectedAttachment?.name}`;
    
    // Encrypt the message text
    const encryptedContent = encryptMessage(fallbackText, e2eePassphrase);

    let finalAttachment = undefined;
    if (selectedAttachment) {
      // Encrypt the attachment dataUrl using our key as well! Secure-offline-E2EE!
      const encryptedDataUrl = encryptMessage(selectedAttachment.dataUrl, e2eePassphrase);
      finalAttachment = {
        name: selectedAttachment.name,
        type: selectedAttachment.type,
        size: selectedAttachment.size,
        dataUrl: encryptedDataUrl
      };
    }

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'admin',
      receiverId: activeChatCustomerId,
      content: fallbackText, // For backward compatibility or cleartext preview toggle
      encryptedContent: encryptedContent,
      isEncrypted: true,
      timestamp: new Date().toISOString(),
      isRead: true,
      syncStatus: isOnline ? 'Synced' : 'PendingSync',
      attachment: finalAttachment
    };

    onDataChange({
      ...data,
      messages: [...data.messages, newMsg]
    });

    setChatInput('');
    setSelectedAttachment(null);
    setAttachmentError(null);
  };

  const handleDeleteMessageAdmin = (msgId: string) => {
    if (confirm('Möchten Sie diese Nachricht wirklich unwiderruflich aus dem Chatverlauf löschen?')) {
      const updatedMessages = (data.messages || []).filter(m => m.id !== msgId);
      onDataChange({
        ...data,
        messages: updatedMessages
      });
    }
  };

  const handleClearFullChatAdmin = (custId: string) => {
    if (confirm('Möchten Sie den gesamten Chatverlauf mit diesem Kunden unwiderruflich leeren? Dies löscht alle Nachrichten und hochgeladenen Chat-Dateien lokal und auf dem Server.')) {
      const updatedMessages = (data.messages || []).filter(
        m => m.senderId !== custId && m.receiverId !== custId
      );
      onDataChange({
        ...data,
        messages: updatedMessages
      });
    }
  };

  // Mark incoming customer DMs as read when opening chat
  const markMessagesAsRead = (custId: string) => {
    const updatedMessages = data.messages.map(m => {
      if (m.senderId === custId && m.receiverId === 'admin' && !m.isRead) {
        return { ...m, isRead: true };
      }
      return m;
    });
    onDataChange({ ...data, messages: updatedMessages });
  };

  const selectChat = (custId: string) => {
    setActiveChatCustomerId(custId);
    markMessagesAsRead(custId);
  };

  // Unread message indicators per customer (for Admin view badge mapping)
  const unreadPerCustomer = useMemo(() => {
    const counts: Record<string, number> = {};
    data.messages.forEach(m => {
      if (m.senderId !== 'admin' && m.receiverId === 'admin' && !m.isRead) {
        counts[m.senderId] = (counts[m.senderId] || 0) + 1;
      }
    });
    return counts;
  }, [data.messages]);

  // --- SEARCH FILTERS FOR DOCUMENTS ---
  const filteredFiles = useMemo(() => {
    return data.files.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase()) ||
                          f.customerName.toLowerCase().includes(fileSearch.toLowerCase());
      const matchCategory = fileCategoryFilter === 'all' || f.category === fileCategoryFilter;
      const matchCustomer = fileCustomerFilter === 'all' || f.customerId === fileCustomerFilter;
      return matchSearch && matchCategory && matchCustomer;
    });
  }, [data.files, fileSearch, fileCategoryFilter, fileCustomerFilter]);

  // --- RENDER SCREEN DISPATCHER ---
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Custom Top Admin bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between text-xs text-slate-300 font-sans select-none flex-shrink-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold font-mono tracking-wide text-indigo-400 text-[11px] uppercase">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded flex items-center justify-center text-white text-[8px] font-black leading-none">A</span>
            <span>Aura Backend</span>
          </div>
          <span className="text-slate-800">|</span>
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="flex items-center gap-2 hover:bg-slate-850 text-slate-200 hover:text-white px-2.5 py-1 rounded transition-all cursor-pointer font-bold text-[10px] uppercase font-mono tracking-wider border border-slate-850 bg-slate-950"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Anschauen / Frontend</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Design:</span>
            <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-bold rounded border border-indigo-900/40 text-[10px]">{activeTemplate?.name || 'Default Template'}</span>
          </div>
          <span className="text-slate-850">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-slate-450 font-semibold">Inhaber: Max Mustermann</span>
          </div>
        </div>
      </div>

      {/* WP-PLUGINS & CORE MODULES tab */}
      {activeTab === 'plugins' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>App-Zentrale</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Plugins</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 font-bold text-slate-600">Plugin-Status: Aktivierbar</span>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {/* Top Info Banner */}
            <div className="bg-[#0f172a] text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xs">
              <div className="relative z-10 max-w-2xl">
                <span className="text-[10px] font-mono tracking-wider font-bold uppercase leading-none bg-indigo-500/30 px-2.5 py-1 rounded border border-indigo-400/20 text-indigo-300">
                  Modulares Portal-Ökosystem
                </span>
                <h1 className="text-xl font-bold mt-2.5">Plugin-Zentrale</h1>
                <p className="text-slate-300 mt-1.5 text-xs leading-relaxed">
                  Aktivieren oder deaktivieren Sie Plugins nahtlos. Ein deaktiviertes Plugin verschwindet in Echtzeit vollständig aus allen Navigationsmenüs des Administrations-Backends sowie des Kunden-Frontends.
                </p>
              </div>
              <div className="z-10 px-4 py-3 bg-white/5 rounded-xl border border-white/10 font-mono text-[10px] text-slate-300 self-start md:self-auto">
                <span className="block font-bold">Standardkonfiguration:</span>
                <span className="text-xs text-white font-semibold mt-1 block">DSGVO-konform verschlüsselt</span>
              </div>
            </div>

            {/* Plugins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  key: 'appointmentsEnabled',
                  name: 'Aura Booking Pro',
                  desc: 'Integrierte Online-Terminplanung für Servicekunden mit automatischer Kalenderleitung und E-Mail-Notizen.',
                  icon: Calendar,
                  category: 'Planung & Buchung',
                  version: 'v2.1.0',
                  developer: 'Aura Core'
                },
                {
                  key: 'invoicesEnabled',
                  name: 'Aura Invoicing & Billing',
                  desc: 'System-Module für Rechnungslegung, Lastschriftvorlagen, automatische MwSt. und digitale Rechnungsverläufe.',
                  icon: Receipt,
                  category: 'Finanzwesen',
                  version: 'v1.8.4',
                  developer: 'Aura Finance'
                },
                {
                  key: 'shopEnabled',
                  name: 'Aura Inventory & Webshop (ERP)',
                  desc: 'Warenwirtschaftssystem mit digitalem Webshop, Produktlagerregalen, Warenkorb und Logistik-Schnittstellen.',
                  icon: Layers,
                  category: 'E-Commerce',
                  version: 'v3.2.1',
                  developer: 'Logistik & Sales'
                },
                {
                  key: 'blogEnabled',
                  name: 'Aura Blog & Editorial Engine',
                  desc: 'Abonnenten-Blog mit Beitragseditor zur Veröffentlichung von Vorteilsberichten, Leitfäden und Kundenkommentaren.',
                  icon: BookOpen,
                  category: 'Content-System',
                  version: 'v1.5.0',
                  developer: 'Aura Solutions'
                },
                {
                  key: 'videosEnabled',
                  name: 'Aura Media Streaming Core',
                  desc: 'Erlaubt Mandanten den datensicheren Videodateiverlauf und Upload von hochauflösendem Foto- & Videomaterial.',
                  icon: Video,
                  category: 'Multimedia',
                  version: 'v1.1.2',
                  developer: 'Vecton Studios'
                },
                {
                  key: 'botEnabled',
                  name: 'Aura AI Business Assistant',
                  desc: 'FAQ-Schnittstelle mit digitalisierbaren Frage-Antwort-Regeln, die Kundenanfragen rund um die Uhr automatisch klärt.',
                  icon: Cpu,
                  category: 'Künstliche Intelligenz',
                  version: 'v4.0.1',
                  developer: 'DeepMind Labs Local'
                },
                {
                  key: 'chatEnabled',
                  name: 'Aura Safe-Chat (E2EE/AES)',
                  desc: 'Kryptografisch gesicherter Beratungschat mit Ende-zu-Ende AES-Verschlüsselung für absolut geschützte Kommunikation.',
                  icon: MessageSquare,
                  category: 'Kryptografie & Security',
                  version: 'v2.0.0',
                  developer: 'Securo Systems'
                }
              ].map(plugin => {
                const isActivated = data.settings?.[plugin.key as keyof typeof data.settings] !== false;
                const PluginIcon = plugin.icon;
                
                return (
                  <div 
                    key={plugin.key} 
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-350 hover:shadow-xs transition-all group"
                  >
                    <div>
                      {/* Top bar with icon and category */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-xl ${isActivated ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                          <PluginIcon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md font-bold">
                          {plugin.category}
                        </span>
                      </div>

                      {/* Info */}
                      <h3 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                        {plugin.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                        <span>von {plugin.developer}</span>
                        <span>•</span>
                        <span>{plugin.version}</span>
                      </p>
                      
                      <p className="text-xs text-slate-500 leading-relaxed mt-3">
                        {plugin.desc}
                      </p>
                    </div>

                    {/* Toggle action row */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isActivated ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`}></span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isActivated ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isActivated ? 'Aktiv' : 'Deaktiviert'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleTogglePlugin(plugin.key)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg shadow-2xs cursor-pointer transition-all ${
                          isActivated 
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/40' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isActivated ? 'Deaktivieren' : 'Aktivieren'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 1. MANAGEMENT DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Kunden</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Zentrale</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Lokale Speicherung aktiv
              </div>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {/* Welcome Header */}
            <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded shadow-sm">
              <div>
                <h1 className="text-base font-bold text-slate-800">Willkommen zurück, Administrator</h1>
                <p className="text-xs text-slate-500 mt-0.5">Hier ist Ihr aktuelles Software- und CMS-Management im Überblick.</p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowLayoutCustomizer(!showLayoutCustomizer)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none outline-none ${
                    showLayoutCustomizer
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Dashboard anpassen</span>
                </button>
                <div className="px-2.5 py-1.5 bg-blue-50 text-blue-750 border border-blue-150 rounded font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>Offline-Datenbank</span>
                </div>
              </div>
            </div>

            {/* Layout Customizer Panel */}
            {showLayoutCustomizer && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 animate-slide-in space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-650" />
                      Dashboard-Widgets verwalten (Drag & Drop)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ziehen Sie die Elemente am Griff <GripVertical className="inline h-3.5 w-3.5 text-slate-400" /> nach oben oder unten, um deren Reihenfolge auf dem Dashboard einzustellen. Mit dem Augensymbol schalten Sie die Sichtbarkeit um.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowLayoutCustomizer(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 hover:bg-slate-200/50 rounded-lg cursor-pointer transition-colors"
                  >
                    Schließen
                  </button>
                </div>

                <div className="space-y-2">
                  {(data.settings?.dashboardWidgetsOrder || ['revenue', 'news', 'blog']).map((id, index) => {
                    const isVisible = (data.settings?.dashboardWidgetsVisibility?.[id] !== false);
                    let title = '';
                    let desc = '';
                    let icon = null;

                    if (id === 'revenue') {
                      title = 'Umsatzübersicht & Zahlungen';
                      desc = 'Zusammenfassung des Brutto- & Netto-Umsatzes, ausstehende Beträge und ein visueller Umsatzchart nach Rechnungen.';
                      icon = <Receipt className="w-4 h-4 text-emerald-600" />;
                    } else if (id === 'news') {
                      title = 'Kunden-News & Aktivität';
                      desc = 'Anstehende Kalendertermine, Dokumentenupload-Statistiken, Dateikategorien und ein Aktivitätsverlauf.';
                      icon = <Users className="w-4 h-4 text-blue-600" />;
                    } else if (id === 'blog') {
                      title = 'Blog-Statistiken (Themen-Trendanalyse)';
                      desc = 'Visualisierung der Beitrags-Schlagworte im Recharts Säulendiagramm und interaktive Keyword-Wolke.';
                      icon = <BookOpen className="w-4 h-4 text-indigo-650" />;
                    }

                    const isDragged = localDraggedWidgetId === id;
                    const isOver = localDragOverWidgetId === id;

                    return (
                      <div
                        key={id}
                        draggable
                        onDragStart={() => handleWidgetDragStart(id)}
                        onDragOver={(e) => handleWidgetDragOver(e, id)}
                        onDrop={() => handleWidgetDrop(id)}
                        onDragEnd={() => {
                          setLocalDraggedWidgetId(null);
                          setLocalDragOverWidgetId(null);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          isDragged
                            ? 'bg-indigo-50/60 border-indigo-300 opacity-50 scale-[0.98]'
                            : isOver
                              ? 'bg-slate-100 border-indigo-500 border-dashed scale-[1.01] shadow-2xs'
                              : 'bg-white border-slate-200 shadow-3xs hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-center">
                            {icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                              {title}
                              {!isVisible && (
                                <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase">Verborgen</span>
                              )}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleWidgetVisibility(id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                              isVisible
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-150 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={isVisible ? 'Widget ausblenden' : 'Widget einblenden'}
                          >
                            {isVisible ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Quick Metrics Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Aktive Kunden</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{data.customers.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
              <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Verträge & Dateien</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {data.files.filter(f => f.category === 'Vertrag').length} / {data.files.length}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
              <div className="p-3.5 bg-pink-50 text-pink-600 rounded-xl">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Kunden-Videos</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {data.files.filter(f => f.category === 'Video').length} uploaded
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Ungelesene Chats</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {(Object.values(unreadPerCustomer) as number[]).reduce((a,b) => a+b, 0)} Nachrichten
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Draggable & Hideable Widgets Deck */}
          <div className="space-y-6">
            {(data.settings?.dashboardWidgetsOrder || ['revenue', 'news', 'blog']).map((widgetId) => {
              const isVisible = (data.settings?.dashboardWidgetsVisibility?.[widgetId] !== false);
              if (!isVisible) return null;

              if (widgetId === 'revenue') {
                return (
                  <div
                    key="widget-revenue"
                    draggable
                    onDragStart={() => handleWidgetDragStart('revenue')}
                    onDragOver={(e) => handleWidgetDragOver(e, 'revenue')}
                    onDrop={() => handleWidgetDrop('revenue')}
                    onDragEnd={() => {
                      setLocalDraggedWidgetId(null);
                      setLocalDragOverWidgetId(null);
                    }}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                      localDraggedWidgetId === 'revenue'
                        ? 'bg-indigo-50/40 border-indigo-300 opacity-50 scale-[0.99] border-dashed ring-2 ring-indigo-500/10'
                        : localDragOverWidgetId === 'revenue'
                          ? 'border-indigo-500 border-dashed bg-slate-50 scale-[1.01] shadow-md'
                          : 'border-slate-200/60 hover:border-slate-350 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <span className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 flex-shrink-0" title="Ziehen zum Neuanordnen">
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                            <Receipt className="h-5 w-5 text-emerald-600" />
                            Finanzieller Umsatz & Rechnungsstatistik (Umsatzübersicht)
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">Analytische Auswertung aller gebuchten Lizenzen & ERP-Käufe</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold tracking-wide px-2.5 py-1 rounded-lg border border-emerald-200/60 uppercase">
                          Finanzwesen
                        </span>
                      </div>
                    </div>

                    {/* Calculations */}
                    {(() => {
                      const invoicesVal = data.invoices || [];
                      const totalGrossPaid = invoicesVal
                        .filter(i => i.status === 'Bezahlt')
                        .reduce((sum, i) => sum + i.amount, 0);
                      const totalNetPaid = invoicesVal
                        .filter(i => i.status === 'Bezahlt')
                        .reduce((sum, i) => sum + i.netAmount, 0);
                      const openGross = invoicesVal
                        .filter(i => i.status === 'Offen' || i.status === 'Überfällig')
                        .reduce((sum, i) => sum + i.amount, 0);
                      
                      const allGrossVolume = invoicesVal.reduce((sum, i) => sum + i.amount, 0);
                      const paidPercentage = allGrossVolume > 0 ? (totalGrossPaid / allGrossVolume) * 100 : 100;

                      // Chart projection over time (using issue dates)
                      const monthlyRevenue: Record<string, number> = {};
                      invoicesVal.forEach(inv => {
                        if (!inv.issueDate) return;
                        const month = inv.issueDate.substring(0, 7); // YYYY-MM
                        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.netAmount;
                      });

                      const chartData = Object.entries(monthlyRevenue)
                        .map(([name, value]) => ({ name, value }))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .slice(-6); // last 6 months

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Left stats columns */}
                          <div className="space-y-3 flex flex-col justify-between">
                            <div className="space-y-3">
                              {/* Stat 1: Total Paid Net */}
                              <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-100 flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Netto Einnahmen (bezahlt)</p>
                                  <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                                    {totalNetPaid.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                  </p>
                                </div>
                                <span className="p-2 bg-emerald-100 text-emerald-750 rounded-lg font-bold text-xs">Net</span>
                              </div>

                              {/* Stat 2: Total Paid Gross */}
                              <div className="p-4 bg-indigo-50/20 rounded-xl border border-indigo-100 flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Brutto Umsatz (bezahlt)</p>
                                  <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                                    {totalGrossPaid.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                  </p>
                                </div>
                                <span className="p-2 bg-indigo-100 text-indigo-750 text-xs font-bold rounded-lg">Brut</span>
                              </div>

                              {/* Stat 3: Open Volume */}
                              <div className="p-4 bg-amber-50/20 rounded-xl border border-amber-100 flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Ausstehendes Volumen</p>
                                  <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                                    {openGross.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                  </p>
                                </div>
                                <span className="p-2 bg-amber-100 text-amber-755 text-xs font-bold rounded-lg">Offen</span>
                              </div>
                            </div>

                            {/* Paid ratio bar */}
                            <div className="space-y-1.5 p-1 mt-2">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-500">Realisiertes Umsatzverhältnis</span>
                                <span className="font-mono text-slate-800 font-bold">{paidPercentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${paidPercentage}%` }}></div>
                              </div>
                            </div>
                          </div>

                          {/* Right graphics dashboard (Recharts) */}
                          <div className="lg:col-span-2 bg-slate-50 border border-slate-150 p-5 rounded-2xl h-72">
                            <p className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-4 flex items-center justify-between">
                              <span>Umsatzentwicklung über Monate (Netto-Umsatz)</span>
                              <span className="text-[9px] font-mono normal-case bg-indigo-100 text-indigo-750 px-2 rounded">Gesamt: {invoicesVal.length} Rechnungen</span>
                            </p>
                            {chartData.length > 0 ? (
                              <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={chartData}>
                                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip 
                                      formatter={(val: number) => {
                                        return [val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }), 'Netto-Umsatz'];
                                      }}
                                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                                    />
                                    <Bar dataKey="value" fill="#10b981" name="Umsatz">
                                      {chartData.map((entry, index) => (
                                        <Cell 
                                          key={`cell-${index}`} 
                                          fill={index === chartData.length - 1 ? '#059669' : '#10b981'} 
                                        />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            ) : (
                              <div className="h-44 flex items-center justify-center text-center text-xs text-slate-400">
                                <span>Keine Umsatzdaten für grafische Darstellung verfügbar.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              }

              if (widgetId === 'news') {
                return (
                  <div
                    key="widget-news"
                    draggable
                    onDragStart={() => handleWidgetDragStart('news')}
                    onDragOver={(e) => handleWidgetDragOver(e, 'news')}
                    onDrop={() => handleWidgetDrop('news')}
                    onDragEnd={() => {
                      setLocalDraggedWidgetId(null);
                      setLocalDragOverWidgetId(null);
                    }}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                      localDraggedWidgetId === 'news'
                        ? 'bg-indigo-50/40 border-indigo-300 opacity-50 scale-[0.99] border-dashed ring-2 ring-indigo-500/10'
                        : localDragOverWidgetId === 'news'
                          ? 'border-indigo-500 border-dashed bg-slate-50 scale-[1.01] shadow-md'
                          : 'border-slate-200/60 hover:border-slate-350 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <span className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 flex-shrink-0" title="Ziehen zum Neuanordnen">
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                            <Users className="h-5 w-5 text-blue-600" />
                            Kunden-News & Aktivität (Recent Feed)
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">Analytischer Aktivitätsverlauf und anstehende Termine</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-blue-50 text-blue-750 font-mono font-bold tracking-wide px-2.5 py-1 rounded-lg border border-blue-200/60 uppercase">
                          Kundenaktivität
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Native SVG Visualization: File category ratio & weekly progression */}
                      <div className="lg:col-span-2 bg-slate-55/40 p-5 rounded-2xl border border-slate-150">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Dokumentenuploads & Aktivitätsverlauf</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Visuelle Übersicht aller hochgeladenen Client-Dateien</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-white rounded-lg text-slate-500 border border-slate-200">Letzte 30 Tage</span>
                        </div>
                        
                        {/* Animated custom SVG representation */}
                        <div className="h-56 flex flex-col justify-end p-2 bg-white rounded-xl border border-slate-150/50">
                          <div className="flex items-end justify-around h-36 border-b border-slate-150 pb-2 font-mono text-[9px] text-slate-400">
                            <div className="flex flex-col items-center group w-12">
                              <div className="w-8 bg-blue-500 rounded-t-lg h-24 hover:bg-blue-600 transition-all flex items-center justify-center text-white text-[9px] font-bold">
                                {data.files.filter(f => f.category === 'Vertrag').length}
                              </div>
                              <span className="mt-2 text-[10px] font-sans font-medium text-slate-500">Verträge</span>
                            </div>

                            <div className="flex flex-col items-center group w-12">
                              <div className="w-8 bg-pink-500 rounded-t-lg h-16 hover:bg-pink-650 transition-all flex items-center justify-center text-white text-[9px] font-bold">
                                {data.files.filter(f => f.category === 'Video').length}
                              </div>
                              <span className="mt-2 text-[10px] font-sans font-medium text-slate-500">Videos</span>
                            </div>

                            <div className="flex flex-col items-center group w-12">
                              <div className="w-8 bg-emerald-500 rounded-t-lg h-12 hover:bg-emerald-650 transition-all flex items-center justify-center text-white text-[9px] font-bold">
                                {data.files.filter(f => f.category === 'Datei').length}
                              </div>
                              <span className="mt-2 text-[10px] font-sans font-medium text-slate-500">Dateien</span>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between text-[10px] text-slate-400 px-2 font-mono">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-2.5 h-2.5 bg-blue-500 rounded-lg inline-block"></span>
                              <span>Rechtliche Verträge</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className="w-2.5 h-2.5 bg-pink-500 rounded-lg inline-block"></span>
                              <span>Videoberatungen</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-lg inline-block"></span>
                              <span>Zusatzdokumente</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick action checklist / recent logs */}
                      <div className="bg-slate-55/40 p-5 rounded-2xl border border-slate-150">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-4">Anstehende Termine</h4>
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                          {data.appointments.length > 0 ? (
                            data.appointments.slice(0, 3).map(appt => {
                              const client = data.customers.find(c => c.id === appt.customerId);
                              return (
                                <div key={appt.id} className="p-3 bg-white rounded-xl border border-slate-150 flex items-start space-x-2.5 hover:bg-slate-50 transition-colors">
                                  <Calendar className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 truncate">{appt.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{appt.description}</p>
                                    <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                                      <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/40">
                                        {appt.date} • {appt.time} Uhr
                                      </span>
                                      {client && (
                                        <span className="text-[9.5px] text-slate-400 truncate max-w-24">({client.name})</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-slate-400 py-10 text-center">Keine Termine geplant.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pending Document Upload Review List */}
                    <div className="mt-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Ungeprüfte Kundendokumente / Freigaben</h4>
                        <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-mono font-bold px-2 py-0.5 rounded uppercase">Dringend</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-mono uppercase">
                              <th className="py-2.5 px-3 font-bold">Kunde</th>
                              <th className="py-2.5 px-3 font-bold">Dateiname</th>
                              <th className="py-2.5 px-3 font-bold">Kategorie</th>
                              <th className="py-2.5 px-3 font-bold">Upload-Datum</th>
                              <th className="py-2.5 px-3 font-bold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {data.files.filter(f => f.status === 'Eingereicht').length > 0 ? (
                              data.files.filter(f => f.status === 'Eingereicht').slice(0, 5).map(file => (
                                <tr key={file.id} className="hover:bg-white/60 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-800">{file.customerName}</td>
                                  <td className="py-2.5 px-3 font-medium text-slate-600 truncate max-w-[124px]">{file.name}</td>
                                  <td className="py-2.5 px-3">
                                    <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                      file.category === 'Vertrag' ? 'bg-blue-50 text-blue-700' :
                                      file.category === 'Video' ? 'bg-pink-50 text-pink-700' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                      {file.category}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                                    {new Date(file.uploadDate).toLocaleDateString('de-DE')}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="inline-flex items-center space-x-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/50">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Ungeprüft</span>
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                                  Alle eingereichten Dateien wurden bearbeitet und freigegeben!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              }

              if (widgetId === 'blog') {
                return (
                  <div
                    key="widget-blog"
                    draggable
                    onDragStart={() => handleWidgetDragStart('blog')}
                    onDragOver={(e) => handleWidgetDragOver(e, 'blog')}
                    onDrop={() => handleWidgetDrop('blog')}
                    onDragEnd={() => {
                      setLocalDraggedWidgetId(null);
                      setLocalDragOverWidgetId(null);
                    }}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                      localDraggedWidgetId === 'blog'
                        ? 'bg-indigo-50/40 border-indigo-300 opacity-50 scale-[0.99] border-dashed ring-2 ring-indigo-500/10'
                        : localDragOverWidgetId === 'blog'
                          ? 'border-indigo-500 border-dashed bg-slate-50 scale-[1.01] shadow-md'
                          : 'border-slate-200/60 hover:border-slate-350 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <span className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 flex-shrink-0" title="Ziehen zum Neuanordnen">
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                            <BarChart3 className="h-5 w-5 text-indigo-650" />
                            Blog-Statistiken (Schlagwort-Trendanalyse & Themenverteilung)
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Auswertung der Themenplatzierungen im Blog zur Erkennung aktiver Client-Interessen.
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onTabChange('blog')}
                        className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Tag className="h-3.5 w-3.5" /> Schlagworte verwalten
                      </button>
                    </div>

                    {(() => {
                      const postsVal = data.blogPosts || [];
                      const counts: Record<string, number> = {};
                      postsVal.forEach(p => {
                        if (!p.category) return;
                        p.category.split(',').forEach(tag => {
                          const cleaned = tag.trim();
                          if (!cleaned) return;
                          counts[cleaned] = (counts[cleaned] || 0) + 1;
                        });
                      });
                      const tagStats = Object.entries(counts)
                        .map(([name, value]) => ({ name, value }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 8);

                      return tagStats.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Recharts Bar Chart */}
                          <div className="lg:col-span-2 bg-slate-50 border border-slate-100 p-5 rounded-2xl h-72">
                            <p className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-4">
                              Häufigkeitsverteilung (Recharts)
                            </p>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={tagStats}>
                                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                  />
                                  <Bar dataKey="value" fill="#4f46e5" name="Häufigkeit animate-pulse">
                                    {tagStats.map((entry, index) => (
                                      <Cell 
                                        key={`cell-${index}`} 
                                        fill={index === 0 ? '#4f46e5' : index === 1 ? '#6366f1' : index === 2 ? '#818cf8' : '#a5b4fc'} 
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Interactive Schlagwortwolke */}
                          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
                            <div>
                              <p className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">
                                Interaktive Themenwolke
                              </p>
                              <p className="text-xs text-slate-500 mb-4 leading-normal">
                                Klicken Sie auf ein Schlagwort, um direkt im Blog-Feed danach zu filtern.
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {tagStats.map(({ name, value }) => {
                                  // Dynamic rendering size depending on weight
                                  const sizeClass = value > 3 ? 'text-sm font-black text-indigo-700 bg-indigo-100/70 border-indigo-200' :
                                                    value > 1 ? 'text-xs font-bold text-slate-700 bg-slate-200/60 border-slate-300' :
                                                    'text-[11px] font-medium text-slate-500 bg-slate-100 border-slate-200';
                                  return (
                                    <button
                                      key={name}
                                      onClick={() => {
                                        onTabChange('blog');
                                      }}
                                      className={`px-3 py-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 ${sizeClass}`}
                                      title={`${value} Beiträge mit diesem Schlagwort`}
                                    >
                                      <Tag className="h-3 w-3 opacity-60" />
                                      <span>{name}</span>
                                      <span className="text-[9px] opacity-50 font-mono">({value})</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="mt-4 p-3.5 bg-indigo-50 text-indigo-950 border border-indigo-100 rounded-xl text-[11px] leading-relaxed flex gap-2">
                              <Sparkles className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                              <span>
                                <strong>Trend:</strong> Das Thema <span className="font-bold text-indigo-700">{tagStats[0]?.name}</span> verzeichnet das größte aktuelle Interesse gefolgt von <span className="font-bold text-indigo-700">{tagStats[1]?.name || 'n.a.'}</span>.
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-10 font-mono">
                          Noch keine Blog-Schlagworte erfasst. Legen Sie im Blog Beiträge mit Schlagworten an.
                        </p>
                      );
                    })()}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div></div>
      )}

      {/* 2. KUNDENVERWALTUNG (DIRECTORY & CREATION) */}
      {activeTab === 'customers' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Kunden</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Verzeichnis</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleOpenCustomerModal()}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Neuen Kunden anlegen</span>
              </button>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {/* Action Bar & Stats */}
            <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Mandanten-Suche</p>
              <div className="flex items-center space-x-3 bg-slate-100 border border-slate-200 rounded px-3 py-1.5 w-full max-w-md">
                <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Kunde oder Firma..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-mono uppercase">
                    <th className="py-3 px-4 font-bold">Kunde & Unternehmen</th>
                    <th className="py-3 px-4 font-bold">Benutzername (Login)</th>
                    <th className="py-3 px-4 font-bold">E-Mail & Telefon</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Anmeldedatum</th>
                    <th className="py-3 px-4 font-bold text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {data.customers
                    .filter(c => 
                      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      c.company.toLowerCase().includes(customerSearch.toLowerCase())
                    )
                    .map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-800">{cust.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{cust.company}</p>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-blue-600 bg-blue-50/20 px-2.5 py-1 rounded-lg">
                          {cust.username}
                        </td>
                        <td className="py-4 px-4 text-xs font-mono">
                          <p className="font-sans text-slate-600 font-medium">{cust.email}</p>
                          <p className="text-slate-400 mt-0.5">{cust.phone || 'Keine Telefonnummer'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                            cust.status === 'Stammkunde' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' :
                            cust.status === 'Neukunde' ? 'bg-blue-50 text-blue-600 border-blue-200/50' :
                            cust.status === 'Aktiv' ? 'bg-indigo-50 text-indigo-600 border-indigo-200/50' :
                            'bg-slate-50 text-slate-600 border-slate-200/50'
                          }`}>
                            {cust.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-mono text-xs">
                          {new Date(cust.createdAt).toLocaleDateString('de-DE')}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                if (onSimulateCustomer) onSimulateCustomer(cust.id);
                              }}
                              className="p-1.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
                              title="Dieses Kundenportal live simulieren (Frontend)"
                            >
                              <ExternalLink className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => setSelectedCustForContracts(cust)}
                              className="p-1.5 hover:bg-slate-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                              title="Verträge & Policen dieses Kunden sichten"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleOpenCustomerModal(cust)}
                              className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                              title="Kundenkonto bearbeiten"
                            >
                              <Edit2 className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Kunde permanent löschen"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CUSTOMER MODAL (CREATE / EDIT) */}
          {isCustomerModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-scale-up">
                <div className="p-6 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center">
                  <h3 className="text-lg font-bold">
                    {selectedCustomer ? 'Kundenkonto bearbeiten' : 'Neues Kundenkonto anlegen'}
                  </h3>
                  <button
                    onClick={() => setIsCustomerModalOpen(false)}
                    className="text-slate-400 hover:text-white transition-opacity font-bold font-mono text-lg p-2 leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Voller Name*</label>
                      <input
                        type="text"
                        placeholder="z.B. Max Mustermann"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Firma / Unternehmen</label>
                      <input
                        type="text"
                        placeholder="z.B. Muster GmbH"
                        value={customerForm.company}
                        onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">E-Mail*</label>
                      <input
                        type="email"
                        placeholder="kunde@firmendomain.de"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Telefonnummer</label>
                      <input
                        type="text"
                        placeholder="+49 89 123456"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Adresse</label>
                    <input
                      type="text"
                      placeholder="Straße, Hausnummer, PLZ & Ort"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Portal Login: Benutzername*</label>
                      <input
                        type="text"
                        placeholder="z.B. max.muster"
                        value={customerForm.username}
                        onChange={(e) => setCustomerForm({ ...customerForm, username: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">
                        {selectedCustomer ? 'Passwort überschreiben' : 'Anfangs-Passwort*'}
                      </label>
                      <input
                        type="password"
                        placeholder={selectedCustomer ? 'Unverändert lassen' : 'kunde123'}
                        value={customerForm.password}
                        onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Kunden-Klassifizierung</label>
                      <select
                        value={customerForm.status}
                        onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value as Customer['status'] })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      >
                        <option value="Neukunde">Neukunde (Default)</option>
                        <option value="Stammkunde">Stammkunde</option>
                        <option value="Aktiv">Aktiv</option>
                        <option value="Inaktiv">Inaktiv</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Consulting- & Projektphase</label>
                      <select
                        value={customerForm.activePhase}
                        onChange={(e) => setCustomerForm({ ...customerForm, activePhase: parseInt(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      >
                        <option value={1}>Phase 1: Erstgespräch & Briefing</option>
                        <option value={2}>Phase 2: Audit & Datenanalyse</option>
                        <option value={3}>Phase 3: Strategie-Entwurf</option>
                        <option value={4}>Phase 4: Umsetzung & Medienbearbeitung</option>
                        <option value={5}>Phase 5: Abschluss & Auswertung</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Interne CMS Notizen</label>
                    <textarea
                      placeholder="Besonderheiten, Lizenzkonditionen, Video-Feedback-Frequenz..."
                      rows={3}
                      value={customerForm.notes}
                      onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* INTERACTIVE ROADMAP MEILENSTEINE PLANNER */}
                  <div className="bg-slate-50/60 p-4.5 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/30 p-3.5 rounded-xl border border-indigo-100/50">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          <span>Fahrplan für Mandanten freischalten (Scharf schalten)</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Bestimmen Sie, ob dieser Kunde seine interaktive Schritt-für-Schritt-Roadmap einsehen kann.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setCustomerForm({ ...customerForm, roadmapEnabled: !customerForm.roadmapEnabled })}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            customerForm.roadmapEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              customerForm.roadmapEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">
                        Ruhestands- oder Consulting-Schablone (Template) auswählen
                      </label>
                      <select
                        value={customerForm.roadmapTemplateId}
                        onChange={(e) => setCustomerForm({ ...customerForm, roadmapTemplateId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-indigo-500 transition-colors"
                      >
                        {allTemplates.map((tpl) => (
                          <option key={tpl.id} value={tpl.id}>
                            {tpl.name} ({tpl.description})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 font-mono">Phasen-Meilensteine & Aufgaben-Checkliste</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        Hier können Sie den Fortschritt des Kunden steuern. To-dos werden direkt abgehakt oder Phasen freigeschaltet.
                      </p>
                    </div>

                    {/* Predefined milestones grouped by phase */}
                    <div className="space-y-3 pt-1">
                      {([1, 2, 3, 4, 5] as const).map((ph) => {
                        const activeTemplate = allTemplates.find(t => t.id === customerForm.roadmapTemplateId) || allTemplates[0];
                        const phaseDetails = activeTemplate.phases.find(p => p.phase === ph);
                        const phaseName = `Phase ${ph}: ${phaseDetails ? phaseDetails.title : 'Beratungsschritt'}`;

                        const phaseTasks = activeTemplate.tasks.filter(t => t.phase === ph);
                        const completedInPhase = phaseTasks.filter(t => customerForm.completedTasks.includes(t.id)).length;
                        const isCurrentActive = customerForm.activePhase === ph;

                        return (
                          <div 
                            key={ph} 
                            className={`rounded-xl border p-3.5 bg-white transition-all ${
                              isCurrentActive ? 'border-indigo-400 ring-2 ring-indigo-50/50 bg-indigo-50/10' : 'border-slate-150'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-dashed border-slate-100">
                              <span className={`text-[11px] font-bold ${isCurrentActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                                {phaseName} {isCurrentActive && '📍'}
                              </span>
                              
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded">
                                  {completedInPhase} / {phaseTasks.length} To-dos
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCustomerForm({ ...customerForm, activePhase: ph })}
                                  className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                                    isCurrentActive 
                                      ? 'bg-indigo-600 text-white border border-indigo-650 shadow-xs' 
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {isCurrentActive ? 'Aktiv' : 'Aktivieren'}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 pl-1.5">
                              {phaseTasks.map(task => {
                                const isChecked = customerForm.completedTasks.includes(task.id);
                                return (
                                  <label 
                                    key={task.id} 
                                    className="flex items-start gap-2 text-[11px] font-sans text-slate-600 hover:text-slate-800 transition-colors cursor-pointer select-none"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        let updated: string[];
                                        if (isChecked) {
                                          updated = customerForm.completedTasks.filter(id => id !== task.id);
                                        } else {
                                          updated = [...customerForm.completedTasks, task.id];
                                        }
                                        setCustomerForm({ ...customerForm, completedTasks: updated });
                                      }}
                                      className="mt-0.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 w-3.5 h-3.5 shrink-0"
                                    />
                                    <div>
                                      <span className={isChecked ? 'line-through text-slate-400 font-medium' : 'font-medium text-slate-700'}>
                                        {task.title}
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                                        Rolle: <strong className={task.role === 'Berater' ? 'text-blue-600' : 'text-slate-500'}>
                                          {task.role === 'Berater' ? 'Tatjana (Sie)' : task.role === 'Kunde' ? 'Kunde (Mandant)' : 'Zusammenarbeit'}
                                        </strong>
                                      </span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCustomerModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors duration-200 font-medium text-sm"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveCustomer}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all duration-200 text-sm"
                  >
                    Konto speichern
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER CONTRACTS OVERVIEW MODAL (EYE ICON CLICK) */}
          {selectedCustForContracts && (
            <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="admin-cust-contracts-modal">
              <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header Banner */}
                <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <ShieldCheck className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[10px] bg-emerald-500/25 text-emerald-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-400/20 uppercase">
                        VERTRAGSMAPPE (ADMIN-SICHT)
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        Verträge von {selectedCustForContracts.name} {selectedCustForContracts.company && `(${selectedCustForContracts.company})`}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustForContracts(null)}
                    className="text-slate-400 hover:text-white font-bold font-mono text-xl leading-none p-2 cursor-pointer transition-colors border-none bg-transparent"
                  >
                    ×
                  </button>
                </div>

                {/* Scrollable Contents */}
                <div className="p-6 overflow-y-auto space-y-6">
                  
                  {/* General CMS Metadata */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-150 flex items-start gap-3">
                    <span className="text-emerald-750 text-base">🛡️</span>
                    <div className="text-xs text-slate-650 leading-relaxed">
                      <strong>Service-Lizenzüberwachung:</strong> Die folgenden Abonnements- & Lizenzen-Daten von <strong>{selectedCustForContracts.name}</strong> sind auf dem neuesten aktiven Stand. Als Administrator können Sie diese einsehen und bei Support-Bedarf direkt reagieren.
                    </div>
                  </div>

                  {/* Portfolio KPI summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-[9px] uppercase font-mono text-slate-400 font-bold">Aktive Module</p>
                        <h4 className="text-sm font-bold text-slate-800">5 Verträge</h4>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex items-center gap-3">
                      <Euro className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-[9px] uppercase font-mono text-slate-400 font-bold">Laufende Jahresgebühr</p>
                        <h4 className="text-sm font-bold text-slate-800">1.840,05 €</h4>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-[9px] uppercase font-mono text-slate-400 font-bold">Einstufung & Schutz</p>
                        <h4 className="text-sm font-bold text-emerald-700">Rundum optimiert</h4>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Contracts Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-650 min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3 font-bold">Anwendung & Lizenzbereich</th>
                            <th className="px-4 py-3 font-bold">Server / Host</th>
                            <th className="px-4 py-3 font-bold">Lizenznummer</th>
                            <th className="px-4 py-3 text-right font-bold">Beitrag</th>
                            <th className="px-4 py-3 text-center font-bold">Status</th>
                            <th className="px-4 py-3 text-right font-bold">Aktionen</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {getPlausibleContracts(selectedCustForContracts).map((contract) => (
                            <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-[10px] shrink-0 border border-emerald-100/60 font-mono">
                                    {contract.name.substring(0, 3).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-800 text-xs block">{contract.name}</span>
                                    <span className="text-[10px] text-slate-400 block font-mono leading-none mt-0.5">{contract.scope}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-705 font-semibold">{contract.insurer}</td>
                              <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{contract.policyNumber}</td>
                              <td className="px-4 py-3.5 text-right font-bold font-mono text-slate-800 whitespace-nowrap">
                                {contract.premium.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} <span className="text-[9px] text-slate-450 font-normal font-sans">/ {contract.paymentInterval}</span>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border bg-emerald-50 text-emerald-700 border-emerald-150">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                                  {contract.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedAdminDetailPolicy(contract)}
                                  className="px-2.5 py-1 text-slate-700 hover:text-white border border-slate-200 hover:bg-slate-900 rounded-lg text-[10px] font-bold shadow-3xs transition-all flex items-center gap-1 cursor-pointer bg-white"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Details sichten</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChatCustomerId(selectedCustForContracts.id);
                      onTabChange && onTabChange('messages');
                      setSelectedCustForContracts(null);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 border-none"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat mit {selectedCustForContracts.name} öffnen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCustForContracts(null)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Schließen
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ADMIN ACTION: CONTRACT DETAILS MODAL */}
          {selectedAdminDetailPolicy && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-55 flex items-center justify-center p-4 animate-fade-in" id="admin-policy-details-modal">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-400/20 uppercase">
                        POLICENDETAILS
                      </span>
                      <h4 className="text-sm font-bold mt-0.5">
                        {selectedAdminDetailPolicy.name}
                      </h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAdminDetailPolicy(null)}
                    className="text-slate-400 hover:text-white font-bold text-xl leading-none p-3 cursor-pointer border-none bg-transparent"
                  >
                    ×
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Beitrag</span>
                      <strong className="text-xs text-slate-800 font-mono font-black">
                        {selectedAdminDetailPolicy.premium.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </strong>
                      <span className="text-[9px] text-slate-450 block font-normal">pro {selectedAdminDetailPolicy.paymentInterval}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Selbstbehalt</span>
                      <strong className="text-xs text-slate-800 font-mono font-semibold">
                        {selectedAdminDetailPolicy.deductible}
                      </strong>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Deckungssumme</span>
                      <strong className="text-xs text-indigo-700 font-semibold block">
                        {selectedAdminDetailPolicy.coverage.split(' ')[0]}
                      </strong>
                      <span className="text-[8px] text-slate-450 font-mono uppercase block truncate">
                        {selectedAdminDetailPolicy.coverage.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Hauptfälligkeit</span>
                      <strong className="text-xs text-slate-800 font-mono font-semibold">
                        {new Date(selectedAdminDetailPolicy.mainDueDate).toLocaleDateString('de-DE')}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 space-y-3">
                      <h5 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide border-b pb-2">
                        Wichtige Leistungskomponenten
                      </h5>
                      <ul className="space-y-2">
                        {selectedAdminDetailPolicy.details.map((detail: string, index: number) => (
                          <li key={index} className="flex items-start gap-2.5 text-xs text-slate-650 leading-relaxed font-sans">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-5 bg-slate-50/65 p-4 rounded-xl border border-slate-150 space-y-3">
                      <h5 className="text-[10px] font-bold text-indigo-905 font-mono uppercase tracking-wider border-b pb-2">
                        Stammdaten der Police
                      </h5>
                      <div className="space-y-2 text-xs font-sans">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-400 text-[11px]">Risikoträger:</span>
                          <strong className="text-slate-800 text-right font-medium">{selectedAdminDetailPolicy.insurer}</strong>
                        </div>
                        <div className="flex justify-between border-b pb-1 font-mono text-[11px]">
                          <span className="text-slate-400">Schein-Nr:</span>
                          <strong className="text-slate-850">{selectedAdminDetailPolicy.policyNumber}</strong>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-400 text-[11px]">Geltungsbereich:</span>
                          <strong className="text-slate-800 text-right font-medium">{selectedAdminDetailPolicy.scope}</strong>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Abrechnung:</span>
                          <span className="text-slate-800 font-semibold">{selectedAdminDetailPolicy.billingMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer close */}
                <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedAdminDetailPolicy(null)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Zurück zur Übersicht
                  </button>
                </div>

              </div>
            </div>
          )}
        </div></div>
      )}

      {/* 3. DOKUMENTEN-ZENTRALE / ARCHIV */}
      {activeTab === 'files' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Kunden</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Dokumenten-Zentrale</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold border border-indigo-150">
                {filteredFiles.length} DATEIEN INSGESAMT
              </span>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {/* Aggregated Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-2 border border-slate-200 rounded shadow-sm">
              <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded px-2.5 py-1">
                <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Projekt/Datei..."
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
                />
              </div>

              <div>
                <select
                  value={fileCategoryFilter}
                  onChange={(e) => setFileCategoryFilter(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-slate-700 focus:bg-white transition-colors"
                >
                  <option value="all">Kategorie: Alle</option>
                  <option value="Vertrag">Kategorie: Verträge</option>
                  <option value="Video">Kategorie: Videos</option>
                  <option value="Datei">Kategorie: Zusatzdateien</option>
                </select>
              </div>

              <div>
                <select
                  value={fileCustomerFilter}
                  onChange={(e) => setFileCustomerFilter(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-slate-700 focus:bg-white transition-colors"
                >
                  <option value="all">Mandant: Alle Kunden</option>
                  {data.customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

            <div className="flex items-center justify-end font-mono text-xs text-slate-400 font-bold self-center">
              Treffer: {filteredFiles.length} Dokumente
            </div>
          </div>

          {/* Files Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredFiles.length > 0 ? (
              filteredFiles.map(file => {
                const isContract = file.category === 'Vertrag';
                const isVideo = file.category === 'Video';
                return (
                  <div key={file.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-5 flex-1 space-y-4">
                      {/* Brand Label Header */}
                      <div className="flex justify-between items-start">
                        <span className={`inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isContract ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                          isVideo ? 'bg-pink-50 text-pink-700 border-pink-200/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                        }`}>
                          {file.category}
                        </span>

                        <span className={`inline-flex items-center text-[10px] uppercase font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                          file.status === 'Genehmigt' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' :
                          file.status === 'In Bearbeitung' ? 'bg-amber-50 text-amber-600 border-amber-200/50' :
                          file.status === 'Abgelehnt' ? 'bg-rose-50 text-rose-600 border-rose-200/50' :
                          'bg-slate-50 text-slate-600 border-slate-200/50'
                        }`}>
                          {file.status}
                        </span>
                      </div>

                      {/* Icon & Details */}
                      <div className="flex items-start space-x-3.5">
                        <div className={`p-3 rounded-xl ${
                          isContract ? 'bg-blue-100/40 text-blue-600' :
                          isVideo ? 'bg-pink-100/40 text-pink-600' : 'bg-emerald-100/40 text-emerald-600'
                        }`}>
                          {isContract ? <FileText className="h-6 w-6" /> :
                           isVideo ? <Video className="h-6 w-6" /> : <File className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">Kunde: <span className="font-semibold text-slate-600">{file.customerName}</span></p>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/40 space-y-1 text-xs text-slate-500 font-mono">
                        <div className="flex justify-between">
                          <span>Größe:</span>
                          <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eingereicht am:</span>
                          <span>{new Date(file.uploadDate).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>

                      {/* Admin Note display */}
                      {file.adminNote && (
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-slate-600 text-xs italic">
                          <strong>Admin Feedback:</strong> {file.adminNote}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100/80 flex items-center justify-between">
                      <button
                        onClick={() => handleSelectFile(file)}
                        className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Status & Notiz bearbeiten</span>
                      </button>
                      
                      {file.dataUrl ? (
                        <a
                          href={file.dataUrl}
                          download={file.name}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Echte Datei herunterladen"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          onClick={() => alert(`Simulierter Download für: ${file.name}`)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Simulierter Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-16 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-semibold">Keine hochgeladenen Dokumente zu diesen Kriterien gefunden.</p>
              </div>
            )}
          </div>

          {/* EDIT DOCUMENT FREIGABE STATUS MODAL */}
          {selectedFile && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-up">
                <div className="p-6 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center">
                  <h3 className="text-lg font-bold">Dokumentenprüfung & Feedback</h3>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-400 hover:text-white transition-opacity font-bold font-mono text-lg p-2 leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-mono space-y-1">
                    <p><strong>Datei:</strong> {selectedFile.name}</p>
                    <p><strong>Eingereicht von:</strong> {selectedFile.customerName}</p>
                    <p><strong>Format:</strong> {selectedFile.type}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-15 font-mono">Freigabe-Status</label>
                    <div className="grid grid-cols-4 gap-2.5 mt-2">
                      {(['Eingereicht', 'In Bearbeitung', 'Genehmigt', 'Abgelehnt'] as const).map(status => {
                        const isSelected = editingFileStatus === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setEditingFileStatus(status)}
                            className={`px-3 py-2 text-xs rounded-xl font-semibold border transition-all text-center ${
                              isSelected 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Feedback & Anweisungen an den Kunden</label>
                    <textarea
                      placeholder="Tragen Sie hier Anregungen, Prüfungshinweise oder Korrekturwünsche ein. Der Kunde sieht dies direkt in seinem Portal."
                      rows={5}
                      value={editingFileNote}
                      onChange={(e) => setEditingFileNote(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors resize-none mt-1"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors duration-200 font-medium text-sm"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleUpdateFileStatus}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all duration-200 text-sm"
                  >
                    Status speichern
                  </button>
                </div>
              </div>
            </div>
          )}
        </div></div>
      )}

      {/* 4. DMs CHAT DASHBOARD */}
      {activeTab === 'messages' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>CMS</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">DMs (Secure)</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Online/Offline Mode Switch */}
              <button
                type="button"
                onClick={() => onOnlineToggle(!isOnline)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isOnline 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm border border-emerald-500/20' 
                    : 'bg-amber-655 text-amber-900 border border-amber-300 bg-amber-50'
                }`}
                title={isOnline ? 'Online-Modus aktiv: Nachrichten werden synchronisiert' : 'Offline-Modus aktiv: Nachrichten werden lokal zwischengespeichert'}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-100" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isOnline ? 'Live-Netzwerk' : 'Lokal Offline'}</span>
              </button>

              {/* Active Pending Sync Counter & Button */}
              {pendingSyncCount > 0 && (
                <button
                  type="button"
                  onClick={handleSyncOfflineMessages}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 animate-pulse cursor-pointer disabled:opacity-50"
                  title="Ausstehende DMs übertragen"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Übertrage...' : `${pendingSyncCount} syncen`}</span>
                </button>
              )}

              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold uppercase shadow-sm">
                E2EE active
              </span>
            </div>
          </header>

          <div className="flex-grow flex overflow-hidden divide-x divide-slate-200 bg-white">
          {/* Left panel: list of conversations */}
          <div className="w-80 flex flex-col bg-slate-50 h-full">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Nachrichtenverläufe</h3>
              <p className="text-xs text-slate-500 mt-0.5">Wählen Sie einen Mandanten aus</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {data.customers.map(c => {
                const isSelected = c.id === activeChatCustomerId;
                const unread = unreadPerCustomer[c.id] || 0;
                
                // Get the last message preview
                const lastMsg = data.messages
                  .filter(m => (m.senderId === 'admin' && m.receiverId === c.id) || (m.senderId === c.id && m.receiverId === 'admin'))
                  .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                return (
                  <button
                    key={c.id}
                    onClick={() => selectChat(c.id)}
                    className={`w-full flex items-start space-x-3 p-3.5 rounded-xl transition-all text-left ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'hover:bg-slate-200/50 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 bg-slate-300 rounded-xl flex items-center justify-center font-bold text-sm text-slate-800 uppercase flex-shrink-0">
                      {c.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-xs truncate uppercase tracking-wider">{c.name}</h4>
                        {unread > 0 && (
                          <span className="bg-rose-500 text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full scale-100">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {c.company}
                      </p>
                      {lastMsg && (
                        <p className={`text-xs mt-1.5 truncate ${isSelected ? 'text-blue-100/90' : 'text-slate-500'}`}>
                          {lastMsg.senderId === 'admin' ? 'Ich: ' : ''}{lastMsg.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: conversational timeline */}
          <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
            {activeChatCustomer ? (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Active Chat Header with E2EE Credentials */}
                <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-shrink-0">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold uppercase">
                      {activeChatCustomer.name.slice(0,2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm leading-none">{activeChatCustomer.name}</h3>
                      <span className="text-xs text-slate-400 mt-1 block">Kunde • {activeChatCustomer.company}</span>
                    </div>
                  </div>

                  {/* E2EE Passphrase Adjustment & Cipher Text Toggle */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-blue-700 font-semibold font-mono">
                      <LockKeyhole className="w-3.5 h-3.5" />
                      <span>E2EE Schlüssel:</span>
                    </div>
                    <input
                      type="text"
                      className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono w-36 text-slate-700 outline-none focus:border-blue-500"
                      value={e2eePassphrase}
                      onChange={(e) => setE2eePassphrase(e.target.value)}
                      placeholder="E2EE Passwort..."
                      title="Alle gesendeten Nachrichten und Dateianhänge werden mit diesem Passwort verschlüsselt."
                    />
                    <button
                      type="button"
                      onClick={() => setShowRawCiphers(!showRawCiphers)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                        showRawCiphers
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-500'
                      }`}
                      title="Umschalten zwischen verschlüsselter Datenstromansicht und entschlüsseltem Klartext"
                    >
                      {showRawCiphers ? '🔒 Roh-Chiffre' : '👁️ Klartext'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleClearFullChatAdmin(activeChatCustomer.id)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 rounded text-[10px] font-bold tracking-wide uppercase transition-all flex items-center gap-1 cursor-pointer"
                      title="Gesamten Chatverlauf mit diesem Kunden löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Chat leeren</span>
                    </button>
                  </div>
                </div>

                {/* Conversation Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeChatMessages.length > 0 ? (
                    activeChatMessages.map(msg => {
                      const isMe = msg.senderId === 'admin';
                      let displayedText = msg.content;
                      let decryptionError = false;

                      if (msg.isEncrypted) {
                        if (showRawCiphers) {
                          displayedText = msg.encryptedContent || '';
                        } else {
                          const decrypted = decryptMessage(msg.encryptedContent || '', e2eePassphrase);
                          if (decrypted.startsWith('[Decryption Error')) {
                            decryptionError = true;
                          }
                          displayedText = decrypted;
                        }
                      }

                      const isPending = msg.syncStatus === 'PendingSync';

                      // Decrypt attachments on fly if they are encrypted
                      let decryptedAttachmentUrl = '';
                      let attachmentDecryptionError = false;
                      if (msg.attachment) {
                        if (!showRawCiphers) {
                          const decryptedAtt = decryptMessage(msg.attachment.dataUrl, e2eePassphrase);
                          if (decryptedAtt.startsWith('[Decryption Error')) {
                            attachmentDecryptionError = true;
                          } else {
                            decryptedAttachmentUrl = decryptedAtt;
                          }
                        }
                      }

                      return (
                        <div key={msg.id} className={`flex group ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-lg rounded-2xl p-4 shadow-sm text-sm relative ${
                            isMe 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/60'
                          }`}>
                            <p className={`whitespace-pre-wrap leading-relaxed ${decryptionError ? 'text-rose-300 font-mono text-xs' : 'font-sans'}`}>
                              {displayedText}
                            </p>

                            {/* Attachment rendering */}
                            {msg.attachment && (
                              <div className={`mt-3 p-2.5 rounded-xl border flex flex-col space-y-2 ${
                                isMe 
                                  ? 'bg-blue-700/60 border-blue-500 text-blue-50' 
                                  : 'bg-slate-50 border-slate-200 text-slate-850'
                              }`}>
                                <div className="flex items-center space-x-2.5 text-xs">
                                  <FileText className={`w-4 h-4 ${isMe ? 'text-blue-300' : 'text-blue-600'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate" title={msg.attachment.name}>{msg.attachment.name}</p>
                                    <p className={`text-[9px] font-mono mt-0.5 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                      {(msg.attachment.size / 1024).toFixed(1)} KB • {msg.attachment.type.split('/').pop()?.toUpperCase()}
                                    </p>
                                  </div>
                                </div>

                                {showRawCiphers ? (
                                  <div className="p-1.5 bg-black/15 rounded text-[8px] font-mono break-all line-clamp-2 text-slate-300">
                                    {msg.attachment.dataUrl.slice(0, 100)}...
                                  </div>
                                ) : attachmentDecryptionError ? (
                                  <div className="text-[10px] text-rose-500 font-mono font-bold">
                                    ⚠️ Entschlüsselung fehlgeschlagen
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-current/10">
                                    {msg.attachment.type.startsWith('image/') && decryptedAttachmentUrl && (
                                      <img
                                        src={decryptedAttachmentUrl}
                                        alt={msg.attachment.name}
                                        className="w-10 h-10 object-cover rounded-md border border-black/10 flex-shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    <a
                                      href={decryptedAttachmentUrl}
                                      download={msg.attachment.name}
                                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 hover:brightness-110 transition-all ${
                                        isMe
                                          ? 'bg-blue-700/80 border-blue-600 text-white hover:bg-blue-650'
                                          : 'bg-blue-50 border-blue-100 text-blue-750 hover:bg-blue-100'
                                      }`}
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Herunterladen</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Message Metadata */}
                            <div className="flex items-center justify-end space-x-1.5 mt-2">
                              {msg.isEncrypted && (
                                <ShieldCheck className={`w-3.5 h-3.5 ${
                                  decryptionError ? 'text-rose-400 animate-pulse' : isMe ? 'text-blue-300' : 'text-emerald-500'
                                }`} title="E2E Verschlüsselt" />
                              )}
                              {isPending && (
                                <span className={`text-[8px] font-bold font-mono px-1 rounded flex items-center gap-0.5 ${
                                  isMe ? 'bg-amber-500/20 text-text-amber-200' : 'bg-amber-50 border border-amber-200 text-amber-600'
                                }`} title="In lokaler Warteschlange (Offline)">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>Warteschlange (Offline)</span>
                                </span>
                              )}
                              <span className={`block text-[10px] font-mono ${
                                isMe ? 'text-blue-200' : 'text-slate-400'
                              }`}>
                                {new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                              </span>

                              {/* Interactive message delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteMessageAdmin(msg.id)}
                                className="opacity-0 group-hover:opacity-100 text-[10px] text-rose-300 hover:text-rose-450 hover:underline ml-2 transition-all cursor-pointer bg-transparent border-none outline-none font-mono font-bold"
                                title="Nachricht löschen"
                              >
                                Löschen
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 text-slate-400">
                      <MessageSquare className="h-8 w-8 mx-auto opacity-50 mb-3" />
                      <p className="text-xs">Starten Sie die Unterhaltung mit Herrn {activeChatCustomer.name.split(' ').pop()}!</p>
                    </div>
                  )}
                </div>

                {/* Chat Control Input Fields */}
                <div className="p-4 bg-white border-t border-slate-200">
                  {/* File Attachment Chip */}
                  {selectedAttachment && (
                    <div className="mb-3 p-2.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-150 flex items-center justify-between text-xs animate-fade-in">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold truncate max-w-xs">{selectedAttachment.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(selectedAttachment.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedAttachment(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold p-1 leading-none text-sm transition-colors cursor-pointer"
                        title="Anhang löschen"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Attachment size error alert */}
                  {attachmentError && (
                    <div className="mb-3 p-2 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs animate-shake">
                      {attachmentError}
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="admin-attachment-input-file"
                      onChange={handleAttachmentChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-attachment-input-file"
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                      title="Anhang hochladen (max. 2MB)"
                    >
                      <Paperclip className="w-5 h-5" />
                    </label>

                    {/* Predefined Templates Quick Selector */}
                    {data.communicationTemplates && data.communicationTemplates.length > 0 && (
                      <div className="relative flex-shrink-0">
                        <select
                          title="Antwort-Vorlage einfügen"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const selectedTpl = data.communicationTemplates?.find(t => t.id === val);
                              if (selectedTpl) {
                                setChatInput(prev => prev ? `${prev}\n${selectedTpl.content}` : selectedTpl.content);
                              }
                            }
                            // Reset select value
                            e.target.value = '';
                          }}
                          className="bg-slate-100 hover:bg-slate-250 border border-slate-250 text-slate-705 font-bold px-2.5 py-3 rounded-xl text-xs font-sans outline-none cursor-pointer max-w-[120px] transition-all"
                          defaultValue=""
                        >
                          <option value="" disabled>📋 Vorlage...</option>
                          {data.communicationTemplates
                            .filter(t => t.type === 'chat' || t.type === 'all')
                            .map(t => (
                              <option key={t.id} value={t.id}>{t.title}</option>
                            ))
                          }
                        </select>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder={selectedAttachment ? 'Optionalen Text zum Anhang schreiben...' : 'Schreiben Sie eine Direktnachricht...'}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendDM()}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    <button
                      onClick={handleSendDM}
                      className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-slate-400">
                <MessageSquare className="h-12 w-12 opacity-40 mb-3" />
                <p className="text-sm font-semibold">Keine aktiven Kommunikationspartner registriert.</p>
              </div>
            )}
          </div>
        </div></div>
      )}

      {/* 5. TERMINE & PLANUNG */}
      {activeTab === 'appointments' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Klienten</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Besprechungs-Kalender</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Neuen Termin eintragen</span>
              </button>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded shadow-sm p-4 font-sans">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider font-mono">Anstehende Beratungstermine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.appointments.length > 0 ? (
                data.appointments.map(appt => {
                  const client = data.customers.find(c => c.id === appt.customerId);
                  const isConfirmed = appt.status === 'Bestätigt';
                  const isRejected = appt.status === 'Abgelehnt';
                  const isPending = !appt.status || appt.status === 'Ausstehend';

                  return (
                    <div key={appt.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 hover:shadow-sm transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                            {appt.date} um {appt.time} Uhr
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isConfirmed ? 'bg-emerald-50 text-emerald-700 border-emerald-250/50' :
                              isRejected ? 'bg-rose-50 text-rose-700 border-rose-250/50' :
                              'bg-amber-50 text-amber-700 border-amber-250/50 animate-pulse'
                            }`}>
                              <span>{appt.status || 'Ausstehend'}</span>
                            </span>
                            <button
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Termin permanent löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{appt.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{appt.description}</p>
                      </div>

                      <div className="mt-4 border-t border-slate-200/60 pt-3 space-y-3">
                        {client && (
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Klient:</span>
                            <span className="font-semibold text-slate-600">{client.name} ({client.company})</span>
                          </div>
                        )}

                        {isPending && appt.customerId && (
                          <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-dashed border-slate-200">
                            <button
                              onClick={() => handleConfirmAppointment(appt.id)}
                              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Bestätigen</span>
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(appt.id)}
                              className="py-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Ablehnen</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <Calendar className="h-10 w-10 mx-auto opacity-40 mb-3" />
                  <p className="text-sm font-semibold">Keine anstehenden Termine eingetragen.</p>
                </div>
              )}
            </div>
          </div>

          {/* APPOINTMENT MODAL */}
          {isAppointmentModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-up">
                <div className="p-6 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center">
                  <h3 className="text-lg font-bold">Neuen Termin planen</h3>
                  <button
                    onClick={() => setIsAppointmentModalOpen(false)}
                    className="text-slate-400 hover:text-white transition-opacity font-bold font-mono text-lg p-2 leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Arbeitstitel / Thema*</label>
                    <input
                      type="text"
                      placeholder="z.B. Feedback-Review Vorstellungsvideo"
                      value={appointmentForm.title}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Datum*</label>
                      <input
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Uhrzeit*</label>
                      <input
                        type="time"
                        value={appointmentForm.time}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Mandant / Kunde</label>
                    <select
                      value={appointmentForm.customerId}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customerId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors"
                    >
                      <option value="">Interner Termin (Keine Kundenverknüpfung)</option>
                      {data.customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">Beschreibung / Notizen</label>
                    <textarea
                      placeholder="Besprechungsinhalte oder Raumkoordinaten angeben..."
                      rows={3}
                      value={appointmentForm.description}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-blue-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAppointmentModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors duration-200 font-medium text-sm"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveAppointment}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all duration-200 text-sm"
                  >
                    Termin planen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div></div>
      )}

      {/* VIDEO UPLOADS PANEL */}
      {activeTab === 'videos' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none" id="admin-video-uploads-tab">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Medienmanagement</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Video-Uploads & Kampagnen</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg font-mono font-bold border border-pink-200">
                PRODUKTIONSSTUDIO • AKTIV
              </span>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-5 space-y-6 select-text">
            {/* Status alerts */}
            {videoUploadSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{videoUploadSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form to Upload Video */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-600" />
                    <span>Neues Kundenvideo hochladen</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-450 mt-1 leading-normal">
                    Laden Sie fertige Schnittversionen, Social-Media Clips oder Vorsorge-Erklärungsvideos für Ihre Mandanten hoch. Nach dem Freigeben erscheinen diese sofort im Kundenportal des ausgewählten Kontakts.
                  </p>
                </div>

                <form onSubmit={handleAdminUploadVideo} className="space-y-4 text-xs font-sans">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">1. Mandant auswählen*</label>
                    <select
                      required
                      value={videoSelectedCustomerId}
                      onChange={(e) => setVideoSelectedCustomerId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 font-medium focus:border-indigo-500 focus:bg-white transition-colors"
                    >
                      <option value="">-- Kundenkonto wählen --</option>
                      {data.customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.company || 'Privatkunde'})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">2. Videotitel*</label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. Social Recruiting Werbevideo v1"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-705 font-medium focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">3. Dateiname (Simulierter Upload)*</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="z.B. recruitment_final_1080p.mp4"
                        value={videoFileName}
                        onChange={(e) => setVideoFileName(e.target.value)}
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-705 font-mono text-xs focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const titles = ["kampagnen_teaser_tiktok.mp4", "geschaeftsbericht_erklaerung.mp4", "mitarbeiter_imagefilm_heis.mp4", "gewerbe_risikoanalyse_praes.mp4"];
                          setVideoFileName(titles[Math.floor(Math.random() * titles.length)]);
                        }}
                        className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-bold transition-all"
                        title="Zufälliger Dateiname"
                      >
                        Auto-Gen
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">4. Status bei Veröffentlichung</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVideoStatus('Genehmigt')}
                        className={`py-2 px-3 rounded-xl border text-center transition-all ${
                          videoStatus === 'Genehmigt'
                            ? 'bg-[#004d3d] border-[#004d3d] text-white font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Direkt genehmigt
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoStatus('Eingereicht')}
                        className={`py-2 px-3 rounded-xl border text-center transition-all ${
                          videoStatus === 'Eingereicht'
                            ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Pendent (Freigabe nötig)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">5. Begleitnotiz des Administrators (Admin-Notiz)</label>
                    <textarea
                      placeholder="Geben Sie hier Feedback-Wünsche, Anforderungen oder Konditionen für das Video ein..."
                      rows={3}
                      value={videoAdminNote}
                      onChange={(e) => setVideoAdminNote(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-705 font-medium focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Video freigeben & bereitstellen</span>
                  </button>

                </form>
              </div>

              {/* Right Column: Existing Videos Table */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wide flex items-center gap-2">
                      <Video className="w-4.5 h-4.5 text-pink-600 animate-pulse" />
                      <span>Aktive Kunden-Videoverbindungen ({data.files.filter(f => f.category === 'Video').length})</span>
                    </h3>
                    <p className="text-[10px] text-slate-450 mt-1">
                      Liste aller hochgeladenen Video-Schnitt- und Erklärdateien pro Mandant.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-550 min-w-[500px]">
                    <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Zugeordneter Kunde</th>
                        <th className="px-5 py-3.5 font-bold">Video & Dateiname</th>
                        <th className="px-5 py-3.5 font-bold">Datum</th>
                        <th className="px-5 py-3.5 font-bold">Größe</th>
                        <th className="px-5 py-3.5 text-center font-bold">Status</th>
                        <th className="px-4 py-3.5 text-center font-bold">Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {data.files
                        .filter(f => f.category === 'Video')
                        .map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50/40 transition-all duration-200">
                            <td className="px-5 py-4">
                              <span className="font-bold text-slate-800 block text-xs">{file.customerName}</span>
                              <span className="text-[9px] text-slate-400 font-mono uppercase">ID: {file.customerId}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-pink-50 text-pink-700 border border-pink-100 rounded-lg shrink-0 flex items-center justify-center">
                                  <Video className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="font-semibold text-slate-800 text-[11px] block truncate">{file.name}</span>
                                  <span className="text-[9px] text-slate-450 block truncate max-w-[200px]">{file.adminNote}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                              {new Date(file.uploadDate).toLocaleDateString('de-DE')}
                            </td>
                            <td className="px-5 py-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </td>
                            <td className="px-5 py-4 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                                file.status === 'Genehmigt'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                  : 'bg-amber-50 text-amber-700 border-amber-150'
                              }`}>
                                {file.status === 'Genehmigt' ? 'Freigegeben' : 'Ausstehend'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Möchten Sie das Video "${file.name}" permanent löschen?`)) {
                                    onDataChange({
                                      ...data,
                                      files: data.files.filter(f => f.id !== file.id)
                                    });
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer bg-transparent"
                                title="Video löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {data.files.filter(f => f.category === 'Video').length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                            Bisher keine Kunden-Video-Uploads vorhanden. Verwenden Sie das Formular links!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. KI-BOT TRAINING */}
      {activeTab === 'bottraining' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Roboter & Automation</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Tschu-Tschu Bot Ausbildung</span>
            </div>
            <button
              onClick={() => handleOpenBotRuleModal()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Neue Standard-Antwort trainieren</span>
            </button>
          </header>

          {/* Dual Column Layout: Left Column FAQ Rules, Right Column Simulator sandbox */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 bg-slate-50">
            {/* Left FAQ Rules Board */}
            <div className="lg:col-span-8 flex flex-col h-full overflow-hidden border-r border-slate-200">
              <div className="p-5 border-b border-slate-200 bg-white flex-shrink-0">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Aktive Trainingsdaten & Frage-Trigger ({(data.botRules || []).length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Durchsucht empfangene Klienten-Chatnachrichten nach den untenstehenden Schlüsselwörtern und antwortet vollautomatisiert mit E2E-verschlüsselter Militärgrad-Security.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {(data.botRules || []).length > 0 ? (
                  (data.botRules || []).map((rule) => (
                    <div key={rule.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/50 hover:border-slate-350 hover:shadow-md transition-all flex flex-col justify-between gap-4">
                      <div className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {rule.triggerKeywords.map((kw) => (
                              <span key={kw} className="text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg">
                                #{kw}
                              </span>
                            ))}
                          </div>
                          
                          {/* Usage counter & Admin actions badge */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-150 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>{rule.usagesCount} Auslösungen</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              von: {rule.lastEditedBy || 'System'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/55">
                          <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                            {rule.answer}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenBotRuleModal(rule.id)}
                          className="px-3 py-1.5 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-150 bg-white hover:bg-indigo-50/20 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Muster korrigieren</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBotRule(rule.id)}
                          className="px-3 py-1.5 text-rose-600 hover:text-white border border-rose-100 hover:bg-rose-600 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Löschen</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    <Cpu className="h-10 w-10 mx-auto opacity-30 mb-3" />
                    <p className="text-xs font-semibold">Keine KI-Trainingsregeln definiert.</p>
                  </div>
                )}
              </div>

              {/* Unresolved Questions Section */}
              <div className="border-t border-slate-200 bg-indigo-50/20 p-5 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      <span>Ungelöste Fragen & Trainingsbedarf ({(data.unresolvedQueries || []).length})</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Fragen von Klienten, bei denen die KI das Standard-Fallback auslösen musste. Trainieren Sie den Bot mit einem Klick!
                    </p>
                  </div>
                  
                  {(data.unresolvedQueries || []).length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Möchten Sie alle erfassten ungelösten Fragen unwiderruflich aus der Liste löschen?')) {
                          onDataChange({ ...data, unresolvedQueries: [] });
                        }
                      }}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer bg-transparent border-none outline-none"
                    >
                      Alle leeren
                    </button>
                  )}
                </div>

                {(data.unresolvedQueries || []).length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-thin">
                    {(data.unresolvedQueries || []).map((q) => (
                      <div key={q.id} className="min-w-[280px] max-w-[320px] bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex-shrink-0 snap-start flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-1.5">
                            <span>Klient: {q.customerName}</span>
                            <span>{new Date(q.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 italic line-clamp-2">
                            "{q.query}"
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-[10px]">
                          <button
                            onClick={() => {
                              const filtered = (data.unresolvedQueries || []).filter(item => item.id !== q.id);
                              onDataChange({ ...data, unresolvedQueries: filtered });
                            }}
                            className="px-2 py-1 text-slate-500 hover:text-rose-650 font-bold cursor-pointer"
                          >
                            Ignorieren
                          </button>
                          <button
                            onClick={() => {
                              const prefilledKeywords = q.query
                                .toLowerCase()
                                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
                                .split(/\s+/)
                                .filter(token => token.length > 3)
                                .join(', ');

                              setSelectedBotRuleId(null);
                              setPromotingUnresolvedId(q.id);
                              setBotRuleForm({
                                triggerKeywordsText: prefilledKeywords,
                                answer: `Hallo {Vorname}, bezüglich Deiner Frage zu "${q.query}": ...`
                              });
                              setIsBotRuleModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-indigo-55 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Diesen Fall trainieren</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400 font-medium">
                    Keine unbeantworteten Fragen erfasst. Der Bot läuft fabelhaft! 🎉
                  </div>
                )}
              </div>
            </div>

            {/* Right Sandbox Test Simulator Panel */}
            <div className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-white">
              <div className="p-5 border-b border-slate-200 bg-slate-50/40 flex-shrink-0">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Sandbox: Bot-Reaktionstest</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Prüfen Sie live, ob ein Klienten-Auslöser das richtige Wissen anspricht, bevor Sie es aktivieren.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                    Klienten-Simulationsnachricht
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none text-slate-700 text-xs focus:border-indigo-500 focus:bg-white transition-colors"
                      placeholder="z.B. Wie viel kostet das Erstgespräch?"
                      value={botTestInput}
                      onChange={(e) => handleTestBotResponse(e.target.value)}
                    ></textarea>
                    <span className="absolute bottom-2.5 right-3 text-[9px] font-mono text-slate-400 uppercase font-bold bg-slate-200/50 px-2 py-0.5 rounded-md">
                      Live Test
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide font-mono">
                    Simuliertes Bot-Verhalten
                  </label>

                  {botTestResult ? (
                    <div className="space-y-4 animate-fade-in">
                      {/* Match metadata indicator */}
                      {botTestResult.matched ? (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-850 rounded-xl flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold leading-normal">Volltreffer: Regel erkannt!</p>
                            <p className="text-[10px] text-emerald-600 font-mono mt-0.5">
                              {botTestResult.ruleTitle} (Gewichtung: {botTestResult.score})
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-3">
                          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-amber-800 leading-normal">Kein Treffer • Fallback ausgelöst</p>
                            <p className="text-[10px] text-amber-600 font-mono mt-0.5">
                              Anfrage wird automatisch an die Administration weitergeleitet.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bot Response Bubble preview */}
                      <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                          <span className="text-[9px] font-mono font-bold tracking-wider text-indigo-300 uppercase">
                            KI-SPEICHERABZUG
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Status: ok
                          </span>
                        </div>
                        <p className="text-xs font-sans whitespace-pre-wrap leading-relaxed">
                          {botTestResult.answer}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                      <Cpu className="w-8 h-8 mx-auto opacity-35 mb-3" />
                      <p className="text-xs">Schreiben Sie oben etwas, um die Live-Spracherkennung des Bots zu verifizieren.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KI-BOT TRAINING EDIT MODAL */}
          {isBotRuleModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up my-8">
                <div className="p-6 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-indigo-400/20">
                      CMS TRAINING SYSTEM
                    </span>
                    <h3 className="text-base font-bold mt-1">
                      {selectedBotRuleId ? 'KI-Standardantwort editieren' : 'Neue Wissensquelle anlegen'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsBotRuleModalOpen(false);
                      setSelectedBotRuleId(null);
                    }}
                    className="text-slate-400 hover:text-white font-bold text-lg leading-none p-2 cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">
                      1. Auslöser-Schlüsselwörter (kommagetrennt)*
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-700 text-sm focus:border-indigo-600 focus:bg-white transition-colors"
                      placeholder="z.B. preise, kosten, honorar, geld"
                      value={botRuleForm.triggerKeywordsText}
                      onChange={(e) => setBotRuleForm({ ...botRuleForm, triggerKeywordsText: e.target.value })}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Tragen Sie hier Signalwörter ein, die in der Frage des Klienten vorkommen. Sobald eines davon erkannt wird, feuert der Bot diese Antwort.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">
                      2. Professionelle Auto-Antwort*
                    </label>
                    <textarea
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none text-slate-700 text-xs focus:border-indigo-600 focus:bg-white transition-colors leading-relaxed"
                      placeholder="Geben Sie hier die automatisierte Antwort ein..."
                      value={botRuleForm.answer}
                      onChange={(e) => setBotRuleForm({ ...botRuleForm, answer: e.target.value })}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1.5 font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dynamische KI-Platzhalter (für absolute Personalisierung)</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-[10px] text-indigo-900 font-mono">
                      <div>
                        <span className="font-bold text-indigo-600">{"{Vorname}"}</span>
                        <p className="text-slate-400 text-[9px] mt-0.5">z.B. Sabine</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600">{"{Kunde}"}</span>
                        <p className="text-slate-400 text-[9px] mt-0.5">Sabine Schmidt</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600">{"{Wochentag}"}</span>
                        <p className="text-slate-400 text-[9px] mt-0.5">z.B. Freitag</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600">{"{Datum}"}</span>
                        <p className="text-slate-400 text-[9px] mt-0.5">z.B. 29.05.2026</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600">{"{Uhrzeit}"}</span>
                        <p className="text-slate-400 text-[9px] mt-0.5">z.B. 19:54 Uhr</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600">{"{Berater}"}</span>
                        <p className="text-slate-400 text-[9px] mt-0.5">Max Mustermann</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                      Tragen Sie diese Codes in Ihre Antwort ein. Sie werden beim echten Chat-Einsatz live durch die Daten des Klienten befüllt!
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-55 border-t border-slate-150 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setIsBotRuleModalOpen(false);
                      setSelectedBotRuleId(null);
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-650 hover:bg-slate-150 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveBotRule}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Lernregel abspeichern</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. DEZENTRALE RECHNUNGSLEGUNG & BUCHHALTUNG */}
      {activeTab === 'invoices' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>System-Buchhaltung</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Umsatz & Rechnungsarchiv</span>
            </div>
            <button
              onClick={handleOpenCreateInvoiceModal}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Neue Rechnung erstellen</span>
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-6 bg-slate-50 space-y-6 select-text">
            {/* Bento Grid Buchhaltungs-Statistik */}
            {(() => {
              const invoices = data.invoices || [];
              const netTotal = invoices.reduce((acc, inv) => inv.status !== 'Storno' ? acc + inv.netAmount : acc, 0);
              const taxTotal = invoices.reduce((acc, inv) => inv.status !== 'Storno' ? acc + inv.taxAmount : acc, 0);
              const grossTotal = invoices.reduce((acc, inv) => inv.status !== 'Storno' ? acc + inv.amount : acc, 0);
              const outstanding = invoices.reduce((acc, inv) => inv.status === 'Offen' ? acc + inv.amount : acc, 0);

              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Card 1: Net Sales */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Euro className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">Umsatz Netto</p>
                      <h4 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">
                        {netTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </h4>
                      <span className="text-[9px] text-indigo-500 font-mono">Exkl. MwSt.</span>
                    </div>
                  </div>

                  {/* Card 2: 19% VAT */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">Fällige MwSt. (19%)</p>
                      <h4 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">
                        {taxTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </h4>
                      <span className="text-[9px] text-emerald-550 font-mono">Umsatzsteuerschuld</span>
                    </div>
                  </div>

                  {/* Card 3: Gross Sales */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-4 animate-pulse-slow">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">Umsatz Brutto</p>
                      <h4 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">
                        {grossTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </h4>
                      <span className="text-[9px] text-blue-500 font-mono">Aktiv verrechnet</span>
                    </div>
                  </div>

                  {/* Card 4: Outstanding balances */}
                  <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-rose-450 font-semibold">Offene Außenstände</p>
                      <h4 className="text-lg font-bold text-rose-700 tracking-tight mt-0.5">
                        {outstanding.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </h4>
                      <span className="text-[9px] text-rose-500 font-mono">Zahlungsziel überfällig</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Grid for Table and Analytics Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Invoices Table */}
              <div className="lg:col-span-2">
                {/* Invoices Filter and Data Board */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 outline-none text-xs w-56 text-slate-705 focus:border-indigo-500 focus:bg-white transition-colors"
                      placeholder="Nummer / Mandant suchen..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                    />
                  </div>
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-xs text-slate-650 focus:border-indigo-500 transition-colors"
                  >
                    <option value="all">Alle Rechnungsstatus</option>
                    <option value="Bezahlt">Bezahlt</option>
                    <option value="Offen">Offen</option>
                    <option value="Storno">Storniert</option>
                  </select>
                </div>

                <button
                  onClick={handleExportInvoicesCSV}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-indigo-650 border border-slate-200 hover:border-indigo-150 bg-white hover:bg-indigo-50/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 select-none transition-all duration-150 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Steuerberater Export (CSV)</span>
                </button>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500">
                  <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Rechnung #</th>
                      <th className="px-5 py-3.5 font-bold">Mandant</th>
                      <th className="px-5 py-3.5 font-bold">Datum</th>
                      <th className="px-5 py-3.5 font-bold">Fälligkeit</th>
                      <th className="px-5 py-3.5 font-bold text-right">Netto</th>
                      <th className="px-5 py-3.5 text-right font-bold text-slate-400/80">MwSt. (19%)</th>
                      <th className="px-5 py-3.5 text-right font-bold">Brutto</th>
                      <th className="px-5 py-3.5 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-bold text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {(() => {
                      const invoices = data.invoices || [];
                      const filtered = invoices.filter(inv => {
                        const matchesSearch = inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
                          inv.customerName.toLowerCase().includes(invoiceSearch.toLowerCase());
                        const matchesStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;
                        return matchesSearch && matchesStatus;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={9} className="text-center py-14 text-slate-400">
                              <Receipt className="w-8 h-8 opacity-25 mx-auto mb-2" />
                              <p className="font-semibold text-xs text-slate-500">Keine Rechnungen erfasst.</p>
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((inv) => {
                        return (
                          <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4 font-bold text-slate-800 font-mono">{inv.invoiceNumber}</td>
                            <td className="px-5 py-4 text-slate-700 font-medium">{inv.customerName}</td>
                            <td className="px-5 py-4 text-slate-500">{new Date(inv.issueDate).toLocaleDateString('de-DE')}</td>
                            <td className="px-5 py-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString('de-DE')}</td>
                            <td className="px-5 py-4 text-right font-mono text-slate-600">{inv.netAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                            <td className="px-5 py-4 text-right font-mono text-slate-400">{inv.taxAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                            <td className="px-5 py-4 text-right font-bold font-mono text-slate-900">{inv.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                inv.status === 'Bezahlt'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                  : inv.status === 'Storno'
                                  ? 'bg-slate-100 text-slate-500 border-slate-250'
                                  : 'bg-rose-50 text-rose-700 border-rose-150 animate-pulse'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right flex items-center justify-end gap-1.5 h-full">
                              <button
                                onClick={() => setInvoicePreviewObject(inv)}
                                className="p-1 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50/40 rounded transition-all cursor-pointer"
                                title="A4 Sichten / Drucken"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {inv.status === 'Offen' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateInvoiceStatus(inv.id, 'Bezahlt')}
                                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[9px] uppercase font-mono transition-all cursor-pointer"
                                    title="Zahlungserhalt verbuchen"
                                  >
                                    Zahlung
                                  </button>
                                  <button
                                    onClick={() => handleUpdateInvoiceStatus(inv.id, 'Storno')}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                                    title="Als Storno markieren"
                                  >
                                    Stornieren
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close Left Column (lg:col-span-2) */}
            </div>

            {/* Right Column: High Fidelity Finance Analytics & Prediction Insights */}
            <div className="space-y-4">
              
              {/* Visual Sales Velocity Line Chart using SVG */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-sans uppercase tracking-wider font-mono">Umsatz-Geschwindigkeit</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Zeitlicher Verlauf aller System-Umsätze</p>
                  </div>
                  <span className="p-1.5 bg-indigo-50 text-indigo-705 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>

                <div className="h-40 w-full relative">
                  {(() => {
                    const invoices = (data.invoices || []).filter(inv => inv.status !== 'Storno');
                    if (invoices.length === 0) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 z-10 text-center">
                          <span className="text-[11px] font-mono">Noch keine Umsatzdaten erfasst</span>
                        </div>
                      );
                    }

                    // Sort chronologically
                    const sortedInvoices = [...invoices].sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());
                    
                    // Calculate cumulative totals
                    let cumulative = 0;
                    const points = sortedInvoices.map((inv, idx) => {
                      cumulative += inv.amount;
                      return { x: idx, val: cumulative, date: inv.issueDate };
                    });

                    const maxVal = Math.max(...points.map(p => p.val), 1);
                    const minVal = 0;
                    const valRange = maxVal - minVal;

                    const width = 230;
                    const height = 110;
                    const padding = 10;

                    // Map data to SVG coordinates
                    const svgPoints = points.map((p, idx) => {
                      const xRatio = points.length > 1 ? idx / (points.length - 1) : 0.5;
                      const x = padding + xRatio * (width - 2 * padding);
                      
                      const yRatio = valRange > 0 ? (p.val - minVal) / valRange : 0.5;
                      const y = height - padding - yRatio * (height - 2 * padding);
                      return { x, y, val: p.val, raw: p };
                    });

                    // Construct path d string
                    let pathD = '';
                    if (svgPoints.length > 0) {
                      pathD = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
                      for (let i = 1; i < svgPoints.length; i++) {
                        pathD += ` L ${svgPoints[i].x} ${svgPoints[i].y}`;
                      }
                    }

                    // Construct area path (closing at bottom)
                    let areaD = '';
                    if (svgPoints.length > 0) {
                      areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height - padding} L ${svgPoints[0].x} ${height - padding} Z`;
                    }

                    return (
                      <div className="w-full h-full flex flex-col justify-between">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                            </linearGradient>
                          </defs>
                          
                          {/* Horizontal guide lines */}
                          <line x1={0} y1={padding} x2={width} y2={padding} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1={0} y1={height - padding} x2={width} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />

                          {/* Filled Area */}
                          {areaD && <path d={areaD} fill="url(#chartGrad)" />}

                          {/* Sparkline Path */}
                          {pathD && <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                          {/* Data points */}
                          {svgPoints.map((pt, idx) => (
                            <g key={idx} className="group/dot">
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="4"
                                className="fill-white stroke-indigo-600 cursor-pointer transition-all hover:r-5"
                                strokeWidth="2"
                              />
                              <title>
                                {`${new Date(pt.raw.date).toLocaleDateString('de-DE')}: ${pt.val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`}
                              </title>
                            </g>
                          ))}
                        </svg>

                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-1">
                          <span>Systemstart</span>
                          <span>{cumulative.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} Gesamterlös</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Direct Fälligkeits-Radar (Aging Analysis / Overdue) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <h4 className="text-xs font-bold text-slate-850 font-sans uppercase tracking-wider font-mono">Fälligkeits-Radar (Mahnwesen)</h4>
                </div>
                
                {(() => {
                  const invoices = data.invoices || [];
                  const overdueInvoices = invoices.filter(inv => {
                    if (inv.status !== 'Offen') return false;
                    const dueTime = new Date(inv.dueDate).getTime();
                    return dueTime < Date.now();
                  });

                  if (overdueInvoices.length === 0) {
                    return (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-150 text-emerald-800 text-[10.5px] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Keine überfälligen Rechnungen vorhanden. Alles beglichen!</span>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-400">Es wurden {overdueInvoices.length} überfällige Posten registriert:</p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {overdueInvoices.map(inv => {
                          const daysOverdue = Math.ceil((Date.now() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                          const customerName = data.customers.find(c => c.id === inv.customerId)?.name || 'Unbekannt';
                          
                          return (
                            <div key={inv.id} className="p-2 w-full bg-rose-50/70 rounded-xl border border-rose-150 text-[11px] text-slate-705 flex flex-col space-y-1 justify-between">
                              <div className="flex justify-between font-mono font-bold text-[10px] text-rose-850">
                                  <span>{inv.invoiceNumber}</span>
                                  <span>{inv.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Mandant: {customerName}</span>
                                <span className="font-bold text-rose-600">seit {daysOverdue} Tag{daysOverdue !== 1 ? 'en' : ''} überfällig</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Smart KPIs Summary card with dynamic percentages */}
              <div className="bg-slate-900 text-slate-350 p-5 rounded-2xl shadow-sm border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] bg-indigo-500/20 text-indigo-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-indigo-400/20">
                    ANALYTICS-PROFIL
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Sync: Live</span>
                </div>

                {(() => {
                  const invoices = data.invoices || [];
                  const paid = invoices.filter(i => i.status === 'Bezahlt');
                  const total = invoices.filter(i => i.status !== 'Storno');
                  const ratio = total.length > 0 ? (paid.length / total.length) * 100 : 100;
                  
                  return (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10.5px] uppercase font-mono tracking-wider font-bold text-slate-400">Realisierungsquote</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <h3 className="text-xl font-bold font-mono text-white tracking-tight">{ratio.toFixed(1)}%</h3>
                          <span className="text-[9.5px] text-emerald-400 font-mono font-bold">Erfolgreich verbucht</span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1 rounded-full transition-all duration-300" style={{ width: `${ratio}%` }}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                        <div>
                          <span className="text-slate-500">Beglichen:</span>
                          <p className="text-slate-200 mt-0.5 font-bold">{paid.length} Belege</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Offene Tranchen:</span>
                          <p className="text-slate-200 mt-0.5 font-bold">{total.length - paid.length} Belege</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Close Grid Wrapper */}
            </div>

          </div>

          {/* CREATE INVOICE DIALOG OVERLAY */}
          {isInvoiceModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up my-8">
                <div className="p-5 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-indigo-400/20">
                      BUCHHALTUNGSEXTRAS
                    </span>
                    <h3 className="text-base font-bold mt-1">Rechnungsbeleg manuell anlegen</h3>
                  </div>
                  <button
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="text-slate-400 hover:text-white font-bold text-lg p-2 leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                        1. Zuordnung Mandant*
                      </label>
                      <select
                        value={invoiceForm.customerId}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, customerId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      >
                        <option value="">-- Mandant auswählen --</option>
                        {data.customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.company || 'Privatperson'})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                        2. Rechnungsnummer*
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                        value={invoiceForm.invoiceNumber}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                        Belegdatum
                      </label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-705 outline-none font-mono"
                        value={invoiceForm.issueDate}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                        Zahlungsziel (Fälligkeit)
                      </label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-705 outline-none font-mono"
                        value={invoiceForm.dueDate}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                        Mehrwertsteuersatz
                      </label>
                      <select
                        value={invoiceForm.taxRate}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-705 outline-none font-mono"
                      >
                        <option value={19}>19% Umsatzsteuer</option>
                        <option value={7}>7% USt. (Sonderfall)</option>
                        <option value={0}>0% steuerfreie Vermittlung</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-mono">
                      Betreff / Mandatsbeschreibung
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500"
                      value={invoiceForm.description}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                    />
                  </div>

                  {/* Quick presets buttons */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-2">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Leistungs-Schnellauswahl (Katalog-Muster):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Stundensatz Beratung', title: 'Consulting Honorar / Stundennachweis', price: 150 },
                        { label: 'Lizenzgebühr Basic', title: 'Aura Module Lizenzgebühr (Monatlich)', price: 450 },
                        { label: 'CMS Setup', title: 'Aura Core Systemeinrichtung und API-Deploy', price: 290 },
                        { label: 'Plugin-Entwicklung', title: 'Custom Plugin-Entwicklung & Modul-Anpassung', price: 590 }
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            // If first item is empty, replace it. Otherwise, add a new one.
                            const firstEmpty = invoiceForm.items.length === 1 && invoiceForm.items[0].description === '';
                            if (firstEmpty) {
                              setInvoiceForm({
                                ...invoiceForm,
                                items: [{ id: invoiceForm.items[0].id, description: preset.title, quantity: 1, unitPrice: preset.price }]
                              });
                            } else {
                              setInvoiceForm({
                                ...invoiceForm,
                                items: [
                                  ...invoiceForm.items,
                                  { id: `item-${Date.now()}`, description: preset.title, quantity: 1, unitPrice: preset.price }
                                ]
                              });
                            }
                          }}
                          className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-705 hover:text-indigo-700 font-medium px-2.5 py-1 text-[10px] rounded transition-all cursor-pointer shadow-xs"
                        >
                          + {preset.label} ({preset.price} €)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic invoice items container */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 font-mono">Rechnungsposten (Einzelaufstellung)</h4>
                      <button
                        onClick={handleInvoiceItemAdd}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] uppercase font-mono flex items-center gap-1 transition-all cursor-pointer border-none"
                      >
                        + Posten hinzufügen
                      </button>
                    </div>

                    <div className="space-y-2">
                      {invoiceForm.items.map((it, idx) => {
                        const rowTotal = (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0);
                        return (
                          <div key={it.id} className="grid grid-cols-12 gap-2.5 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                            <div className="col-span-1 text-center font-mono text-[10px] text-slate-400 font-bold">#{idx + 1}</div>
                            <div className="col-span-5">
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none"
                                placeholder="z.B. Courtage Wohngebäude / Beratungspaket"
                                value={it.description}
                                onChange={(e) => handleInvoiceItemChange(it.id, 'description', e.target.value)}
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="number"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none text-center font-mono"
                                placeholder="Menge"
                                value={it.quantity}
                                onChange={(e) => handleInvoiceItemChange(it.id, 'quantity', e.target.value)}
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="number"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none text-right font-mono"
                                placeholder="E-Preis"
                                value={it.unitPrice}
                                onChange={(e) => handleInvoiceItemChange(it.id, 'unitPrice', e.target.value)}
                              />
                            </div>
                            <div className="col-span-1.5 text-right text-xs font-bold font-mono text-slate-700">
                              {rowTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </div>
                            <div className="col-span-0.5 text-center">
                              {invoiceForm.items.length > 1 && (
                                <button
                                  onClick={() => handleInvoiceItemRemove(it.id)}
                                  className="text-rose-600 hover:text-rose-800 text-sm font-bold cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Calculation preview board */}
                  {(() => {
                    const netTotal = invoiceForm.items.reduce((acc, it) => acc + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0);
                    const taxAmt = netTotal * (Number(invoiceForm.taxRate) / 100);
                    const grossTotal = netTotal + taxAmt;

                    return (
                      <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100/50 flex flex-col items-end space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between w-64 text-slate-500">
                          <span>Summe Netto:</span>
                          <span>{netTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between w-64 text-slate-400">
                          <span>Umsatzsteuer ({invoiceForm.taxRate}%):</span>
                          <span>{taxAmt.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between w-64 text-slate-900 font-bold border-t border-slate-200 pt-1.5 text-sm">
                          <span>Summe Brutto:</span>
                          <span>{grossTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-5 bg-slate-55 border-t border-slate-150 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-650 hover:bg-slate-150 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveInvoice}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Rechnungsbeleg freigeben</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HIGH FIDELITY A4 RECHNUNGS-VORSCHAU MODAL */}
          {invoicePreviewObject && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white w-full max-w-3xl rounded-none shadow-2xl overflow-hidden my-8 border border-slate-300 select-text flex flex-col">
                <div className="p-4 bg-slate-900 text-white flex justify-between items-center flex-shrink-0 no-print">
                  <span className="text-xs font-mono">DIN-A4 Druckansicht</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 bg-white/20 hover:bg-white/35 text-white text-xs font-bold rounded transition-all cursor-pointer"
                    >
                      Drucken / PDF
                    </button>
                    <button
                      onClick={() => setInvoicePreviewObject(null)}
                      className="text-white hover:text-slate-200 leading-none text-xl px-1.5 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Simulated physical Letterhead Paper */}
                <div className="p-12 sm:p-14 bg-white text-slate-800 font-sans leading-relaxed text-xs aspect-[1/1.414] w-[210mm] max-w-full mx-auto shadow-inner select-text">
                  {/* Sender Branded Header Area */}
                  <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-10">
                    <div>
                      <h4 className="text-lg font-black tracking-tighter text-indigo-700">KRAFTWERK SYSTEMS</h4>
                      <p className="text-[10px] font-mono tracking-wider text-slate-400 mt-0.5">ENTERPRISE CMS SYSTEMBERATUNG</p>
                      <p className="text-[9px] text-slate-500 mt-2 font-mono">
                        Muster-Softwareberatung<br />
                        Musterstraße 12 • 12345 Musterstadt
                      </p>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-400 space-y-1">
                      <p>USt-IdNr.: DE 123 456 789</p>
                      <p>Systemlizenz: LMS-932-A</p>
                      <p>Telefon: +49 1234 567890</p>
                      <p>EMail: support@musterdomain.de</p>
                    </div>
                  </div>

                  {/* Left address column - small font sender line, recipient area */}
                  <div className="grid grid-cols-2 gap-10 mb-12">
                    <div>
                      <span className="text-[8px] text-slate-455 border-b border-slate-200 block pb-1.5 mb-2 font-mono uppercase tracking-wide">
                        Aura Systems • Musterstraße 12 • 12345 Musterstadt
                      </span>
                      {(() => {
                        const cust = data.customers.find(c => c.id === invoicePreviewObject.customerId);
                        return (
                          <div className="space-y-1 font-sans text-[11px] text-slate-800">
                            <p className="font-bold">{cust ? cust.name : invoicePreviewObject.customerName}</p>
                            {cust?.company && <p className="font-semibold text-slate-700">{cust.company}</p>}
                            <p>{cust?.address || 'Kundensitz in Deutschland'}</p>
                            <p className="pt-2 font-mono text-[10px] text-slate-400">Mandanten-ID: #{invoicePreviewObject.customerId.substring(0, 8)}</p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="text-right font-mono space-y-2 mt-4 text-[10px]">
                      <h2 className="text-lg font-black font-sans tracking-tight text-slate-900 border-b border-slate-100 pb-1 mb-3">RECHNUNG</h2>
                      <p><strong>Rechnungsnummer:</strong> {invoicePreviewObject.invoiceNumber}</p>
                      <p><strong>Belegdatum:</strong> {new Date(invoicePreviewObject.issueDate).toLocaleDateString('de-DE')}</p>
                      <p><strong>Fälligkeitstermin:</strong> {new Date(invoicePreviewObject.dueDate).toLocaleDateString('de-DE')}</p>
                      <p><strong>Status:</strong> <span className="font-bold">{invoicePreviewObject.status.toUpperCase()}</span></p>
                    </div>
                  </div>

                  {/* Subject line */}
                  <div className="mb-8 font-sans">
                    <h3 className="text-sm font-bold text-slate-900">Leistungsabrechnung: {invoicePreviewObject.description}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Hiermit stellen wir Ihnen für die vereinbarten Leistungen bzw. die erfolgreiche betriebliche Courtage-Sicherstellung folgende Positionen in Rechnung:
                    </p>
                  </div>

                  {/* Items detailed table */}
                  <div className="mb-10">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-55 border-y border-slate-250 font-mono text-[9px] uppercase tracking-wide text-slate-450">
                        <tr>
                          <th className="px-3 py-2">Pos.</th>
                          <th className="px-3 py-2">Leistungsbeschreibung</th>
                          <th className="px-3 py-2 text-center">Einheiten</th>
                          <th className="px-3 py-2 text-right">Einzelpreis</th>
                          <th className="px-3 py-2 text-right font-bold">Postentotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {((invoicePreviewObject.items || []) as any[]).map((it, idx) => {
                          return (
                            <tr key={it.id || idx}>
                              <td className="px-3 py-3 text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                              <td className="px-3 py-3 font-semibold text-slate-800">{it.description}</td>
                              <td className="px-3 py-3 text-center font-mono">{it.quantity}</td>
                              <td className="px-3 py-3 text-right font-mono">{(it.unitPrice || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                              <td className="px-3 py-3 text-right font-bold font-mono">{(it.total || (it.quantity * it.unitPrice)).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial computations summary */}
                  <div className="flex justify-end mb-14">
                    <div className="w-72 border-t border-slate-300 pt-3.5 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>Nettobetrag:</span>
                        <span>{invoicePreviewObject.netAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                      </div>
                      <div className="flex justify-between text-slate-450 border-b border-slate-100 pb-2">
                        <span>Zuzügl. {invoicePreviewObject.taxRate}% USt:</span>
                        <span>{invoicePreviewObject.taxAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-black text-xs pt-1">
                        <span>Gesamtsumme Brutto:</span>
                        <span>{invoicePreviewObject.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Legal footer & payments sync instructions */}
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6 mt-16 text-[9.5px] text-slate-450 font-sans leading-normal">
                    <div>
                      <p className="font-bold text-slate-700">Zahlungsbedingungen & Hinweise:</p>
                      <p className="mt-1">
                        Bitte überweisen Sie den fälligen Bruttobetrag innerhalb von 14 Tagen unter Angabe der Rechnungsnummer <strong>{invoicePreviewObject.invoiceNumber}</strong> auf das untenstehende Geschäftskonto.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-700">Bankverbindung & Geschäftskonto:</p>
                      <p className="mt-1 font-mono">
                        Kreditinstitut: Sparkasse Musterstadt<br />
                        IBAN: DE49 1234 5678 1234 5678 12<br />
                        BIC: BYLADEM1MUSTER<br />
                        Konto-Inhaber: Max Mustermann e.K.
                      </p>
                    </div>
                  </div>

                  {/* Digital seal signature stamp */}
                  <div className="mt-10 pt-4 border-t border-dashed border-slate-100 flex items-center justify-between font-mono text-[8px] text-slate-400">
                    <span>SEAL HASH: HMAC-SHA256-{invoicePreviewObject.id.substring(4, 16).toUpperCase()}</span>
                    <span>Validierter Original-Systembeleg der Aura Systems Musterstadt</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. PROZESS-ROADMAP SCHABLONEN BUILDER */}
      {activeTab === 'templates' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in select-none">
          {/* Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Template-Zentrale</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-semibold">Prozess-Schablonen & Fahrpläne</span>
            </div>
            <button
              onClick={() => handleOpenCreateTemplateModal()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Neue Schablone entwerfen</span>
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-6 bg-slate-50 space-y-5 select-text">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-4xl mx-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Aktive Schablonen in der CMS-Datenbank ({allTemplates.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Diese Setup-Projektfahrpläne strukturieren die Zusammenarbeit in exakt 5 Phasen. Weisen Sie diese Schablonen in der Kundenverwaltung direkt zu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {allTemplates.map((tpl) => {
                const isSystem = ROADMAP_TEMPLATES.some(s => s.id === tpl.id);
                return (
                  <div 
                    key={tpl.id} 
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-150 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          tpl.category === 'Marketing' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-150'
                            : tpl.category === 'Software'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                            : tpl.category === 'Projekt'
                            ? 'bg-purple-50 text-purple-700 border border-purple-150'
                            : 'bg-amber-50 text-amber-700 border border-amber-150'
                        }`}>
                          {tpl.category}
                        </span>
                        
                        <span className="text-[9px] text-slate-400 font-mono">
                          {isSystem ? 'Systemtemplate' : 'Custom Template'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 mt-3 font-sans line-clamp-1">{tpl.name}</h4>
                      <p className="text-[10px] text-slate-450 mt-1 lines-clamp-2 leading-relaxed min-h-[30px]">{tpl.description}</p>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/40 mt-4 text-[10px] text-slate-400 font-mono text-center">
                        <div>
                          <p className="text-slate-500 font-bold">{tpl.phases.length}</p>
                          <p className="text-[8px] uppercase">Phasen</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold">{tpl.tasks.length}</p>
                          <p className="text-[8px] uppercase">Aufgaben</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-5">
                      <button
                        onClick={() => handleOpenCreateTemplateModal(tpl.id)}
                        className="flex-grow px-2 py-1.5 text-center text-slate-650 hover:text-indigo-600 border border-slate-250 hover:border-indigo-150 bg-white hover:bg-indigo-50/15 text-[10.5px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Kopie bearbeiten</span>
                      </button>
                      
                      {!isSystem ? (
                        <button
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="px-2.5 py-1.5 text-rose-500 hover:text-white border border-rose-100 hover:bg-rose-500 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer"
                          title="Fahrplan löschen"
                        >
                          Löschen
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-350 italic font-mono px-2 py-1 bg-slate-50 rounded">System-geschützt</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TEMPLATE GENERATOR MODAL VIEW */}
          {isTemplateModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up my-8">
                <div className="p-5 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-indigo-400/20">
                      SCHABLONEN ASSISTENT
                    </span>
                    <h3 className="text-base font-bold mt-1">
                      {editingTemplateId ? 'Roadmap-Schablone anpassen & klonen' : 'Neue Beratungsschablone entwerfen'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="text-slate-400 hover:text-white font-bold text-lg p-2 leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto select-text font-sans">
                  {/* General settings row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">
                        Schablonen-Bezeichnung*
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold"
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        placeholder="z.B. Vorsorgekonzept Altersvorsorge v1"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">
                        Fachbereich / Sparte
                      </label>
                      <select
                        value={templateForm.category}
                        onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none"
                      >
                        <option value="Software">Software & Lizenzen</option>
                        <option value="Projekt">Projekt-Setup & Migration</option>
                        <option value="Enterprise">Enterprise Integration</option>
                        <option value="Marketing">Marketing & Consulting</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">
                        Visualizer Symbol
                      </label>
                      <select
                        value={templateForm.icon}
                        onChange={(e) => setTemplateForm({ ...templateForm, icon: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-705 outline-none font-mono"
                      >
                        <option value="Layers">Layers (Standard)</option>
                        <option value="TrendingUp">Trending Up (Finanzen)</option>
                        <option value="ShieldCheck">Shield (Core Security)</option>
                        <option value="Video">Video (Medien)</option>
                      </select>
                    </div>

                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 font-mono">
                        Zweckbeschreibung & interne Notizen
                      </label>
                      <textarea
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-707 outline-none"
                        value={templateForm.description}
                        onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                        placeholder="Erläuterungen zum Einsatzgebiet dieser Schablone..."
                      ></textarea>
                    </div>
                  </div>

                  {/* 5 Phases Editors details */}
                  <div className="space-y-3.5 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide">
                      1. Definition der 5 Phasen (Prozess-Phasen)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                      {templateForm.phases.map((ph, idx) => {
                        return (
                          <div key={ph.phase} className="bg-slate-50 p-3 rounded-xl border border-slate-200/40 space-y-1.5 flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-indigo-600 font-bold block">PHASE {ph.phase}</span>
                            <input
                              type="text"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-750 font-bold outline-none"
                              value={ph.title}
                              onChange={(e) => {
                                const copyPh = [...templateForm.phases];
                                copyPh[idx].title = e.target.value;
                                setTemplateForm({ ...templateForm, phases: copyPh });
                              }}
                              placeholder="Phasentitel"
                            />
                            <textarea
                              rows={2}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-450 outline-none leading-relaxed"
                              value={ph.desc}
                              onChange={(e) => {
                                const copyPh = [...templateForm.phases];
                                copyPh[idx].desc = e.target.value;
                                setTemplateForm({ ...templateForm, phases: copyPh });
                              }}
                              placeholder="Kurze Teaser..."
                            ></textarea>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks detailed Editor list */}
                  <div className="space-y-3.5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide">
                        2. Aufgabenliste & Meilenstein-Zuständigkeit
                      </h4>
                      <button
                        onClick={handleTemplateTaskAdd}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] uppercase font-mono flex items-center gap-1 transition-all cursor-pointer border-none"
                      >
                        + Neues To-Do hinzufügen
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {templateForm.tasks.map((task, idx) => {
                        return (
                          <div key={task.id} className="grid grid-cols-12 gap-2.5 items-start bg-slate-50/70 p-3 rounded-xl border border-slate-200/40 relative">
                            <div className="col-span-1 border-r border-slate-200/40 h-full flex flex-col items-center justify-center font-mono text-[10px] text-slate-400 font-bold">
                              {idx + 1}
                            </div>
                            
                            <div className="col-span-2">
                              <label className="block text-[8px] font-mono text-slate-400 font-bold uppercase mb-0.5">Phase (1-5)</label>
                              <select
                                value={task.phase}
                                onChange={(e) => handleTemplateTaskChange(task.id, 'phase', Number(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 font-mono outline-none"
                              >
                                <option value={1}>Phase 1</option>
                                <option value={2}>Phase 2</option>
                                <option value={3}>Phase 3</option>
                                <option value={4}>Phase 4</option>
                                <option value={5}>Phase 5</option>
                              </select>
                            </div>

                            <div className="col-span-3">
                              <label className="block text-[8px] font-mono text-slate-400 font-bold uppercase mb-0.5">To-Do Überschrift</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 outline-none"
                                value={task.title}
                                onChange={(e) => handleTemplateTaskChange(task.id, 'title', e.target.value)}
                                placeholder="z.B. Courtagedetail sichten"
                              />
                            </div>

                            <div className="col-span-4">
                              <label className="block text-[8px] font-mono text-slate-400 font-bold uppercase mb-0.5">Aufgabenbeschreibung</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-500 outline-none"
                                value={task.desc}
                                onChange={(e) => handleTemplateTaskChange(task.id, 'desc', e.target.value)}
                                placeholder="Sichtbares Begleit-To-do..."
                              />
                            </div>

                            <div className="col-span-1.5">
                              <label className="block text-[8px] font-mono text-slate-400 font-bold uppercase mb-0.5">Zuständig</label>
                              <select
                                value={task.role}
                                onChange={(e) => handleTemplateTaskChange(task.id, 'role', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-700 outline-none"
                              >
                                <option value="Kunde">Kunde</option>
                                <option value="Berater">Berater</option>
                                <option value="Beide">Beide</option>
                              </select>
                            </div>

                            <div className="col-span-0.5 text-center self-center pt-2">
                              {templateForm.tasks.length > 1 && (
                                <button
                                  onClick={() => handleTemplateTaskRemove(task.id)}
                                  className="text-rose-600 hover:text-rose-800 text-sm font-bold cursor-pointer"
                                  title="Aufgabe löschen"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-55 border-t border-slate-150 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-650 hover:bg-slate-150 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Zuweisbare Schablone verbuchen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. INTERAKTIVE SYSTEM DOCUMENTATION & HANDBUCH */}
      {activeTab === 'documentation' && (
        <ManualDoc />
      )}

      {/* 10. WARENWIRTSCHAFT (ERP) */}
      {activeTab === 'wawi' && (
        <div className="flex-1 overflow-auto">
          <Warenwirtschaft data={data} onDataChange={onDataChange} logAction={handleLogAction} activeTemplate={activeTemplate} />
        </div>
      )}

      {/* 11. BESTELLUNGEN & LOGISTIK */}
      {activeTab === 'billingshipping' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          <BillingAndShipping data={data} onDataChange={onDataChange} logAction={handleLogAction} activeTemplate={activeTemplate} />
        </div>
      )}

      {/* 12. PORTAL-BLOG */}
      {activeTab === 'blog' && (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          <BlogSystem role="admin" data={data} onDataChange={onDataChange} logAction={handleLogAction} activeTemplate={activeTemplate} />
        </div>
      )}

      {/* 13. DESIGN-SYSTEM (THEMES & TEMPLATES) */}
      {activeTab === 'style-templates' && (
        <div className="flex-grow overflow-auto p-6 bg-slate-50">
          <TemplatesManager data={data} onDataChange={onDataChange} logAction={handleLogAction} activeTemplate={activeTemplate} />
        </div>
      )}

      {/* 14. ALLGEMEINE EINSTELLUNGEN */}
      {activeTab === 'settings' && (
        <div className="flex-grow overflow-auto p-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight flex items-center gap-2">
                  <Sliders className="h-6 w-6 text-indigo-600" />
                  Allgemeine Einstellungen
                </h1>
                <p className="text-sm text-slate-500 mt-1">SEO, Metadaten und Bezeichnungen Ihres Portals konfigurieren.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-900">Seitenidentität & SEO-Optimierung</h2>
                <p className="text-xs text-slate-500 mt-0.5">Diese Angaben steuern das Erscheinungsbild der Plattform und Suchmaschinen-Tags.</p>
              </div>

              <div className="p-6 space-y-6">
                <div id="settings-group-identity" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name der Seite */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Header-Name der Seite (Logo)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm placeholder-slate-400 transition-all font-medium text-slate-900"
                      placeholder="z.B. Aura Suite"
                      value={data.settings?.siteHeaderName || ''}
                      onChange={(e) => {
                        onDataChange((prev: CRMData) => ({
                          ...prev,
                          settings: {
                            ...(prev.settings || ({} as any)),
                            siteHeaderName: e.target.value
                          }
                        }));
                      }}
                    />
                    <span className="text-[11px] text-slate-400 block">
                      Wird oben links in der Sidebar sowie im Header der Webseiten eingeblendet.
                    </span>
                  </div>

                  {/* Browser-Tab Titel */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Browser-Tab Titel (SEO-Titel)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm placeholder-slate-400 transition-all font-medium text-slate-900"
                      placeholder="z.B. Aura Suite - Consulting & Software"
                      value={data.settings?.siteTitle || ''}
                      onChange={(e) => {
                        onDataChange((prev: CRMData) => ({
                          ...prev,
                          settings: {
                            ...(prev.settings || ({} as any)),
                            siteTitle: e.target.value
                          }
                        }));
                      }}
                    />
                    <span className="text-[11px] text-slate-400 block">
                      Der Seitentitel für Suchmaschinen und Browser-Favoriten.
                    </span>
                  </div>
                </div>

                {/* SEO-Beschreibung */}
                <div id="settings-group-seo" className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Allgemeine SEO-Beschreibung (Meta-Description)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm placeholder-slate-400 transition-all text-slate-900"
                    placeholder="Beschreiben Sie kurz das Angebot Ihres Beratungsunternehmens..."
                    value={data.settings?.siteSeoDescription || ''}
                    onChange={(e) => {
                      onDataChange((prev: CRMData) => ({
                        ...prev,
                        settings: {
                          ...(prev.settings || ({} as any)),
                          siteSeoDescription: e.target.value
                        }
                      }));
                    }}
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Die allgemeine Kurzbeschreibung für Suchmaschinen. Empfohlen werden ca. 150 Zeichen.
                  </span>
                </div>

                {/* --- FRONTEND APPEARANCE & BRAND DESIGN TEMPLATE SELECTOR --- */}
                <div className="border-t border-slate-200/60 pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Palette className="h-4.5 w-4.5 text-indigo-650" />
                      Frontend-Aussehen & Design-Template definieren
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Wählen Sie ein perfekt abgestimmtes Design-Konzept. Das gewählte Theme steuert Typografie, Kontrastflächen und Farbpaletten des Frontend-Auftritts in Echtzeit.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STYLE_TEMPLATES.map((tmpl) => {
                      const isSelected = (data.settings?.activeTemplateId || 'slate-modern') === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            onDataChange((prev: CRMData) => ({
                              ...prev,
                              settings: {
                                ...(prev.settings || ({} as any)),
                                activeTemplateId: tmpl.id
                              }
                            }));
                          }}
                          className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between h-36 cursor-pointer ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/10' 
                              : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 leading-none">
                                {tmpl.name}
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                )}
                              </span>
                              
                              {/* Color Accent Preview Circles */}
                              <div className="flex items-center gap-1">
                                <span className={`w-3.5 h-3.5 rounded-full border border-slate-200 inline-block ${tmpl.bgSidebar.split(' ')[0]}`} title="Sidebar"></span>
                                <span className={`w-3.5 h-3.5 rounded-full border border-slate-200 inline-block ${tmpl.primaryButton.split(' ')[0]}`} title="Button"></span>
                                <span className={`w-3.5 h-3.5 rounded-full border border-slate-200 inline-block ${tmpl.bgMain.split(' ')[0]}`} title="Hintergrund"></span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                              {tmpl.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
                            <span>Schriftart: <strong className="font-semibold">{tmpl.fontClass.replace('font-', '')}</strong></span>
                            <span>Ecken: <strong className="font-semibold">{tmpl.roundedClass.replace('rounded-', '') || 'scharf'}</strong></span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* --- CORE MODULES CONFIGURATION TOGGLES --- */}
                <div className="border-t border-slate-200/60 pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-indigo-650" />
                      Aktive Frontend-Module schalten
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Schalten Sie die Hauptbereiche des Portals ein oder aus. Deaktivierte Bereiche werden im Frontend für Kunden und Besucher automatisch ausgeblendet.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Webshop Toggle */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                      <input
                        id="toggle-shop-enabled"
                        type="checkbox"
                        checked={data.settings?.shopEnabled !== false}
                        onChange={(e) => {
                          onDataChange((prev: CRMData) => ({
                            ...prev,
                            settings: {
                              ...(prev.settings || ({} as any)),
                              shopEnabled: e.target.checked
                            }
                          }));
                        }}
                        className="h-4 w-4 mt-0.5 text-indigo-650 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                      />
                      <label htmlFor="toggle-shop-enabled" className="text-xs cursor-pointer select-none space-y-0.5">
                        <strong className="font-bold text-slate-800 flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                          Webshop & Lizenzvertrieb aktiv
                        </strong>
                        <span className="text-slate-500 block leading-normal">
                          Aktiviert die Webshop-Erweiterung ("Aura Boutique") mit Warenkorb, checkout, Bezahlmethoden und Bestellhistorie.
                        </span>
                      </label>
                    </div>

                    {/* Blog Toggle */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                      <input
                        id="toggle-blog-enabled"
                        type="checkbox"
                        checked={data.settings?.blogEnabled !== false}
                        onChange={(e) => {
                          onDataChange((prev: CRMData) => ({
                            ...prev,
                            settings: {
                              ...(prev.settings || ({} as any)),
                              blogEnabled: e.target.checked
                            }
                          }));
                        }}
                        className="h-4 w-4 mt-0.5 text-indigo-650 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                      />
                      <label htmlFor="toggle-blog-enabled" className="text-xs cursor-pointer select-none space-y-0.5">
                        <strong className="font-bold text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                          Fachblog & Newsroom aktiv
                        </strong>
                        <span className="text-slate-500 block leading-normal">
                          Veröffentlicht Ihre Fachbeiträge, SEO-News und Ratgeber im Blog-Tab des öffentlichen Frontends.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* --- WEBSHOP TAX & SHIPPING MANAGEMENT --- */}
                <div className="border-t border-slate-200/60 pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Receipt className="h-4.5 w-4.5 text-indigo-650" />
                      E-Commerce Steuer- & Versandkonditionen
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Regeln Sie Mehrwertsteuerklassen, Standard-Versandpauschalen, Schwellenwerte für portofreien Versand und den Versanddienstleister.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                    
                    {/* Steuersatz standardwert */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Inländischer Mehrwertsteuersatz (MwSt)
                      </label>
                      <div className="relative rounded-xl shadow-2xs">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-mono text-slate-950"
                          value={data.settings?.shopTaxRate ?? 19}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onDataChange((prev: CRMData) => ({
                              ...prev,
                              settings: {
                                ...(prev.settings || ({} as any)),
                                shopTaxRate: isNaN(val) ? 19 : val
                              }
                            }));
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-mono font-bold text-slate-400 bg-slate-100/60 border-l border-slate-200 rounded-r-xl px-2.5">
                          %
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-normal">
                        Der Prozentsatz wird für die Brutto/Netto-Darstellung im Checkout sowie für alle erzeugten Rechnungen herangezogen (Deutschland Standard: 19%).
                      </span>
                    </div>

                    {/* Versandkostenpauschale */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Standard Paket-Versandkosten
                      </label>
                      <div className="relative rounded-xl shadow-2xs">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full pl-3 pr-12 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-mono text-slate-950"
                          value={data.settings?.shopShippingFlat ?? 4.90}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onDataChange((prev: CRMData) => ({
                              ...prev,
                              settings: {
                                ...(prev.settings || ({} as any)),
                                shopShippingFlat: isNaN(val) ? 4.90 : val
                              }
                            }));
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-mono font-bold text-slate-400 bg-slate-100/60 border-l border-slate-200 rounded-r-xl px-2.5">
                          EUR
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-normal">
                        Basis-Versandpreis für den Transport physischer Güter oder Lizenzen (z.B. Box-Deliveries) per Paketpost.
                      </span>
                    </div>

                    {/* Versandfrei-Schwelle */}
                    <div className="space-y-1.5 mt-2 md:mt-0">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Kostenfreier Versand ab Bestellwert
                      </label>
                      <div className="relative rounded-xl shadow-2xs">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="z.B. 50 (Leer lassen fürs Deaktivieren)"
                          className="w-full pl-3 pr-12 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-mono text-slate-950"
                          value={data.settings?.shopFreeShippingThreshold || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onDataChange((prev: CRMData) => ({
                              ...prev,
                              settings: {
                                ...(prev.settings || ({} as any)),
                                shopFreeShippingThreshold: isNaN(val) ? undefined : val
                              }
                            }));
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-mono font-bold text-slate-400 bg-slate-100/60 border-l border-slate-200 rounded-r-xl px-2.5">
                          EUR
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-normal">
                        Kostenloser Versand wird ab Erreichen dieses Warenkorb-Bruttowerts automatisch gewährt (z.B. versandkostenfrei ab 50 €).
                      </span>
                    </div>

                    {/* Standard Logistik Dienstleister */}
                    <div className="space-y-1.5 mt-2 md:mt-0">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Standard Logistik-Versanddienst (Carrier)
                      </label>
                      <div className="relative rounded-xl shadow-2xs">
                        <input
                          type="text"
                          placeholder="z.B. DHL, UPS, Hermes..."
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-semibold text-slate-950"
                          value={data.settings?.shopDefaultCarrier || 'DHL'}
                          onChange={(e) => {
                            onDataChange((prev: CRMData) => ({
                              ...prev,
                              settings: {
                                ...(prev.settings || ({} as any)),
                                shopDefaultCarrier: e.target.value
                              }
                            }));
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-normal">
                        Dienstleister, der als Trägermarke im Checkout-Warenkorb und bei den Paketdaten genannt wird.
                      </span>
                    </div>

                  </div>
                </div>

                {/* Info Note */}
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3 text-xs text-indigo-700/95 leading-relaxed">
                  <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Automatisches Speichern aktiv</strong>
                    Ihre Einstellungen werden in Echtzeit synchronisiert und lokal im Browser sowie auf dem Backend-Hosting-Server gespeichert. Änderungen wirken sich unmittelbar auf alle Mandanten-Schnittstellen aus.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal High Density Status Footer */}
      <footer className="h-8 bg-slate-950 text-slate-400 px-4 flex items-center justify-between text-[10px] font-mono select-none flex-shrink-0 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span>SYSTEM: DATENSCHUTZKONFORM (OFFLINE-MODUS)</span>
        </div>
        <div>
          <span>AURA CRM • ENTERPRISE PORTALS SUITE v4.1</span>
        </div>
      </footer>

      {/* SIMULATED CUSTOMER SELECTION MODAL */}
      {isSimulateModalOpen && (
        <div id="simulate-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scale-up">
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-lg animate-ping"></span>
                <h3 className="text-sm font-extrabold uppercase font-mono tracking-wider">Mandanten-Vorschau (Frontend)</h3>
              </div>
              <button 
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-all font-bold text-xs"
              >
                ✕ Schließen
              </button>
            </div>

            <div className="p-6 space-y-4 text-slate-700">
              {onPreviewPublicFrontend && (
                <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <Eye className="w-4 h-4 text-indigo-650" />
                      Öffentliches Frontend (Corporate Homepage)
                    </span>
                    <span className="text-[9px] bg-indigo-200 text-indigo-850 px-2 py-0.5 rounded font-black font-sans uppercase">Vorschau</span>
                  </div>
                  <p className="text-[11px] text-indigo-805 leading-relaxed">
                    Betrachten Sie die unangebundene Homepage mit allen dynamischen Lizenzen unseres Webshops, Fachblogbeiträgen sowie rechtlichen Inhalten (Impressum & Datenschutz).
                  </p>
                  <button
                    onClick={() => {
                      setIsSimulateModalOpen(false);
                      onPreviewPublicFrontend();
                    }}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl tracking-wider uppercase font-mono transition-colors shadow-sm cursor-pointer"
                  >
                    Öffentliche Homepage ansehen →
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                Wählen Sie einen registrierten Mandanten aus, um seinen geschlossenen Mitgliederbereich (Frontend) live zu betrachten und zu testen. Alle im WordPress-Stil konfigurierten Plugins werden live in diesem Kunden-Frontend widergespiegelt!
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {data.customers.map(cust => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      setIsSimulateModalOpen(false);
                      if (onSimulateCustomer) onSimulateCustomer(cust.id);
                    }}
                    className="w-full text-left p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/65 flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {cust.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {cust.company} • {cust.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>Vorschau</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSimulateModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all border-none"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
