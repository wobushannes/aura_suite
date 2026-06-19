import React from 'react';
import { 
  Globe,
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Calendar, 
  User, 
  LogOut, 
  Lock,
  FileText,
  Cpu,
  Receipt,
  BookOpen,
  Layers,
  ShieldCheck,
  Video,
  Package,
  Truck,
  Palette,
  ShoppingBag,
  Sliders,
  Search
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'customer';
  displayName: string;
  companyName?: string;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  unreadCount?: number;
  appointmentsEnabled?: boolean;
  invoicesEnabled?: boolean;
  shopEnabled?: boolean;
  blogEnabled?: boolean;
  videosEnabled?: boolean;
  botEnabled?: boolean;
  chatEnabled?: boolean;
  siteHeaderName?: string;
  data?: any;
  onGlobalSearchSelect?: (tab: string, searchData: { customerSearch?: string; fileSearch?: string; chatCustomerId?: string }) => void;
}

export default function Sidebar({
  role,
  displayName,
  companyName,
  currentTab,
  onTabChange,
  onLogout,
  unreadCount = 0,
  appointmentsEnabled = true,
  invoicesEnabled = true,
  shopEnabled = true,
  blogEnabled = true,
  videosEnabled = true,
  botEnabled = true,
  chatEnabled = true,
  siteHeaderName,
  data,
  onGlobalSearchSelect
}: SidebarProps) {
  const isAdmin = role === 'admin';
  const [globalSearch, setGlobalSearch] = React.useState('');

  const searchResults = React.useMemo(() => {
    if (!isAdmin || !data || globalSearch.trim().length < 2) return null;
    const q = globalSearch.toLowerCase().trim();

    // 1. Search customers
    const matchedCustomers = (data.customers || []).filter((c: any) => 
      c.name.toLowerCase().includes(q) || 
      c.company.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    ).slice(0, 5);

    // 2. Search files
    const matchedFiles = (data.files || []).filter((f: any) => 
      f.name.toLowerCase().includes(q) ||
      (f.customerName && f.customerName.toLowerCase().includes(q))
    ).slice(0, 5);

    // 3. Search messages
    const matchedMessages = (data.messages || []).filter((m: any) => 
      m.content && m.content.toLowerCase().includes(q)
    ).slice(0, 5);

    const hasResults = matchedCustomers.length > 0 || matchedFiles.length > 0 || matchedMessages.length > 0;

    return {
      customers: matchedCustomers,
      files: matchedFiles,
      messages: matchedMessages,
      hasResults
    };
  }, [globalSearch, data, isAdmin]);

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Kundenverwaltung', icon: Users },
    { id: 'plugins', label: 'Plugins', icon: Cpu }, // Dedicated plugin management page
    { id: 'files', label: 'Dokumente', icon: FolderOpen },
    ...(chatEnabled ? [
      { id: 'messages', label: 'DMs', icon: MessageSquare, badge: unreadCount }
    ] : []),
    ...(appointmentsEnabled ? [
      { id: 'appointments', label: 'Termine', icon: Calendar }
    ] : []),
    ...(invoicesEnabled ? [
      { id: 'invoices', label: 'Rechnungen', icon: Receipt }
    ] : []),
    ...(shopEnabled ? [
      { id: 'wawi', label: 'Warenwirtschaft', icon: Package },
      { id: 'billingshipping', label: 'Bestellungen', icon: Truck }
    ] : []),
    ...(blogEnabled ? [
      { id: 'blog', label: 'Blog', icon: BookOpen }
    ] : []),
    { id: 'style-templates', label: 'Design-System', icon: Palette },
    { id: 'settings', label: 'Einstellungen', icon: Sliders },
    { id: 'templates', label: 'Roadmap-Templates', icon: Layers },
    { id: 'communication-templates', label: 'Antwort-Vorlagen', icon: FileText },
    ...(botEnabled ? [
      { id: 'bottraining', label: 'KI-Chatbot', icon: Cpu }
    ] : []),
    { id: 'documentation', label: 'Handbuch', icon: BookOpen },
  ];

  const customerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contracts', label: 'Verträge', icon: ShieldCheck },
    { id: 'files', label: 'Dokumente', icon: FolderOpen },
    ...(chatEnabled ? [
      { id: 'messages', label: 'DMs', icon: MessageSquare, badge: unreadCount }
    ] : []),
    ...(appointmentsEnabled ? [
      { id: 'appointments', label: 'Termine', icon: Calendar }
    ] : []),
    ...(shopEnabled ? [
      { id: 'webshop', label: 'Webshop', icon: ShoppingBag }
    ] : []),
    ...(blogEnabled ? [
      { id: 'blog', label: 'Blog', icon: BookOpen }
    ] : []),
    ...(invoicesEnabled ? [
      { id: 'invoices', label: 'Rechnungen', icon: Receipt }
    ] : []),
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'documentation', label: 'Hilfe', icon: BookOpen },
  ];

  const items = isAdmin ? adminNavItems : customerNavItems;

  // Visual Styling customized by User Role (High Density Admin, High Density Customer)
  const roleStyles = isAdmin 
    ? {
        bg: 'bg-slate-900 border-r border-slate-800',
        activeItem: 'bg-indigo-600 text-white shadow-sm rounded-md',
        hoverItem: 'hover:bg-slate-800 text-slate-400 hover:text-white rounded-md',
        border: 'border-slate-800',
        logoText: 'text-indigo-400',
        logoBg: 'bg-indigo-500',
        roleBadge: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
      }
    : {
        bg: 'bg-slate-900 border-r border-slate-800', // Keeping coherent workspace colors for customers too per spec or emerald theme
        activeItem: 'bg-emerald-600 text-white shadow-sm rounded-md',
        hoverItem: 'hover:bg-slate-800 text-slate-400 hover:text-white rounded-md',
        border: 'border-slate-800',
        logoText: 'text-emerald-400',
        logoBg: 'bg-emerald-600',
        roleBadge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
      };

  return (
    <aside className={`w-64 ${roleStyles.bg} text-white flex flex-col h-screen select-none`}>
      {/* Brand & Corporate Header */}
      <div className={`p-5 border-b ${roleStyles.border} flex items-center gap-3`}>
        <div className={`w-8 h-8 ${roleStyles.logoBg} rounded-md flex items-center justify-center font-bold text-white flex-shrink-0`}>
          A
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-tight text-slate-100 leading-none truncate uppercase">{siteHeaderName || 'Aura Suite'}</h2>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5 block">LOCAL DATA SUITE v1.0</span>
        </div>
      </div>

      {/* GLOBAL SEARCH IN SIDEBAR (Admins only) */}
      {isAdmin && (
        <div className="px-3.5 pt-3.5 relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Globale Suche..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg pl-8 pr-7 py-2 text-xs outline-none text-slate-200 placeholder-slate-400 focus:border-indigo-505 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          {searchResults && (
            <div className="absolute left-3.5 right-3.5 mt-1 bg-slate-950 border border-slate-800 text-white rounded-lg shadow-xl z-50 p-2 text-xs max-h-[380px] overflow-y-auto divide-y divide-slate-800">
              {searchResults.hasResults ? (
                <>
                  {/* Customers Category */}
                  {searchResults.customers.length > 0 && (
                    <div className="py-2 first:pt-1">
                      <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 mb-1 px-1 flex items-center gap-1">
                        <Users className="h-3 w-3 text-indigo-400" />
                        Kunden
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.customers.map((c: any) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              if (onGlobalSearchSelect) {
                                onGlobalSearchSelect('customers', { customerSearch: c.name });
                              }
                              setGlobalSearch('');
                            }}
                            className="w-full text-left p-1.5 hover:bg-slate-800 rounded text-[11px] truncate block cursor-pointer transition-colors"
                          >
                            <span className="font-semibold text-slate-200">{c.name}</span>
                            <span className="block text-[9px] text-slate-400">{c.company}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Category */}
                  {searchResults.files.length > 0 && (
                    <div className="py-2">
                      <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 mb-1 px-1 flex items-center gap-1">
                        <FolderOpen className="h-3 w-3 text-indigo-400" />
                        Dokumente
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.files.map((f: any) => (
                          <button
                            key={f.id}
                            onClick={() => {
                              if (onGlobalSearchSelect) {
                                onGlobalSearchSelect('files', { fileSearch: f.name });
                              }
                              setGlobalSearch('');
                            }}
                            className="w-full text-left p-1.5 hover:bg-slate-800 rounded text-[11px] truncate block cursor-pointer transition-colors"
                          >
                            <span className="font-semibold text-slate-200">{f.name}</span>
                            <span className="block text-[9px] text-slate-400">{f.customerName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages Category */}
                  {searchResults.messages.length > 0 && (
                    <div className="py-2 last:pb-1">
                      <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 mb-1 px-1 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-indigo-400" />
                        Nachrichten (DMs)
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.messages.map((m: any) => {
                          const customerId = m.senderId === 'admin' ? m.receiverId : m.senderId;
                          const cust = data.customers?.find((c: any) => c.id === customerId);
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                if (onGlobalSearchSelect) {
                                  onGlobalSearchSelect('messages', { chatCustomerId: customerId });
                                }
                                setGlobalSearch('');
                              }}
                              className="w-full text-left p-1.5 hover:bg-slate-800 rounded text-[11px] truncate block cursor-pointer transition-colors"
                            >
                              <span className="font-semibold text-slate-200 block truncate">"{m.content}"</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5">
                                Chat mit {cust ? cust.name : 'Unbekannt'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 text-center text-slate-400 text-xs">
                  Keine Ergebnisse gefunden.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Information Display Card - High Density Compact */}
      <div className={`p-3.5 mx-3.5 my-3 bg-slate-800/40 rounded-lg border ${roleStyles.border}`}>
        <p className="text-[9px] text-slate-500 uppercase font-mono font-bold tracking-wider leading-none">Angemeldet als</p>
        <p className="text-xs font-semibold text-slate-200 mt-1 leading-tight truncate">{displayName}</p>
        {companyName && (
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{companyName}</p>
        )}
        <div className="mt-2 flex items-center">
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wide uppercase ${roleStyles.roleBadge}`}>
            {isAdmin ? 'Portal-Admin' : 'Mandant (Kunde)'}
          </span>
        </div>
      </div>

      {/* Navigation Options List */}
      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 transition-all duration-200 group text-sm font-medium ${
                isActive ? roleStyles.activeItem : roleStyles.hoverItem
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'scale-105' : 'opacity-70 group-hover:opacity-100 transition-opacity'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-rose-500 text-white font-bold font-mono text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Logout Footer Section */}
      <div className={`p-3 border-t ${roleStyles.border} bg-black/10`}>
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-rose-200 hover:bg-rose-500/10 rounded-md transition-all duration-200 text-left font-medium"
        >
          <LogOut className="h-4 w-4 opacity-70 group-hover:opacity-100" />
          <span>Abmelden</span>
        </button>
      </div>
    </aside>
  );
}
