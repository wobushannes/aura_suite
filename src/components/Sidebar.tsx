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
  Sliders
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
  siteHeaderName
}: SidebarProps) {
  const isAdmin = role === 'admin';

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
          K
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-tight text-slate-100 leading-none truncate uppercase">{siteHeaderName || 'Kraftwerk Suite'}</h2>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5 block">LOCAL DATA SUITE v1.0</span>
        </div>
      </div>

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
