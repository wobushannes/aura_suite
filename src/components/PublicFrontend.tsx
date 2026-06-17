import React, { useState, useMemo } from 'react';
import { CRMData, Product, BlogPost, BlogPostComment, Order, OrderItem, Invoice } from '../types';
import { 
  ShoppingBag, 
  BookOpen, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Cpu, 
  Lock, 
  ArrowLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Scale
} from 'lucide-react';

interface PublicFrontendProps {
  data: CRMData;
  onDataChange: (newData: CRMData | ((prev: CRMData) => CRMData)) => void;
  onOpenLogin: () => void;
  isAdminPreview?: boolean;
  onClosePreview?: () => void;
}

export default function PublicFrontend({ 
  data, 
  onDataChange, 
  onOpenLogin, 
  isAdminPreview = false,
  onClosePreview 
}: PublicFrontendProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'blog' | 'impressum' | 'datenschutz'>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Webshop details
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // Checkout Form Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Überweisung' | 'PayPal' | 'Kreditkarte'>('Überweisung');
  const [dsgvoConsent, setDsgvoConsent] = useState(false);

  // Comment Form details
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentConsent, setCommentConsent] = useState(false);

  const shopEnabled = data.settings?.shopEnabled !== false;
  const blogEnabled = data.settings?.blogEnabled !== false;

  // Filter public items
  const activeProducts = useMemo(() => {
    return (data.products || []).filter(p => p.status !== 'Draft');
  }, [data.products]);

  const categories = useMemo(() => {
    return Array.from(new Set(activeProducts.map(p => p.category))).filter(Boolean);
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [activeProducts, searchTerm, categoryFilter]);

  const publishedPosts = useMemo(() => {
    return (data.blogPosts || [])
      .filter(p => p.status === 'Published')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [data.blogPosts]);

  // Cart functions
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingFlat = 4.90;
  const totalAmount = cartSubtotal + shippingFlat;

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Kann nicht mehr hinzufügen. Nur noch ${product.stock} Stück auf Lager.`);
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    const realProd = activeProducts.find(p => p.id === productId);
    if (realProd && qty > realProd.stock) {
      alert(`Maximal verfügbarer Bestand: ${realProd.stock} Stück.`);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  // Checkout submission
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerEmail || !customerAddress) {
      alert('Bitte füllen Sie Name, E-Mail und Lieferadresse aus.');
      return;
    }
    if (!dsgvoConsent) {
      alert('Bitte stimmen Sie den DSGVO-Richtlinien zu.');
      return;
    }

    // Verify stock
    for (const item of cart) {
      const dbProd = (data.products || []).find(p => p.id === item.product.id);
      if (!dbProd || dbProd.stock < item.quantity) {
        alert(`Entschuldigung, der Artikel '${item.product.name}' ist zwischenzeitlich vergriffen.`);
        return;
      }
    }

    const orderNum = `ORD-${Date.now().toString().substring(5)}`;
    const newItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
      total: item.product.price * item.quantity
    }));

    // Invoice generator
    const invoiceNum = `RE-GST-${Date.now().toString().substring(7)}`;
    const net = Number((totalAmount / 1.19).toFixed(2));
    const tax = Number((totalAmount - net).toFixed(2));

    const newInvoice: Invoice = {
      id: `inv-gst-${Date.now()}`,
      invoiceNumber: invoiceNum,
      customerId: 'guest',
      customerName: customerName,
      amount: Number(totalAmount.toFixed(2)),
      taxAmount: tax,
      netAmount: net,
      taxRate: 19,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: 'Offen',
      description: `Rechnung Gast-Bestellung ${orderNum}`,
      paymentMethod: paymentMethod,
      items: cart.map(item => ({
        id: `inv-item-${Math.random().toString(36).substring(7)}`,
        description: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity
      }))
    };

    const newOrder: Order = {
      id: `order-gst-${Date.now()}`,
      orderNumber: orderNum,
      customerId: 'guest',
      customerName: `${customerName} (${customerCompany || 'Gast'})`,
      items: newItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'Offen',
      paymentMethod: paymentMethod,
      paymentStatus: 'Ausstehend',
      createdAt: new Date().toISOString(),
      shippingAddress: `${customerAddress}, Tel: ${customerPhone}`,
      dsgvoConsent: true,
      invoiceId: newInvoice.id
    };

    // Update global database
    onDataChange(prev => {
      // Subtract stock
      const updatedProducts = (prev.products || []).map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? 'Out of Stock' : newStock <= 5 ? 'Low Stock' : 'In Stock' as any
          };
        }
        return p;
      });

      return {
        ...prev,
        products: updatedProducts,
        orders: [newOrder, ...(prev.orders || [])],
        invoices: [newInvoice, ...(prev.invoices || [])]
      };
    });

    setOrderSuccess(newOrder);
    setCart([]);
    setIsCheckingOut(false);
  };

  // Comenting submission
  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentName || !commentContent) {
      alert('Bitte geben Sie einen Namen und Kommentartext an.');
      return;
    }
    if (!commentConsent) {
      alert('Bitte stimmen Sie zuerst den Datenschutzrichtlinien zu.');
      return;
    }

    const newComment: BlogPostComment = {
      id: `comm-pub-${Date.now()}`,
      authorName: commentName,
      authorEmail: 'public-visitor@aerocms.de',
      content: commentContent,
      createdAt: new Date().toISOString(),
      isApproved: true, // Autoapprove standard guest comments on demo portal
      dsgvoConsent: true
    };

    onDataChange(prev => {
      const updatedPosts = (prev.blogPosts || []).map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      });
      return {
        ...prev,
        blogPosts: updatedPosts
      };
    });

    // Refresh view
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null);
    }

    setCommentName('');
    setCommentContent('');
    setCommentConsent(false);
    alert('Vielen Dank! Ihr Kommentar wurde live gepostet.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden relative">
      
      {/* 1. ADMIN PREVIEW BAR */}
      {isAdminPreview && (
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold font-sans shadow-md z-50 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 font-mono text-[9px] rounded font-extrabold uppercase animate-pulse">Livevorschau</span>
            <span>Sie betrachten das öffentliche Frontend der <strong>{data.settings?.companyName || 'AeroCMS Enterprise Suite'}</strong></span>
          </div>
          {onClosePreview && (
            <button
              onClick={onClosePreview}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-950 border border-slate-800 text-white text-[10px] uppercase font-mono tracking-wider rounded-lg transition-all cursor-pointer"
            >
              ← Admin-Zentrale schliessen
            </button>
          )}
        </div>
      )}

      {/* 2. STICKY HEADER HERO */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('home'); setSelectedPost(null); }}>
          <div className="w-8.5 h-8.5 bg-indigo-600 rounded-lg flex items-center justify-center font-extrabold text-white text-base">
            A
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm tracking-tight block uppercase">
              {data.settings?.siteHeaderName || data.settings?.companyName || 'AeroCMS Suite'}
            </span>
            <span className="text-[10px] text-indigo-600 font-mono font-bold tracking-wider uppercase block leading-none">
              Enterprise Systemhaus
            </span>
          </div>
        </div>

        {/* Dynamic Navigations links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-slate-600">
          <button 
            type="button"
            onClick={() => { setActiveTab('home'); setSelectedPost(null); }}
            className={`transition-colors cursor-pointer ${activeTab === 'home' ? 'text-indigo-600' : 'hover:text-slate-900'}`}
          >
            Startseite
          </button>
          
          {shopEnabled && (
            <button 
              type="button"
              onClick={() => { setActiveTab('shop'); setSelectedPost(null); }}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'shop' ? 'text-indigo-600' : 'hover:text-slate-900'}`}
            >
              Webshop
              <span className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">Aktiv</span>
            </button>
          )}

          {blogEnabled && (
            <button 
              type="button"
              onClick={() => { setActiveTab('blog'); setSelectedPost(null); }}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'blog' ? 'text-indigo-600' : 'hover:text-slate-900'}`}
            >
              Blog & News
              <span className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">Aktiv</span>
            </button>
          )}

          <button 
            type="button"
            onClick={() => { setActiveTab('impressum'); setSelectedPost(null); }}
            className={`transition-colors cursor-pointer ${activeTab === 'impressum' ? 'text-indigo-600' : 'hover:text-slate-900'}`}
          >
            Impressum
          </button>

          <button 
            type="button"
            onClick={() => { setActiveTab('datenschutz'); setSelectedPost(null); }}
            className={`transition-colors cursor-pointer ${activeTab === 'datenschutz' ? 'text-indigo-600' : 'hover:text-slate-900'}`}
          >
            Datenschutz
          </button>
        </nav>

        {/* Action Button: Gateway Login */}
        <div className="flex items-center gap-3">
          {shopEnabled && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg relative cursor-pointer transition-colors"
              title="Warenkorb öffnen"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kunden-Portal / Login</span>
          </button>
        </div>
      </header>

      {/* 3. CORE FRONTEND GRID & MAIN DISPLAY */}
      <main className="flex-grow overflow-y-auto">

        {/* --- STARTSEITE / HOME VIEW --- */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            {/* Elegant Hero Banner */}
            <section className="bg-slate-900 text-white py-24 px-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent"></div>
              <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full font-mono text-[10px] text-indigo-300 uppercase font-black tracking-widest">
                  Enterprise Software & CMS Lösungen
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white font-sans max-w-3xl mx-auto">
                  Moderne Digital-Architektur. Sicher, verschlüsselt, performant.
                </h1>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans">
                  Willkommen bei <strong>{data.settings?.companyName || 'Kraftwerk Systems'}</strong>. Wir konzipieren und implementieren hochperformante Content-Management-Systeme, maßgeschneiderte Enterprise-Schnittstellen und kryptografische Kommunikations-Lösungen für anspruchsvolle Mandanten nach bestem deutschen Industrie-Standard. 
                </p>
                <div className="pt-6 flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => {
                      if (shopEnabled) {
                        setActiveTab('shop');
                      } else {
                        setActiveTab('impressum');
                      }
                    }}
                    className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl tracking-wider uppercase flex items-center gap-2 transition-all shadow-md shadow-indigo-700/10 cursor-pointer"
                  >
                    <span>{shopEnabled ? 'Software-Licensing ansehen' : 'Jetzt Kontakt aufnehmen'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onOpenLogin}
                    className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Kunden-Zugang öffnen →
                  </button>
                </div>
              </div>
            </section>

            {/* Core Modules Grid Showcase - showing which ones are Active/Inactive */}
            <section className="max-w-7xl mx-auto py-16 px-6">
              <div className="text-center space-y-2 mb-12">
                <p className="text-[10px] font-mono tracking-widest text-indigo-600 font-bold uppercase">System-Zertifikate</p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">System-Zentrale: Aktueller Modul-Status</h2>
                <p className="text-slate-500 text-xs max-w-lg mx-auto">Der Administrator schaltet Kernmodule flexibel im Backend scharf. Hier sehen Sie den Echtzeit-Modulstatus unserer Plattform.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Shopping System Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-indigo-55 px-2.5 rounded-lg flex items-center justify-center text-indigo-600">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Kraftwerk Boutique-Shop</h3>
                      <p className="text-slate-500 text-[11px] mt-1 leading-normal">Volldigitalisierter Software-Vertrieb & Lizenz-Erwerb mit Checkout und automatischer Rechnungsstellung.</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">STATUS:</span>
                    {shopEnabled ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[9px] border border-emerald-150 tracking-wider font-mono">AKTIV</span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 font-medium rounded-full text-[9px] tracking-wider font-mono">INAKTIV</span>
                    )}
                  </div>
                </div>

                {/* 2. Blog News */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-indigo-55 px-2.5 rounded-lg flex items-center justify-center text-indigo-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Leitfäden & Abonnenten-Blog</h3>
                      <p className="text-slate-500 text-[11px] mt-1 leading-normal">Expertenberichte, Systemdokumente und Profi-Anleitungen direkt aus unserer Redaktion mit Kommentarfunktion.</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">STATUS:</span>
                    {blogEnabled ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[9px] border border-emerald-150 tracking-wider font-mono">AKTIV</span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 font-medium rounded-full text-[9px] tracking-wider font-mono">INAKTIV</span>
                    )}
                  </div>
                </div>

                {/* 3. AI Assistant */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-indigo-55 px-2.5 rounded-lg flex items-center justify-center text-indigo-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">KI-Bot Trainingssystem</h3>
                      <p className="text-slate-500 text-[11px] mt-1 leading-normal">Integrierte künstliche Intelligenz, die häufige Kundenfragen selbstständig lernt und im FAQ-Stil auflöst.</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">STATUS:</span>
                    {data.settings?.botEnabled !== false ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[9px] border border-emerald-150 tracking-wider font-mono">AKTIV</span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 font-medium rounded-full text-[9px] tracking-wider font-mono">INAKTIV</span>
                    )}
                  </div>
                </div>

                {/* 4. Safe Chat Encrypted */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-indigo-55 px-2.5 rounded-lg flex items-center justify-center text-indigo-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Ende-zu-Ende Safe Chat</h3>
                      <p className="text-slate-500 text-[11px] mt-1 leading-normal">Kryptografisch gesicherte Chaträume mit AES-AES 256 Algorithmen halten DMs absolut vertraulich.</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">STATUS:</span>
                    {data.settings?.chatEnabled !== false ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[9px] border border-emerald-150 tracking-wider font-mono">AKTIV</span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 font-medium rounded-full text-[9px] tracking-wider font-mono">INAKTIV</span>
                    )}
                  </div>
                </div>

              </div>
            </section>

            {/* Why AeroCMS block */}
            <section className="bg-white border-t border-slate-200 py-16 px-6">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <span className="text-indigo-600 font-bold text-xs uppercase font-mono px-2.5 py-1 bg-indigo-50 rounded">Systemvorteile</span>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">Ausfallsicher, gesetzeskonform & flexibel</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Unsere Kernentwicklung folgt dem Prinzip der Datensparsamkeit. Während andere Systeme vertrauliche Mandantendaten ungeschützt auf Drittanbieter-Cloud-Server senden, bündelt die Kraftwerk Suite alle Workflows in einer sicheren, offline-fähigen Offline-Zentrale. 
                  </p>
                  <ul className="space-y-3.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Volle E2E-Verschlüsselung sensibler Nachrichten-Uploads</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Live-Datenexport nach Art. 15 DSGVO integriert</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Echtzeit-Synchronisierung bei bestehender Online-Verbindung</span>
                    </li>
                  </ul>
                </div>
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600" />
                    Rechtliche Rahmenausstattung
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Wir garantieren eine vollständig DSGVO-konforme Architektur. Die Speicherung von Kundendatenbanksystemen ist herstellerunabhängig gesichert. Für detaillierte Bestimmungen oder um einen rechtssicheren Signaturvorgang einzusehen, loggen Sie sich einfach mit Ihren Mandantendaten im Portal ein.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveTab('impressum')} className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                      <span>Impressum sichten</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setActiveTab('datenschutz')} className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                      <span>Datenschutz sichten</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- 4. WEBSHOP TAB VIEW --- */}
        {activeTab === 'shop' && shopEnabled && (
          <div className="max-w-7xl mx-auto py-12 px-6 animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Offizieller Lizenzvertrieb</span>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">AeroCMS Boutique & Software-Licenses</h1>
              </div>

              {/* Live search input */}
              <div className="flex gap-2.5 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Lizenz oder Modul suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 w-full md:w-64"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 outline-none"
                >
                  <option value="all">Alle Kategorien</option>
                  <option value="Software & Lizenzen">Software & Lizenzen</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Enterprise Integration">Enterprise Integration</option>
                </select>
              </div>
            </div>

            {/* Main store product cards */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
                Keine Lizenzen gefunden, die den Suchbedingungen entsprechen.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500/20 hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Product Category badge */}
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[9px] tracking-wider font-mono">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Art. {p.sku}</span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900 text-base leading-tight">{p.name}</h3>
                        <p className="text-slate-500 text-xs leading-normal">{p.description}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-105 mt-6 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">EINMALPREIS</span>
                        <span className="font-extrabold text-indigo-705 text-lg">
                          {p.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </span>
                        <span className="text-[9px] text-slate-400 block">inkl. 19% MwSt.</span>
                      </div>

                      {p.stock === 0 ? (
                        <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] px-3 py-1.5 rounded-lg font-bold">Ausverkauft</span>
                      ) : (
                        <button
                          onClick={() => addToCart(p)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          In den Korb
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- 5. PORTAL-BLOG NEWS TAB VIEW --- */}
        {activeTab === 'blog' && blogEnabled && (
          <div className="max-w-5xl mx-auto py-12 px-6 animate-fade-in space-y-8">
            
            {selectedPost ? (
              // READ SINGLE POST VIEW
              <div className="space-y-8">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Zurück zur Blog-Übersicht
                </button>

                <article className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[9px] uppercase tracking-wider font-mono">
                        {selectedPost.category}
                      </span>
                      <span>•</span>
                      <span>Von {selectedPost.authorName}</span>
                      <span>•</span>
                      <span>{new Date(selectedPost.createdAt).toLocaleDateString('de-DE')}</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">{selectedPost.title}</h1>
                    <p className="text-slate-650 text-sm leading-relaxed font-bold italic border-l-4 border-indigo-500 pl-4">
                      {selectedPost.summary}
                    </p>
                  </div>

                  <div className="prose max-w-none text-slate-600 text-xs md:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-100 whitespace-pre-wrap">
                    {selectedPost.content}
                  </div>
                </article>

                {/* Live public Comments thread */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-8 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Diskussion ({selectedPost.comments.length} Kommentare)
                  </h3>

                  {selectedPost.comments.length === 0 ? (
                    <div className="text-slate-400 text-xs py-2 italic">
                      Noch keine Kommentare zu diesem Beitrag. Seien Sie der Erste!
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {selectedPost.comments.map((comm) => (
                        <div key={comm.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">{comm.authorName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(comm.createdAt).toLocaleString('de-DE')}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed">{comm.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment submit form */}
                  <form onSubmit={(e) => handleAddComment(e, selectedPost.id)} className="space-y-4 border-t border-slate-100 pt-6">
                    <h4 className="font-extrabold text-slate-800 text-sm">Einen Kommentar hinterlassen</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Ihr Name</label>
                        <input
                          type="text"
                          required
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          placeholder="z.B. Max Mustermann"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div className="flex items-end text-[10px] text-slate-400 pb-2">
                        Ihre E-Mail-Adresse wird DSGVO-konform verschlüsselt und nicht öffentlich angezeigt.
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Ihr Kommentar</label>
                      <textarea
                        required
                        rows={4}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Was denken Sie über diesen Beitrag? Schreiben Sie freundlich und respektvoll..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-2.5">
                      <input
                        id="comment-gdpr"
                        type="checkbox"
                        required
                        checked={commentConsent}
                        onChange={(e) => setCommentConsent(e.target.checked)}
                        className="w-4 h-4 mt-0.5"
                      />
                      <label htmlFor="comment-gdpr" className="text-[11px] text-slate-500 leading-normal">
                        Ich bin einverstanden, dass mein Name und Kommentar auf dieser Website live veröffentlicht werden. Meine Daten werden gemäß der DSGVO-Datenschutzerklärung vertraulich im AeroCMS-Lokalarchiv abgelegt.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl tracking-wider uppercase font-mono transition-all cursor-pointer"
                    >
                      Kommentar absenden
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // GENERAL BLOG POSTS LIST
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-200 pb-6 text-center md:text-left">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">AeroCMS Portal-Blog</span>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Neueste Leitfäden & Fachartikel</h1>
                  <p className="text-slate-500 text-xs mt-1">Spannende Beiträge aus unserer Software-Entwicklung und Systemberatung.</p>
                </div>

                {publishedPosts.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
                    Aktuell sind noch keine Fachberichte im Blog publiziert.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {publishedPosts.map((post) => (
                      <div key={post.id} className="bg-white border border-slate-210 rounded-2xl p-6 md:p-8 hover:border-indigo-550/20 hover:shadow-sm transition-all flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-xs text-slate-450 font-mono">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[9px] uppercase tracking-wider">
                              {post.category}
                            </span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString('de-DE')}</span>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-lg leading-snug hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedPost(post)}>
                            {post.title}
                          </h3>

                          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{post.summary}</p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-mono">Comments: {post.comments.length}</span>
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Beitrag lesen</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- 6. IMPRESSUM VIEW --- */}
        {activeTab === 'impressum' && (
          <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Rechtliche Offenlegung</span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Impressum</h1>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-slate-700 text-xs leading-normal">
              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Angaben gemäß § 5 TMG</h3>
                <p>
                  <strong>Max Mustermann</strong><br />
                  Muster-Softwareberatung & Standard-Software<br />
                  Musterstraße 12<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Kontaktmöglichkeiten</h3>
                <p>
                  Telefon: +49 1234 567890<br />
                  E-Mail: <a href="mailto:support@musterdomain.de" className="text-indigo-600 underline">support@musterdomain.de</a><br />
                  Webseite: <a href="https://www.musterdomain.de" className="text-indigo-600 underline">www.musterdomain.de</a>
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Umsatzsteuer-Identifikationsnummer</h3>
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                  <strong>DE 123 456 789</strong>
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Aufsichtsbehörde</h3>
                <p>
                  Gewerbeamt Musterstadt, Rathausplatz 1, 12345 Musterstadt
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">EU-Streitschlichtung</h3>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" className="text-indigo-600 underline">https://ec.europa.eu/consumers/odr</a>.<br />
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
                <p>
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>

              <p className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-4">
                Stand: Juni 2026 • Generiert für das lokale Safe-Hostingsystem Software Suite v4.1
              </p>
            </div>
          </div>
        )}

        {/* --- 7. DATENSCHUTZ VIEW --- */}
        {activeTab === 'datenschutz' && (
          <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">EU-DSGVO Konformität</span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Datenschutzerklärung</h1>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-slate-700 text-xs leading-normal">
              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">1. Datenschutz auf einen Blick</h3>
                <h4 className="font-bold text-slate-800 text-[11px]">Allgemeine Hinweise</h4>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                </p>
                <h4 className="font-bold text-slate-800 text-[11px]">Datenerfassung auf dieser Website</h4>
                <p>
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular, im Webshop-Checkout oder in den Kommentaren eintragen (z. B. Name, E-Mail-Adresse). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">2. Sonderschutz: Integriertes E2E-Archiv & Offline-Vorteile</h3>
                <p>
                  Das AeroCMS-System setzt auf maximale Datensparsamkeit. Sämtliche personenbezogenen Daten, die innerhalb des Mandantenportals anfallen – darunter vertrauliche PDF-Kooperationsverträge, Videofreigaben und die geschriebenen Chiffren des Safe-Chats – werden ausschließlich mit Clientseitigen AES-256 standardisierten Schlüsseln verarbeitet. Bei Auslastung des Offline-Modus verbleiben diese Daten zu 100% in Ihrer lokalen Sandbox des Browsers und werden beim Schließen des Tabs restlos verworfen, sofern Sie diese nicht manuell exportiert haben.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">3. Ihre Rechte gemäß Art. 15 DSGVO</h3>
                <p>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen.
                </p>
                <p className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-indigo-850">
                  <strong>DSGVO Datenexport:</strong> Als registrierter Kunde können Sie im Register 'Profil & Stammdaten' jederzeit Ihr vollständiges maschinenlesbares JSON-Archiv mit nur einem Klick nach Art. 15 DSGVO exportieren.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">4. Cookies & Web-Performance</h3>
                <p>
                  Unsere Website verwendet aus technischen Gründen keine Tracking-Cookies von Drittanbietern oder Google Analytics. Zur Bereitstellung des Einkaufskorbs unseres Software-Webshops und zur Beibehaltung Ihrer aktiven Portalsitzung nutzen wir technisch absolut notwendige Sitzungsvariablen des lokalen Browserspeichers (LocalStorage und SessionStorage). Es erfolgt keine Werbevermarktung.
                </p>
              </section>

              <p className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-4">
                Stand: Juni 2026 • Datenschutzprüfung unter Aufsicht der Operations Control Inc.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* --- Shopping Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
            <div className="space-y-4 flex-grow overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-150 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  Warenkorb ({cartCount})
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Schließen
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Vielen Dank für Ihren Einkauf!</h4>
                    <p className="text-slate-500 text-[11px]">Bestellung <strong>{orderSuccess.orderNumber}</strong> wurde live verbucht und im Admin-Bereich hinterlegt.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-left text-slate-600 max-w-xs mx-auto">
                    <strong>Gast-Bestellung:</strong><br />
                    Betrag: {orderSuccess.totalAmount} EUR<br />
                    Status: Offen (Vorbereitung)<br />
                    Rechnung: Vorkasse per E-Mail versandt.
                  </div>
                  <button 
                    onClick={() => setOrderSuccess(null)}
                    className="p-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl w-full cursor-pointer"
                  >
                    Weiter einkaufen
                  </button>
                </div>
              ) : isCheckingOut ? (
                // CHECKOUT FORM
                <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2">
                  <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-[11px] text-indigo-900 leading-normal">
                    Füllen Sie die Gastdaten aus. Die Bestellung und entsprechende Rechnungslegung wird in Echtzeit im AeroCMS Dashboard an unsere Administration übermittelt.
                  </div>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Vollständiger Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="z.B. Max Mustermann"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-750 outline-none focus:border-indigo-550 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">E-Mail Adresse *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="max@muster.de"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-750 outline-none focus:border-indigo-550 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Firma (Optional)</label>
                        <input
                          type="text"
                          value={customerCompany}
                          onChange={(e) => setCustomerCompany(e.target.value)}
                          placeholder="Muster GmbH"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-750 outline-none focus:border-indigo-550 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Telefon (Optional)</label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+49 123 456789"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-750 outline-none focus:border-indigo-550 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Zahlungsmethode</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-755 outline-none focus:border-indigo-550"
                        >
                          <option value="Überweisung">Vorkasse Überweisung</option>
                          <option value="PayPal">PayPal Express Integration</option>
                          <option value="Kreditkarte">Stripe Kreditkarte</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Anschrift für Rechnungslegung *</label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Musterstraße 1, 80331 München, Germany"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-750 outline-none focus:border-indigo-550 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-start gap-2.5 pt-2">
                      <input
                        id="gdpr-consent"
                        type="checkbox"
                        required
                        checked={dsgvoConsent}
                        onChange={(e) => setDsgvoConsent(e.target.checked)}
                        className="w-4 h-4 mt-0.5"
                      />
                      <label htmlFor="gdpr-consent" className="text-[10px] text-slate-500 leading-normal">
                        Ich willige ein, dass meine Daten laut der DSGVO-Richtlinie zur Bearbeitung dieser Gastbestellung im ungebundenen AeroCMS-Ablagesystem sicher hinterlegt werden. *
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Zurück zum Korb
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kaufen ({totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})</span>
                    </button>
                  </div>
                </form>
              ) : cart.length === 0 ? (
                <div className="py-24 text-center text-slate-400 text-xs">
                  Ihr Einkaufskorb ist aktuell leer.
                </div>
              ) : (
                // STANDARD CART LIST
                <div className="space-y-4 pt-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-150 rounded-xl">
                      <div className="space-y-0.5 max-w-[65%]">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Einmalig {item.product.price} EUR</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="text-slate-500 hover:text-indigo-600 font-bold text-xs px-1 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-750 font-mono w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="text-slate-500 hover:text-indigo-600 font-bold text-xs px-1 cursor-pointer font-sans"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => updateCartQty(item.product.id, 0)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Calculations and button */}
                  <div className="border-t border-slate-150 pt-4 space-y-2 text-xs text-slate-650">
                    <div className="flex justify-between">
                      <span>Zwischensumme:</span>
                      <span className="font-semibold text-slate-800">{cartSubtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Versandpauschale (E-Delivery / Setup):</span>
                      <span className="font-semibold text-slate-800">{shippingFlat.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
                      <span>Gesamtbetrag:</span>
                      <span>{totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl tracking-wider uppercase font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-650/10"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zur Kasse gehen</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
