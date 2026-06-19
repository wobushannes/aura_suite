import React, { useState, useMemo } from 'react';
import { Order, Invoice, CRMData, SystemSettings } from '../types';
import { 
  Receipt, Truck, Printer, Eye, Settings, Edit, CheckCircle2, AlertTriangle, XCircle, Search, Info, DollarSign, ArrowUpRight, Check, Ban, ExternalLink, Calendar
} from 'lucide-react';

interface BillingShippingProps {
  data: CRMData;
  onDataChange: (data: CRMData) => void;
  logAction: (action: string, details: string) => void;
  activeTemplate: any;
}

export default function BillingAndShipping({ data, onDataChange, logAction, activeTemplate }: BillingShippingProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'invoices' | 'settings'>('orders');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showLabelModal, setShowLabelModal] = useState<Order | null>(null);

  // Editable configurations
  const currentSettings: SystemSettings = data.settings || {
    activeTemplateId: 'slate-modern',
    cookieConsentRequired: true,
    gdprLoggingEnabled: true,
    shopEnabled: true,
    blogEnabled: true,
    companyName: 'Aura Enterprise Solutions',
    companyAddress: 'Hauptstr. 45, 80331 München, Germany',
    companyEmail: 'billing@aura-suite.de',
    companyPhone: '+49 89 20304050',
    iban: 'DE89 3704 0044 0532 9901 02',
    bic: 'SOLODEM1XXX',
    taxId: 'DE 258/119/93120'
  };

  const [settingsForm, setSettingsForm] = useState<SystemSettings>({ ...currentSettings });

  // Tracking adjustments states on detailed card
  const [carrierInput, setCarrierInput] = useState<'DHL' | 'UPS' | 'DPD' | 'Hermes'>('DHL');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [orderStatusInput, setOrderStatusInput] = useState<'Offen' | 'In Bearbeitung' | 'Versendet' | 'Geliefert' | 'Storniert'>('Offen');

  const orders = data.orders || [];
  const invoices = data.invoices || [];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) || 
      o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase())
    ).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, orderSearchTerm]);

  const handleUpdateShipping = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        logAction('Sendungsinformationen gepflegt', `Bestellung: ${o.orderNumber}, Versanddienst: ${carrierInput}, Tracking-ID: ${trackingNumberInput}, Status: ${orderStatusInput}`);
        return {
          ...o,
          carrier: carrierInput,
          trackingNumber: trackingNumberInput,
          status: orderStatusInput,
          paymentStatus: orderStatusInput === 'Geliefert' ? 'Bezahlt' as const : o.paymentStatus
        };
      }
      return o;
    });

    // Also update invoice paymentStatus if order is marked as delivered (Geliefert)
    let updatedInvoices = invoices;
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder && orderStatusInput === 'Geliefert' && targetOrder.invoiceId) {
      updatedInvoices = invoices.map(i => {
        if (i.id === targetOrder.invoiceId) {
          return { ...i, status: 'Bezahlt' as const };
        }
        return i;
      });
    }

    onDataChange({
      ...data,
      orders: updatedOrders,
      invoices: updatedInvoices
    });

    setSelectedOrder(null);
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: 'Offen' | 'Bezahlt' | 'Überfällig' | 'Storno') => {
    const updatedInvoices = invoices.map(i => {
      if (i.id === invoiceId) {
        logAction('Rechnungsstatus geändert', `Rechnung: ${i.invoiceNumber}, Neuer Status: ${newStatus}`);
        return { ...i, status: newStatus };
      }
      return i;
    });

    // Sync back to order payment status if linked
    const linkedOrder = orders.find(o => o.invoiceId === invoiceId);
    let updatedOrders = orders;
    if (linkedOrder && newStatus === 'Bezahlt') {
      updatedOrders = orders.map(o => o.invoiceId === invoiceId ? { ...o, paymentStatus: 'Bezahlt' as const } : o);
    }

    onDataChange({
      ...data,
      invoices: updatedInvoices,
      orders: updatedOrders
    });

    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onDataChange({
      ...data,
      settings: settingsForm
    });
    logAction('Rechnungseinstellungen aktualisiert', 'Stammdaten der Rechnungsstellung wurden geändert.');
    alert('Einstellungen erfolgreich gespeichert.');
    setActiveSubTab('orders');
  };

  const printDocument = () => {
    window.print();
  };

  const totalRevenue = useMemo(() => {
    return invoices.filter(i => i.status === 'Bezahlt').reduce((acc, i) => acc + i.amount, 0);
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Module Title and Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="h-5 w-5 text-indigo-600" />
            Finanzbuchshalt, Rechnungslegung & Versand
          </h1>
          <p className="text-xs text-slate-500 mt-1">Verwalten Lieferpapiere, drucken Sie Frachtbelege aus und überwachen Sie die Ausgangsrechnungen.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setActiveSubTab('orders'); setSelectedOrder(null); setSelectedInvoice(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeSubTab === 'orders' 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Bestellungen / Logistik
          </button>
          <button
            onClick={() => { setActiveSubTab('invoices'); setSelectedOrder(null); setSelectedInvoice(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeSubTab === 'invoices' 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Eingang & Rechnungen ({invoices.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('settings'); setSelectedOrder(null); setSelectedInvoice(null); }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1 ${
              activeSubTab === 'settings' 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Settings className="h-4 w-4" /> Bankdaten
          </button>
        </div>
      </div>

      {/* KPI stats */}
      {activeSubTab !== 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Umsatz realisiert (Bezahlt)</span>
              <span className="text-2xl font-bold text-slate-800 tracking-tight mt-1 block">
                {totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Rechnungen Offen</span>
              <span className="text-2xl font-bold text-amber-600 tracking-tight mt-1 block">
                {invoices.filter(i => i.status === 'Offen').length} Posten
              </span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Receipt className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Offene Paketsendungen</span>
              <span className="text-2xl font-bold text-sky-600 tracking-tight mt-1 block">
                {orders.filter(o => o.status === 'Offen' || o.status === 'In Bearbeitung').length} Stück
              </span>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: ORDERS SHIPPING LOGISTICS */}
      {activeSubTab === 'orders' && !selectedOrder && !selectedInvoice && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                placeholder="Bestellnr. oder Kunde suchen..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 pl-9 pr-4 outline-none text-xs focus:border-indigo-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 font-bold">
                  <th className="py-3 px-4">Bestellnummer</th>
                  <th className="py-3 px-4">Kunde</th>
                  <th className="py-3 px-4 text-center">Artikel</th>
                  <th className="py-3 px-4 text-right">Summe</th>
                  <th className="py-3 px-4 text-center">Logistik-Status</th>
                  <th className="py-3 px-4 text-right">Zoll / Dokumentation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                      Keine Bestellungen im System erfasst.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold block text-slate-800">{order.customerName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{order.shippingAddress}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)}x
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {order.totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wide border ${
                          order.status === 'Geliefert' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : order.status === 'Versendet'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : order.status === 'Storniert'
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setCarrierInput(order.carrier || 'DHL');
                              setTrackingNumberInput(order.trackingNumber || '');
                              setOrderStatusInput(order.status);
                            }}
                            className="p-1 px-2 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-100 font-semibold transition-all flex items-center gap-1"
                          >
                            <Settings className="h-3 w-3" /> Logistik pflegen
                          </button>
                          <button
                            onClick={() => setShowLabelModal(order)}
                            className="p-1 px-2 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded font-semibold transition-all flex items-center gap-1"
                          >
                            <Printer className="h-3 w-3" /> Versand-Label
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT LOGISTICS & CARRIER INFORMATION FOR A SELECTED ORDER */}
      {selectedOrder && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-800 text-sm">Versanddaten verwalten & Paket freigeben für: {selectedOrder.orderNumber}</span>
            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 text-xs font-mono">✕ Zurück</button>
          </div>

          <form onSubmit={(e) => handleUpdateShipping(e, selectedOrder.id)} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Verfügbare Versanddienstleister</label>
                <div className="grid grid-cols-4 gap-2">
                  {['DHL', 'UPS', 'DPD', 'Hermes'].map((carObj: any) => (
                    <button
                      key={carObj}
                      type="button"
                      onClick={() => setCarrierInput(carObj)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all uppercase tracking-wider ${
                        carrierInput === carObj 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {carObj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sendungs-Identifikationsnummer (Tracking ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. JJJ10.420.523 998"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Wird direkt mit dem Kunden-Dashboard synchronisiert zur Live-Verfolgung.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Logistischer Sendungsstatus</label>
                <select
                  value={orderStatusInput}
                  onChange={(e: any) => setOrderStatusInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Offen">Offen (Im Lager lagernd)</option>
                  <option value="In Bearbeitung">In Bearbeitung (Verpackung)</option>
                  <option value="Versendet">Versendet (An Versandpartner übergeben)</option>
                  <option value="Geliefert">Geliefert (Zugestellt und Abgeschlossen)</option>
                  <option value="Storniert">Storniert (Storniert & Gutgeschrieben)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/60 text-xs">
                <span className="font-bold text-slate-700 block">Zustelladresse des Kunden:</span>
                <span className="text-slate-500 mt-1 block font-mono leading-relaxed">{selectedOrder.shippingAddress}</span>
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
                >
                  Logistik freigeben
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: INVOICES MANAGEMENT LIST */}
      {activeSubTab === 'invoices' && !selectedInvoice && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 font-bold">
                  <th className="py-3 px-4">Rechnungsnummer</th>
                  <th className="py-3 px-4">Kunde</th>
                  <th className="py-3 px-4 font-mono">Erstellt am</th>
                  <th className="py-3 px-4 font-mono text-center">Fälligkeit</th>
                  <th className="py-3 px-4 text-right">Gesamt brutto</th>
                  <th className="py-3 px-4 text-center">Zahlungs-Status</th>
                  <th className="py-3 px-4 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                      Noch keine Ausgangsrechnungen generiert.
                    </td>
                  </tr>
                ) : (
                  [...invoices].reverse().map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 font-mono">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {inv.customerName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {inv.issueDate}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-center">
                        {inv.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {inv.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide border ${
                          inv.status === 'Bezahlt' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : inv.status === 'Offen'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : inv.status === 'Überfällig'
                            ? 'bg-red-50 text-red-700 border-red-100 animate-pulse'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1 px-2 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded font-semibold transition-all flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" /> Einsehen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER FULL CLASSIC COMPANY INVOICE PRINT VIEW */}
      {selectedInvoice && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md relative space-y-8 max-w-3xl mx-auto text-slate-800 animate-fade-in print:p-0 print:border-none print:shadow-none">
          {/* Header invoice controls */}
          <div className="flex justify-between items-center bg-slate-50 -m-8 mb-8 p-4 border-b border-slate-200/50 print:hidden rounded-t-2xl">
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'Bezahlt')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded"
              >
                Als Bezahlt markieren
              </button>
              <button
                onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'Offen')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase rounded"
              >
                Als Offen markieren
              </button>
              <button
                onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'Storno')}
                className="px-3 py-1 bg-slate-500 hover:bg-slate-600 text-white font-bold text-[10px] uppercase rounded"
              >
                Rechnung Stornieren
              </button>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={printDocument}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Beleg drucken
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded"
              >
                Schließen
              </button>
            </div>
          </div>

          {/* Senders Letterhead */}
          <div className="flex justify-between items-start">
            <div className="max-w-xs space-y-1">
              <span className="text-xl font-black text-indigo-700 uppercase tracking-tight">{currentSettings.companyName}</span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide leading-relaxed">
                {currentSettings.companyAddress}<br />
                E-Mail: {currentSettings.companyEmail}<br />
                Tel: {currentSettings.companyPhone}
              </p>
            </div>

            <div className="text-right space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight uppercase">Ausgangsbeleg</h2>
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 block">{selectedInvoice.invoiceNumber}</span>
              <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border ${
                selectedInvoice.status === 'Bezahlt' ? 'bg-emerald-5 text-emerald-700 border-emerald-2' : 'bg-rose-5 text-rose-700 border-rose-2'
              }`}>{selectedInvoice.status}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Customer Address Details & Invoice Dates */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[8px] text-slate-400 font-mono tracking-widest block uppercase font-bold">EMPFÄNGERANSCHRIFT</span>
              <div className="mt-1.5 font-bold text-slate-900 space-y-0.5">
                <p className="font-extrabold text-sm">{selectedInvoice.customerName}</p>
                <p className="font-normal text-slate-500 italic mt-0.5 font-mono">Mandant des Portals</p>
              </div>
            </div>

            <div className="text-right space-y-1 text-[11px] font-mono select-none">
              <div>
                <span className="text-slate-400 font-sans text-[8px] tracking-wider uppercase font-bold">Rechnungsdatum:</span>
                <span className="font-bold text-slate-700 ml-1.5">{selectedInvoice.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans text-[8px] tracking-wider uppercase font-bold">Zahlbar bis:</span>
                <span className="font-bold text-rose-700 ml-1.5">{selectedInvoice.dueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans text-[8px] tracking-wider uppercase font-bold">Leistungszeitraum:</span>
                <span className="font-bold text-slate-700 ml-1.5">{selectedInvoice.issueDate.substring(0, 7)}</span>
              </div>
            </div>
          </div>

          {/* List Items of Invoice */}
          <table className="w-full text-left border-collapse text-xs mt-6">
            <thead>
              <tr className="border-b-2 border-slate-250 bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Beschreibung</th>
                <th className="py-2.5 px-3 text-center">Menge</th>
                <th className="py-2.5 px-3 text-right">Einzelpreis</th>
                <th className="py-2.5 px-3 text-right">Gesamt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {selectedInvoice.items?.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{item.description}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">{item.unitPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{item.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice calculations and totals */}
          <div className="flex justify-end pt-4 select-none">
            <div className="w-64 space-y-1.5 text-xs border-t-2 border-slate-300 pt-3 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Nettosumme:</span>
                <span>{selectedInvoice.netAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px] pb-1.5 border-b border-slate-100">
                <span>zzgl. 19% MwSt.:</span>
                <span>{selectedInvoice.taxAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-1">
                <span>GESAMTBETRAG:</span>
                <span>{selectedInvoice.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
          </div>

          {/* Invoice footer bank credentials */}
          <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 text-[9px] font-mono text-slate-400 select-none">
            <div>
              <span className="font-bold text-slate-500 uppercase block mb-1">Zahlungsverbindung</span>
              <p>Inhaber: {currentSettings.companyName}</p>
              <p>IBAN: {currentSettings.iban}</p>
              <p>BIC: {currentSettings.bic}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase block mb-1">Steuerdaten</span>
              <p>USt-IdNr.: {currentSettings.taxId}</p>
              <p>Finanzamt München</p>
              <p>Zahlungsziel: 14 Tage netto</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-500 uppercase block mb-1">Hinweise</span>
              <p>Bitte geben Sie bei Überweisungen stets die Rechnungsnummer an.</p>
              <p className="mt-1 font-bold text-indigo-600">Vielen Dank für Ihre partnerschaftliche Kooperation!</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: BILLING / ERP CONFIGURATION FORM */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm">ERP Bankdaten- & Stammdatenkonfiguration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Firmenname / Rechnungssteller *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Anschrift / Unternehmenssitz *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.companyAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, companyAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Kontakt E-Mail *</label>
                  <input
                    type="email"
                    required
                    value={settingsForm.companyEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Kontakt Telefon *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.companyPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">IBAN *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.iban}
                  onChange={(e) => setSettingsForm({ ...settingsForm, iban: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">BIC / Swift Code *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.bic}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bic: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">USt-IdNr. / Steuer ID *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.taxId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className={`px-5 py-2.5 font-bold text-xs text-white ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
                >
                  Daten dauerhaft speichern
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* MODAL: STYLIZED SHIPPING DHL / UPS PARCEL ROUTING LABEL */}
      {showLabelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in print:p-0 print:border-none print:shadow-none print:bg-white">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-slate-900 print:shadow-none print:border-none">
            <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 print:hidden">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Printer className="h-4 w-4" /> Versandpaket Aufkleber drucken
              </span>
              <button onClick={() => setShowLabelModal(null)} className="text-slate-400 hover:text-slate-600 text-xs font-mono">✕ Schließen</button>
            </div>

            {/* Stylized routing label card */}
            <div className="p-6 space-y-4 text-xs font-sans select-none" id="dhl-label-card">
              {/* Logo block and class */}
              <div className="flex justify-between items-center border-b-2 border-dashed border-slate-300 pb-3">
                <div className="font-black text-lg text-amber-500 tracking-tighter uppercase font-mono">
                  {showLabelModal.carrier || 'DHL'} <span className="text-[12px] font-bold text-black font-sans lowercase">paket</span>
                </div>
                <div className="text-right text-[9px] text-slate-400 font-mono tracking-wide leading-tight">
                  Premium-Versand<br />
                  EmpfängerInland
                </div>
              </div>

              {/* Sender and recipient */}
              <div className="grid grid-cols-1 gap-4 font-semibold text-[11px] leading-relaxed">
                <div className="border-b border-dashed border-slate-200 pb-3">
                  <span className="text-[8px] text-slate-400 font-mono block mb-0.5">ABSENDER</span>
                  <p className="font-extrabold text-xs">{currentSettings.companyName}</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{currentSettings.companyAddress}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 font-mono block mb-1">EMPFÄNGER (RECIPIENT)</span>
                  <p className="font-black text-sm text-slate-950">{showLabelModal.customerName}</p>
                  <p className="text-[11px] text-slate-600 leading-normal font-mono font-semibold mt-1">{showLabelModal.shippingAddress}</p>
                </div>
              </div>

              {/* Barcode and codes */}
              <div className="space-y-2 pt-2 border-t-2 border-dashed border-slate-300 flex flex-col items-center">
                <span className="text-[7px] text-slate-400 font-mono block uppercase">PAKETSCHEINBARCODE (TRACKING)</span>
                <div className="tracking-widest font-mono text-3xl font-light text-slate-950 leading-none py-1 select-none">
                  ||| | ||| || | |||| |||
                </div>
                <div className="font-mono text-[10px] text-slate-600 tracking-widest leading-none">
                  {showLabelModal.trackingNumber || 'CH94-118-204-DE'}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-[9px] text-slate-400 font-mono select-none">
                <span>Versandgewicht: 2,5 kg</span>
                <span>Porto bezahlt</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 print:hidden justify-end">
              <button
                onClick={printDocument}
                className="px-4 py-2 bg-slate-950 hover:bg-black text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Etikett drucken
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
