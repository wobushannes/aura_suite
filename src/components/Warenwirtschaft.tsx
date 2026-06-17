import React, { useState } from 'react';
import { Product, Supplier, CRMData } from '../types';
import { Plus, Search, Edit2, Trash2, ArrowUpRight, Scale, ShieldAlert, CheckCircle, Package, AlertTriangle, Truck, Layers, DollarSign } from 'lucide-react';

interface WaWiProps {
  data: CRMData;
  onDataChange: (data: CRMData) => void;
  logAction: (action: string, details: string) => void;
  activeTemplate: any;
}

export default function Warenwirtschaft({ data, onDataChange, logAction, activeTemplate }: WaWiProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out

  // Modal forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // New item form states
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    supplierId: '',
    status: 'In Stock' as 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Draft'
  });

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const products = data.products || [];
  const suppliers = data.suppliers || [];

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = p.stock > 0 && p.stock <= 5;
    } else if (stockFilter === 'out') {
      matchesStock = p.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Stock alert counts
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleStockAdjust = (productId: string, amount: number) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + amount);
        let status = p.status;
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock <= 5) status = 'Low Stock';
        else status = 'In Stock';

        logAction('Lagerbestand angepasst', `Produkt: ${p.name}, SKU: ${p.sku}, Änderung: ${amount > 0 ? '+' : ''}${amount}, Neuer Bestand: ${newStock}`);
        return { ...p, stock: newStock, status };
      }
      return p;
    });

    onDataChange({
      ...data,
      products: updatedProducts
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku || productForm.price <= 0) {
      alert('Bitte füllen Sie Name, SKU und Preis korrekt aus.');
      return;
    }

    let updatedProducts: Product[];

    if (editingProduct) {
      // Edit mode
      updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          const stockNum = Number(productForm.stock);
          let status = productForm.status;
          if (stockNum === 0) status = 'Out of Stock';
          else if (stockNum <= 5) status = 'Low Stock';
          else status = 'In Stock';

          logAction('Produkt aktualisiert', `Produkt: ${productForm.name}, SKU: ${productForm.sku}`);
          return {
            ...p,
            name: productForm.name,
            sku: productForm.sku,
            description: productForm.description,
            price: Number(productForm.price),
            stock: stockNum,
            category: productForm.category,
            image: productForm.image || undefined,
            supplierId: productForm.supplierId || undefined,
            status: status as any
          };
        }
        return p;
      });
    } else {
      // Create mode
      const stockNum = Number(productForm.stock);
      let status = productForm.status;
      if (stockNum === 0) status = 'Out of Stock';
      else if (stockNum <= 5) status = 'Low Stock';
      else status = 'In Stock';

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        sku: productForm.sku,
        description: productForm.description,
        price: Number(productForm.price),
        stock: stockNum,
        category: productForm.category || 'Allgemein',
        image: productForm.image || undefined,
        supplierId: productForm.supplierId || undefined,
        status: status as any
      };

      updatedProducts = [...products, newProduct];
      logAction('Produkt angelegt', `Neues Produkt: ${newProduct.name}, SKU: ${newProduct.sku}`);
    }

    onDataChange({
      ...data,
      products: updatedProducts
    });

    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '', sku: '', description: '', price: 0, stock: 0, category: '', image: '', supplierId: '', status: 'In Stock'
    });
  };

  const handleProductDelete = (id: string, name: string) => {
    if (confirm(`Sind Sie sicher, dass Sie das Produkt '${name}' löschen möchten?`)) {
      const updated = products.filter(p => p.id !== id);
      onDataChange({ ...data, products: updated });
      logAction('Produkt gelöscht', `Produkt ID: ${id}, Name: ${name}`);
    }
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.contactPerson) {
      alert('Bitte füllen Sie mindestens Firmenname und Ansprechpartner aus.');
      return;
    }

    let updatedSuppliers: Supplier[];

    if (editingSupplier) {
      updatedSuppliers = suppliers.map(s => {
        if (s.id === editingSupplier.id) {
          logAction('Lieferant aktualisiert', `Lieferant: ${supplierForm.name}`);
          return { ...s, ...supplierForm };
        }
        return s;
      });
    } else {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...supplierForm
      };
      updatedSuppliers = [...suppliers, newSupplier];
      logAction('Lieferant angelegt', `Neuer Lieferant: ${newSupplier.name}`);
    }

    onDataChange({
      ...data,
      suppliers: updatedSuppliers
    });

    setShowSupplierModal(false);
    setEditingSupplier(null);
    setSupplierForm({ name: '', contactPerson: '', email: '', phone: '', address: '' });
  };

  const handleSupplierDelete = (id: string, name: string) => {
    if (confirm(`Sind Sie sicher, dass Sie den Lieferanten '${name}' entfernen möchten?`)) {
      const updated = suppliers.filter(s => s.id !== id);
      onDataChange({ ...data, suppliers: updated });
      logAction('Lieferant gelöscht', `Lieferant ID: ${id}, Name: ${name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and KPI cards */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            Warenwirtschaftssystem & Lagerverwaltung (WaWi)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Überwachen Sie Lagerbestände, verwalten Sie Lieferanten und steuern Sie die Produktverfügbarkeit.</p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'inventory' ? (
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '', sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`, description: '', price: 0, stock: 0, category: 'Hardware', image: '', supplierId: '', status: 'In Stock'
                });
                setShowProductModal(true);
              }}
              className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
            >
              <Plus className="h-4 w-4" /> Produkt hinzufügen
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingSupplier(null);
                setSupplierForm({ name: '', contactPerson: '', email: '', phone: '', address: '' });
                setShowSupplierModal(true);
              }}
              className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
            >
              <Plus className="h-4 w-4" /> Lieferanten anlegen
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Gesamt-Sortiment</span>
            <span className="text-2xl font-bold text-slate-800 tracking-tight mt-1 block">{products.length} Artikel</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Lagerwert brutto</span>
            <span className="text-2xl font-bold text-slate-800 tracking-tight mt-1 block">
              {products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Lagerengpässe</span>
            <span className={`${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-600'} text-2xl font-bold tracking-tight mt-1 block`}>
              {lowStockCount} Artikel
            </span>
          </div>
          <div className={`p-3 ${lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'} rounded-lg`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Ausverkauft</span>
            <span className={`${outOfStockCount > 0 ? 'text-rose-600' : 'text-slate-600'} text-2xl font-bold tracking-tight mt-1 block`}>
              {outOfStockCount} Artikel
            </span>
          </div>
          <div className={`p-3 ${outOfStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'} rounded-lg`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'inventory' 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" /> Artikelbestand & SKUs
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'suppliers' 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="h-4 w-4" /> Lieferanten & Einkaufsquellen
        </button>
      </div>

      {/* TAB CONTENT: INVENTORY SYSTEM */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* SEARCH AND FILTERS */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Suche nach Name, SKU oder Beschreibung..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 pl-9 pr-4 outline-none text-xs focus:border-indigo-500 focus:bg-white transition-all font-mono"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg text-xs outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="all">Alle Kategorien</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg text-xs outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="all">Alle Lagerstände</option>
                <option value="low">Engpässe ( 1 - 5Stk. )</option>
                <option value="out">Ausverkauft ( 0 Stk. )</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS LIST TABLE */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 font-bold">
                    <th className="py-3 px-4">SKU / Produkt</th>
                    <th className="py-3 px-4">Kategorie</th>
                    <th className="py-3 px-4 text-right">Einzelpreis</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Lagerbestand</th>
                    <th className="py-3 px-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                        Keine passenden Produkte im Lager gefunden.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => {
                      const supplier = suppliers.find(s => s.id === product.supplierId);
                      return (
                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {product.image ? (
                                <img src={product.image} referrerPolicy="no-referrer" alt={product.name} className="w-8 h-8 rounded object-cover border border-slate-100 bg-slate-50 flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {product.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-semibold text-slate-800 block truncate">{product.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">{product.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">
                            {product.category}
                          </td>
                          <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                            {product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {product.stock === 0 ? (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full font-bold text-[9px] uppercase border border-rose-100">Ausverkauft</span>
                            ) : product.stock <= 5 ? (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold text-[9px] uppercase border border-amber-100">Kritischer Stand</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[9px] uppercase border border-emerald-100">Verfügbar</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleStockAdjust(product.id, -1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors text-sm"
                              >
                                -
                              </button>
                              <span className="w-10 font-bold text-slate-800 text-center font-mono text-sm">
                                {product.stock}
                              </span>
                              <button
                                onClick={() => handleStockAdjust(product.id, 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors text-sm"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    name: product.name,
                                    sku: product.sku,
                                    description: product.description || '',
                                    price: product.price,
                                    stock: product.stock,
                                    category: product.category,
                                    image: product.image || '',
                                    supplierId: product.supplierId || '',
                                    status: product.status
                                  });
                                  setShowProductModal(true);
                                }}
                                className="p-1 px-2 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-100 font-semibold transition-all flex items-center gap-1"
                              >
                                <Edit2 className="h-3 w-3" /> Bearbeiten
                              </button>
                              <button
                                onClick={() => handleProductDelete(product.id, product.name)}
                                className="p-1 px-2 text-[11px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 font-semibold transition-all flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUPPLIERS LIST */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 font-bold">
                    <th className="py-3 px-4">Firmenname</th>
                    <th className="py-3 px-4">Ansprechpartner</th>
                    <th className="py-3 px-4">E-Mail</th>
                    <th className="py-3 px-4">Telefon</th>
                    <th className="py-3 px-4">Standort</th>
                    <th className="py-3 px-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                        Noch keine Lieferanten angelegt.
                      </td>
                    </tr>
                  ) : (
                    suppliers.map(sup => (
                      <tr key={sup.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {sup.name}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-600">
                          {sup.contactPerson}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {sup.email}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {sup.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px] max-w-[150px] truncate">
                          {sup.address}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingSupplier(sup);
                                setSupplierForm({
                                  name: sup.name,
                                  contactPerson: sup.contactPerson,
                                  email: sup.email,
                                  phone: sup.phone,
                                  address: sup.address
                                });
                                setShowSupplierModal(true);
                              }}
                              className="p-1 px-2 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-100 font-semibold transition-all flex items-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" /> Bearbeiten
                            </button>
                            <button
                              onClick={() => handleSupplierDelete(sup.id, sup.name)}
                              className="p-1 px-2 text-[11px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 font-semibold transition-all flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
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
        </div>
      )}

      {/* PRODUCT SUBMIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white text-slate-800 max-w-xl w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-sm font-bold text-slate-800 tracking-tight">
                {editingProduct ? 'Produktartikel bearbeiten' : 'Neues Produkt im Lager anlegen'}
              </span>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
                onClick={() => setShowProductModal(false)}
              >
                ✕ Schließen
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Artikelname *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="z.B. Enterprise Router XR"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">SKU / Herstellernummer *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="z.B. HW-ROUT-72"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Produktbeschreibung</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Geben Sie hier wichtige Artikel-Spezifikationen ein..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Einzelpreis (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="250.00"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Lagerbestand (Initial) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Gruppe / Kategorie</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="z.B. Hardware"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Artikelbild-URL (Optional)</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Lieferant</label>
                  <select
                    value={productForm.supplierId}
                    onChange={(e) => setProductForm({ ...productForm, supplierId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="">Kein Lieferant zugeordnet</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-600 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 font-bold text-xs ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
                >
                  {editingProduct ? 'Änderungen speichern' : 'In das Sortiment aufnehmen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPLIER MODAL */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white text-slate-800 max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-sm font-bold text-slate-800 tracking-tight">
                {editingSupplier ? 'Lieferantendaten bearbeiten' : 'Neuen Lieferanten registrieren'}
              </span>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
                onClick={() => setShowSupplierModal(false)}
              >
                ✕ Schließen
              </button>
            </div>

            <form onSubmit={handleSupplierSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Company / Firmenname *</label>
                <input
                  type="text"
                  required
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="z.B. Global Tech Distribution GmbH"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Ansprechpartner / Repräsentant *</label>
                <input
                  type="text"
                  required
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                  placeholder="z.B. Michael Schmidt"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">E-Mail Adresse</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    placeholder="sales@globaltech.de"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Telefon / Direktwahl</label>
                  <input
                    type="text"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    placeholder="+49 40 123455"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Anschrift / Lageradresse</label>
                <input
                  type="text"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  placeholder="Industriegebiet Ost 14, 20457 Hamburg"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-600 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 font-bold text-xs ${activeTemplate.primaryButton} ${activeTemplate.primaryButtonHover} ${activeTemplate.roundedClass} transition-all`}
                >
                  {editingSupplier ? 'Speichern' : 'Lieferant anlegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
