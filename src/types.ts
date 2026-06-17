export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: 'Aktiv' | 'Stammkunde' | 'Neukunde' | 'Inaktiv';
  username: string;
  passwordHash: string; // SHA-256 or simple hashed value
  notes: string;
  createdAt: string;
  activePhase?: number; // 1 to 5 for corporate roadmap
  completedTasks?: string[]; // list of completed roadmap checklist task IDs
  
  // Customizable Roadmap Config (Scharf schalten & Templates)
  roadmapEnabled?: boolean; 
  roadmapTemplateId?: string; // 'marketing' | 'vorsorge' | 'gewerbe' | 'finance'
  roadmapPhases?: {
    phase: number;
    title: string;
    desc: string;
  }[];
  roadmapTasks?: {
    id: string;
    phase: number;
    title: string;
    desc: string;
    role: 'Kunde' | 'Berater' | 'Beide';
    actionLabel?: string;
    actionType?: 'upload' | 'appointment' | 'chat';
  }[];
}

export interface UploadedFile {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  type: string; // e.g. "application/pdf", "video/mp4", "image/png"
  size: number; // in bytes
  category: 'Vertrag' | 'Video' | 'Datei';
  uploadDate: string;
  dataUrl?: string; // If actual file was uploaded
  adminNote?: string;
  status: 'Eingereicht' | 'In Bearbeitung' | 'Genehmigt' | 'Abgelehnt';
  signature?: {
    signedByName: string;
    signedAt: string;
    signatureHash: string;
    drawingDataUrl?: string;
  };
}

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
  tasks: {
    id: string;
    phase: number;
    title: string;
    desc: string;
    role: 'Kunde' | 'Berater' | 'Beide';
    actionLabel?: string;
    actionType?: 'upload' | 'appointment' | 'chat';
  }[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number; // gross
  taxAmount: number; // VAT
  netAmount: number; // net
  taxRate: number; // e.g., 19
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: 'Offen' | 'Bezahlt' | 'Überfällig' | 'Storno';
  description: string;
  paymentMethod?: 'Überweisung' | 'Lastschrift' | 'PayPal' | 'Kreditkarte';
  paidAt?: string;
  items: InvoiceItem[];
}

export interface DirectMessage {
  id: string;
  senderId: string; // 'admin' or customerId
  receiverId: string; // 'admin' or customerId
  content: string; // Decrypted or backup content
  encryptedContent?: string; // Raw encrypted cipher string
  isEncrypted?: boolean;
  timestamp: string;
  isRead: boolean;
  syncStatus?: 'Synced' | 'PendingSync';
  attachment?: {
    name: string;
    type: string;
    size: number;
    dataUrl: string; // Base64 content
  };
}

export interface CalendarAppointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  description: string;
  customerId?: string; // empty if internal
  status?: 'Ausstehend' | 'Bestätigt' | 'Abgelehnt';
}

export interface BotRule {
  id: string;
  triggerKeywords: string[]; // list of lowercased keywords to match
  answer: string;
  usagesCount: number;
  lastEditedBy?: string;
}

export interface UnresolvedQuery {
  id: string;
  query: string;
  timestamp: string;
  customerName: string;
  customerId: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  supplierId?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Draft';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Offen' | 'In Bearbeitung' | 'Versendet' | 'Geliefert' | 'Storniert';
  paymentMethod: 'Überweisung' | 'Lastschrift' | 'PayPal' | 'Kreditkarte';
  paymentStatus: 'Ausstehend' | 'Bezahlt';
  createdAt: string;
  carrier?: 'DHL' | 'UPS' | 'DPD' | 'Hermes';
  trackingNumber?: string;
  shippingLabelPrinted?: boolean;
  shippingAddress: string;
  invoiceId?: string;
  dsgvoConsent: boolean;
}

export interface BlogPostComment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  customerId?: string;
  dsgvoConsent: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image?: string;
  category: string;
  status: 'Draft' | 'Published';
  createdAt: string;
  authorName: string;
  comments: BlogPostComment[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userDisplayName: string;
  details: string;
}

export interface SystemSettings {
  activeTemplateId: string;
  cookieConsentRequired: boolean;
  gdprLoggingEnabled: boolean;
  shopEnabled: boolean;
  blogEnabled: boolean;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  iban: string;
  bic: string;
  taxId: string;
  appointmentsEnabled?: boolean;
  invoicesEnabled?: boolean;
  videosEnabled?: boolean;
  botEnabled?: boolean;
  chatEnabled?: boolean;
  siteTitle?: string;
  siteSeoDescription?: string;
  siteHeaderName?: string;
}

export interface CRMData {
  customers: Customer[];
  files: UploadedFile[];
  messages: DirectMessage[];
  appointments: CalendarAppointment[];
  botRules?: BotRule[];
  unresolvedQueries?: UnresolvedQuery[];
  invoices?: Invoice[];
  customTemplates?: RoadmapTemplate[];
  products?: Product[];
  orders?: Order[];
  blogPosts?: BlogPost[];
  auditLogs?: AuditLog[];
  settings?: SystemSettings;
  suppliers?: Supplier[];
}
