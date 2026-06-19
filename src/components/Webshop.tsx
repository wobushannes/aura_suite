import React, { useState, useMemo } from 'react';
import { Product, Order, OrderItem, Customer, CRMData, Invoice } from '../types';
import { ShoppingCart, Search, Heart, ShieldCheck, Tag, ShoppingBag, Eye, CreditCard, CheckCircle2, Truck, ClipboardList, Info, AlertCircle, FileText } from 'lucide-react';

interface WebshopProps {
  customer: Customer;
  data: CRMData;
  onDataChange: (data: CRMData) => void;
  logAction: (action: string, details: string) => void;
  activeTemplate: any;
  onTabChange?: (tab: string) => void;
}

export default function Webshop({ customer, data, onDataChange, logAction, activeTemplate, onTabChange }: WebshopProps) {
  const [activeSubTab, setActiveSubTab] = useState<'shop' | 'orders'>('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<boolean>(false);

  // Checkout Form
  const [shippingAddress, setShippingAddress] = useState(customer.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'Überweisung' | 'Lastschrift' | 'PayPal' | 'Kreditkarte'>('Überweisung');
  const [dsgvoConsent, setDsgvoConsent] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  const products = data.products || [];
  const orders = data.orders || [];

  // Filter out drafts and list categories
  const shopProducts = useMemo(() => {
    return products.filter(p => p.status !== 'Draft');
  }, [products]);

  const categories = useMemo(() => {
    return Array.from(new Set(shopProducts.map(p => p.category))).filter(Boolean);
  }, [shopProducts]);

  const filteredProducts = useMemo(() => {
    return shopProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [shopProducts, searchTerm, categoryFilter]);

  // Customer Orders
  const customerOrders = useMemo(() => {
    return orders.filter(o => o.customerId === customer.id)
                 .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, customer.id]);

  // Cart Mechanics
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Tax & Shipping parameters configured in settings
  const shopTaxRate = data.settings?.shopTaxRate ?? 19;
  const shopShippingFlat = data.settings?.shopShippingFlat ?? 4.90;
  const shopFreeShippingThreshold = data.settings?.shopFreeShippingThreshold;
  const shopDefaultCarrier = data.settings?.shopDefaultCarrier || 'DHL';

  // Shipping cost after free shipping threshold check
  const isFreeShipping = typeof shopFreeShippingThreshold === 'number' && shopFreeShippingThreshold > 0 && cartSubtotal >= shopFreeShippingThreshold;
  const shippingFlat = isFreeShipping ? 0 : shopShippingFlat;
  const totalAmount = cartSubtotal + shippingFlat;

  const handleAddToCart = (product: Product) => {
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
    setShowCartDrawer(true);
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    const prod = products.find(p => p.id === productId);
    if (prod && quantity > prod.stock) {
      alert(`Maximal verfügbarer Bestand: ${prod.stock} Stück.`);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!shippingAddress.trim()) {
      alert('Bitte geben Sie eine gültige Lieferadresse an.');
      return;
    }
    if (!dsgvoConsent) {
      alert('Bitte stimmen Sie zuerst den DSGVO-Verarbeitungsrichtlinien am Checkout zu.');
      return;
    }

    // Double check availability
    for (const item of cart) {
      const realP = products.find(p => p.id === item.product.id);
      if (!realP || realP.stock < item.quantity) {
        alert(`Entschuldigung, '${item.product.name}' ist zwischenzeitlich vergriffen oder nicht mehr in dieser Menge verfügbar.`);
        return;
      }
    }

    const orderNum = `ORD-${Date.now().toString().substring(5)}`;
    const newOrderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
      total: item.product.price * item.quantity
    }));

    // Create connected invoice
    const invoiceNum = `RE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const net = Number((totalAmount / (1 + shopTaxRate / 100)).toFixed(2));
    const tax = Number((totalAmount - net).toFixed(2));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNum,
      customerId: customer.id,
      customerName: customer.name,
      amount: Number(totalAmount.toFixed(2)),
      taxAmount: tax,
      netAmount: net,
      taxRate: shopTaxRate,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // 14 days net
      status: 'Offen',
      description: `Rechnung zur Webshop Bestellung ${orderNum}`,
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
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      customerId: customer.id,
      customerName: customer.name,
      items: newOrderItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'Offen',
      paymentMethod,
      paymentStatus: 'Ausstehend',
      createdAt: new Date().toISOString(),
      shippingAddress,
      invoiceId: newInvoice.id,
      dsgvoConsent: true
    };

    // Decrement stocks
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        const remaining = p.stock - cartItem.quantity;
        return {
          ...p,
          stock: remaining,
          status: remaining === 0 ? 'Out of Stock' as const : remaining <= 5 ? 'Low Stock' as const : 'In Stock' as const
        };
      }
      return p;
    });

    const refreshedCRMInvoices = [...(data.invoices || []), newInvoice];

    onDataChange({
      ...data,
      products: updatedProducts,
      orders: [...orders, newOrder],
      invoices: refreshedCRMInvoices
    });

    logAction('Shop-Bestellung aufgegeben', `Bestellung: ${orderNum}, Betrag: ${totalAmount.toFixed(2)} €, DSGVO zugestimmt: Ja`);

    setOrderCompleted(newOrder);
    setCart([]);
    setCheckoutStep(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-600" />
            Boutique & Hardware Webshop
          </h1>
          <p className="text-xs text-slate-500 mt-1">Hier können Sie Dienstleistungen, Lizenzen und Hardware direkt über Ihr Kundenkonto erwerben.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setActiveSubTab('shop'); setOrderCompleted(null); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              activeSubTab === 'shop' 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Storefront
          </button>
          <button
            onClick={() => { setActiveSubTab('orders'); setOrderCompleted(null); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 relative ${
              activeSubTab === 'orders' 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <ClipboardList className="h-4 w-4" /> Meine Bestellungen ({customerOrders.length})
            {customerOrders.some(o => o.status === 'Offen' || o.status === 'In Bearbeitung') && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowCartDrawer(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 text-white ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover}`}
          >
            <ShoppingCart className="h-4 w-4" /> Warenkorb ({cartCount})
          </button>
        </div>
      </div>

      {orderCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-800 space-y-4 animate-fade-in">
          <div className="flex gap-3 items-start">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Vielen Dank für Ihren Auftrag!</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ihre Bestellung wurde erfolgreich gebucht. Eine entsprechende Rechnung wurde in Ihrem Kundenkonto hinterlegt.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-mono bg-white p-3 rounded-lg border border-emerald-100 max-w-md">
                <div>
                  <span className="text-[10px] text-slate-400 block p-0.5">Bestellnummer</span>
                  <span className="font-semibold text-slate-800">{orderCompleted.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block p-0.5">Zahlungsverfahren</span>
                  <span className="font-semibold text-slate-800">{orderCompleted.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block p-0.5">Gesamtbetrag</span>
                  <span className="font-bold text-slate-900">{orderCompleted.totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block p-0.5">Versand an</span>
                  <span className="font-semibold text-slate-700 truncate block">{orderCompleted.shippingAddress}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('orders')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all"
            >
              Sendungsverfolgung öffnen
            </button>
            <button
              onClick={() => setOrderCompleted(null)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs rounded-lg transition-all"
            >
              Weiter einkaufen
            </button>
          </div>
        </div>
      )}

      {/* VIEW: SHOP STOREFRONT */}
      {activeSubTab === 'shop' && !orderCompleted && (
        <div className="space-y-6">
          {/* SEARCH BAR & CATEGORIES */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Sortiment durchsuchen..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 pl-9 pr-4 outline-none text-xs focus:border-indigo-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Alles
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    categoryFilter === cat 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center text-slate-400 border border-slate-100 rounded-xl font-mono">
                Aktuell sind keine passenden Artikel in dieser Kategorie online.
              </div>
            ) : (
              filteredProducts.map(prod => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col overflow-hidden group hover:shadow-md transition-all duration-200">
                  {/* Photo area */}
                  <div className="relative aspect-video w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                    {prod.image ? (
                      <img src={prod.image} referrerPolicy="no-referrer" alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-2xl select-none font-mono">
                        {prod.category}
                      </div>
                    )}
                    {prod.stock <= 2 && prod.stock > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold font-mono tracking-wide rounded-sm uppercase">Fast ausverkauft</span>
                    )}
                    {prod.stock === 0 && (
                      <span className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xs flex items-center justify-center text-white font-mono font-bold tracking-wider text-xs uppercase">Vergriffen</span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">{prod.category}</span>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">{prod.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">{prod.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/70 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-mono">Einzelpreis</span>
                        <span className="font-bold text-slate-900 text-base">
                          {prod.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>

                      <button
                        disabled={prod.stock === 0}
                        onClick={() => handleAddToCart(prod)}
                        className={`px-3.5 py-2 text-xs font-bold leading-none ${activeTemplate.roundedClass} transition-all cursor-pointer flex items-center gap-1 ${
                          prod.stock === 0 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : `${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover}`
                        }`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> In den Korb
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW: ORDER HISTORY TRACKING */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="bg-white p-12 text-center text-slate-400 border border-slate-100 rounded-xl font-mono">
              Sie haben bisher noch keine Einkäufe im Portal getätigt.
            </div>
          ) : (
            customerOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-1 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">BESTELLUNG AUFGEGEBEN</span>
                      <span className="font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">RECHNUNGSBETRAG</span>
                      <span className="font-bold text-slate-900">{order.totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">BESTELLNUMMER</span>
                      <span className="font-semibold text-slate-600 font-mono">{order.orderNumber}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide border ${
                      order.status === 'Geliefert' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : order.status === 'Versendet'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : order.status === 'Storniert'
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      Versand: {order.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide border ${
                      order.paymentStatus === 'Bezahlt'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      Zahlung: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Item List */}
                  <div className="md:col-span-2 space-y-3.5">
                    {order.items.map((item, id) => (
                      <div key={id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                            {item.quantity}x
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">{item.productName}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Stückpreis: {item.priceAtPurchase.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900">{item.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking status visual */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-3 text-xs">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold">Versanddienst & Verfolgung</span>
                    {order.carrier && order.trackingNumber ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-indigo-600" />
                          <span className="font-bold text-slate-700">{order.carrier} Paket</span>
                        </div>
                        <div className="font-mono text-slate-500 bg-white p-1.5 rounded text-center border border-slate-100 select-all">
                          {order.trackingNumber}
                        </div>
                        <div className="pt-1 flex gap-1 items-center text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer">
                          <span>Paket live verfolgen</span> ↗
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 font-mono text-[11px] leading-relaxed flex items-start gap-1.5">
                        <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>Ihr Paket wird derzeit im Lager für den Versand vorbereitet. Der Sendungscode wird in Kürze hinterlegt.</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block">LIEFERADRESSE</span>
                      <span className="text-[11px] font-semibold text-slate-600 block truncate mt-0.5">{order.shippingAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FLOATING CART AND CHECKOUT DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="bg-white max-w-md w-full h-full shadow-2xl flex flex-col text-slate-800">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <ShoppingCart className="h-4 w-4 text-indigo-600" />
                Ihr Warenkorb ({cartCount})
              </span>
              <button
                onClick={() => { setShowCartDrawer(false); setCheckoutStep(false); }}
                className="text-slate-400 hover:text-slate-600 font-mono text-sm"
              >
                ✕ Schließen
              </button>
            </div>

            {/* Cart body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!checkoutStep ? (
                /* STEP 1: ITEM LIST */
                cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 space-y-2">
                    <ShoppingBag className="h-10 w-10 text-slate-300" />
                    <span className="font-mono text-xs">Warenkorb ist leer.</span>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-start border-b border-slate-100 pb-3 gap-3">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">{item.product.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{item.product.sku}</span>
                        <span className="text-[11px] font-semibold text-slate-900 mt-1 block">
                          {(item.product.price * item.quantity).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleUpdateCartQty(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 bg-slate-100 rounded text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 font-mono font-bold text-center text-xs">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateCartQty(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 bg-slate-100 rounded text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* STEP 2: CHECKOUT FORM */
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Lieferanschrift & Versandadresse *</label>
                    <textarea
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Empfänger, Straße, Hausnummer, PLZ & Stadt"
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Zahlungsverfahren / Methode</label>
                    <div className="space-y-2 mt-1">
                      {['Überweisung', 'Lastschrift', 'PayPal', 'Kreditkarte'].map((method: any) => (
                        <label key={method} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-all text-xs font-semibold text-slate-600">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="text-indigo-600 focus:ring-0"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* DSGVO Consent */}
                  <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-lg space-y-2 text-xs">
                    <div className="flex gap-2 items-start">
                      <input
                        type="checkbox"
                        id="dsgvo-consent-box"
                        required
                        checked={dsgvoConsent}
                        onChange={(e) => setDsgvoConsent(e.target.checked)}
                        className="mt-0.5 rounded-sm text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="dsgvo-consent-box" className="text-[10px] leading-relaxed text-slate-600 select-none cursor-pointer font-medium">
                        * Hiermit willige ich der gewissenhaften Erfassung, Speicherung und datenschutzkonformen Abwicklung meiner Bestell- und Adressdaten (gemäß DSGVO Art. 6 Abs. 1 lit. b) zur Auftragsbearbeitung ein.
                      </label>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Cart Footer pricing summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Zwischensumme</span>
                    <span className="font-mono">{cartSubtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Versand ({shopDefaultCarrier})</span>
                    <span className="font-mono">
                      {isFreeShipping ? (
                        <span className="text-emerald-600 font-bold">KOSTENFREI</span>
                      ) : (
                        shippingFlat.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Darin enthaltene {shopTaxRate}% MwSt.</span>
                    <span>{(totalAmount - (totalAmount / (1 + shopTaxRate / 100))).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold text-sm pt-2 border-t border-slate-200/50">
                    <span>Gesamtsumme Brutto</span>
                    <span className="font-mono">{totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>

                {!checkoutStep ? (
                  <button
                    onClick={() => setCheckoutStep(true)}
                    className={`w-full py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 text-white ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
                  >
                    Weiter zur Kasse <CreditCard className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep(false)}
                      className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-all"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!dsgvoConsent || !shippingAddress.trim()}
                      className={`flex-1 py-2.5 font-bold text-xs text-white disabled:bg-slate-300 disabled:cursor-not-allowed ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
                    >
                      Zahlungspflichtig bestellen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
