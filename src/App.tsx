import React, { useState, useEffect, useMemo } from 'react';
import { CRMData, Customer } from './types';
import { loadCRMData, saveCRMData, hashPassword, fetchServerCRMData, saveServerCRMData } from './storage';
import Sidebar from './components/Sidebar';
import AdminCRM from './components/AdminCRM';
import CustomerPortal from './components/CustomerPortal';
import PublicFrontend from './components/PublicFrontend';
import { Lock, User, FileText, LayoutDashboard, Key, ShieldAlert, Home } from 'lucide-react';

export default function App() {
  // --- APPLICATION STATE ---
  const [data, setData] = useState<CRMData>(loadCRMData());
  const [session, setSession] = useState<{
    role: 'admin' | 'customer';
    userId: string; // 'admin' or customerId
    displayName: string;
    companyName?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [simulatedCustomerId, setSimulatedCustomerId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  
  // --- CONNECTION MODE (ONLINE/OFFLINE SYNC) ---
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const cached = localStorage.getItem('crm_online_mode');
    return cached !== 'offline';
  });

  const handleSetOnline = (onlineValue: boolean) => {
    setIsOnline(onlineValue);
    localStorage.setItem('crm_online_mode', onlineValue ? 'online' : 'offline');
  };

  // --- LOGIN PANEL STATE ---
  const [loginRole, setLoginRole] = useState<'admin' | 'customer'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Synchronize state changes directly with localStorage and the server if online
  useEffect(() => {
    saveCRMData(data);
    if (isOnline) {
      saveServerCRMData(data).catch(err => {
        console.error('Failed to sync changes to server', err);
      });
    }
  }, [data, isOnline]);

  // Handle Dynamic SEO Meta Title and Description
  useEffect(() => {
    if (data.settings?.siteTitle) {
      document.title = data.settings.siteTitle;
    } else {
      document.title = 'Kraftwerk Suite';
    }
    
    // Update meta description safely
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.settings?.siteSeoDescription || 'Kraftwerk Suite Enterprise Portal');
  }, [data.settings?.siteTitle, data.settings?.siteSeoDescription]);

  // Load backend data on startup and poll periodically to stay in sync with server state
  useEffect(() => {
    let isMounted = true;

    async function syncWithServer() {
      if (!isOnline) return;
      try {
        const serverData = await fetchServerCRMData();
        if (isMounted) {
          setData(prev => {
            // Structurally compare serialized data to prevent unneeded re-renders
            if (JSON.stringify(prev) === JSON.stringify(serverData)) {
              return prev;
            }
            return serverData;
          });
        }
      } catch (err) {
        console.error('Error fetching newest database state from server', err);
      }
    }

    syncWithServer();

    const intervalId = setInterval(() => {
      syncWithServer();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isOnline]);

  // Try to recover session from sessionStorage for browser refreshes
  useEffect(() => {
    const cachedSession = sessionStorage.getItem('crm_active_session');
    if (cachedSession) {
      try {
        const parsed = JSON.parse(cachedSession);
        // Verify user still exists in current db context if they are a customer
        if (parsed.role === 'customer') {
          const userExists = data.customers.some(c => c.id === parsed.userId);
          if (userExists) {
            setSession(parsed);
          } else {
            sessionStorage.removeItem('crm_active_session');
          }
        } else {
          setSession(parsed);
        }
      } catch (e) {
        console.error('Error recovering session cache', e);
      }
    }
  }, [data.customers]);

  // --- CALCULATE UNREAD MESSAGE BADGES ---
  const unreadMessagesCount = useMemo(() => {
    if (!session) return 0;
    if (session.role === 'admin') {
      // Messages to admin that are still unread
      return data.messages.filter(m => m.receiverId === 'admin' && !m.isRead).length;
    } else {
      // Messages from admin to this specific customer that are still unread
      return data.messages.filter(
        m => m.senderId === 'admin' && m.receiverId === session.userId && !m.isRead
      ).length;
    }
  }, [data.messages, session]);

  // --- AUTHENTICATION ACTIONS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Bitte füllen Sie alle Anmeldefelder aus.');
      return;
    }

    setLoginError(null);
    setIsVerifying(true);

    try {
      if (loginRole === 'admin') {
        const adminHash = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // SHA256 of 'admin123'
        const computedHash = await hashPassword(password);
        
        if (username.toLowerCase() === 'admin' && computedHash === adminHash) {
          const newSession = {
            role: 'admin' as const,
            userId: 'admin',
            displayName: 'System-Administrator'
          };
          setSession(newSession);
          sessionStorage.setItem('crm_active_session', JSON.stringify(newSession));
          setActiveTab('dashboard');
        } else {
          setLoginError('Ungültige Administrator-Zugangsdaten.');
        }
      } else {
        // Customer login lookup
        const customer = data.customers.find(
          c => c.username.toLowerCase() === username.toLowerCase()
        );
        if (customer) {
          const computedHash = await hashPassword(password);
          if (computedHash === customer.passwordHash) {
            const newSession = {
              role: 'customer' as const,
              userId: customer.id,
              displayName: customer.name,
              companyName: customer.company
            };
            setSession(newSession);
            sessionStorage.setItem('crm_active_session', JSON.stringify(newSession));
            setActiveTab('dashboard');
          } else {
            setLoginError('Ungültiges Passwort für diesen Kunden.');
          }
        } else {
          setLoginError('Kundenbenutzername existiert nicht.');
        }
      }
    } catch (err) {
      console.error('Error during authentication', err);
      setLoginError('Ein Anmeldefehler ist aufgetreten.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem('crm_active_session');
    setUsername('');
    setPassword('');
    setLoginError(null);
  };

  // --- CUSTOM COMPACT DEMO SHORTCUT REGISTER ---
  const triggerQuickDemoLogin = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setLoginRole('admin');
      setUsername('admin');
      setPassword('admin123');
    } else {
      setLoginRole('customer');
      setUsername('max.muster');
      setPassword('kunde123');
    }
  };

  // Resolve active customer file database model when customer is logged in
  const loggedInCustomer = useMemo(() => {
    if (session?.role === 'customer') {
      return data.customers.find(c => c.id === session.userId);
    }
    return null;
  }, [data.customers, session]);

  // --- RENDERING PAGE CHASSIS ---
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 font-sans overflow-hidden antialiased">
      {/* Dynamic Kraftwerk Workspace Cockpit Switcher Bar */}
      <div className="h-11 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300 font-sans z-50 flex-shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="font-mono font-bold tracking-wider text-[10px] text-indigo-400 uppercase">Kraftwerk Workspace Cockpit</span>
          </div>
          <span className="text-slate-800">|</span>
          <div className="text-slate-400 font-medium">
            {!session && !showLogin && (
              <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">●</span> Live-Website: <strong className="text-white font-semibold">Öffentliches Frontend (Besucher-Modus)</strong></span>
            )}
            {!session && showLogin && (
              <span className="flex items-center gap-1.5"><span className="text-amber-400 font-bold">●</span> System-Check: <strong className="text-white font-semibold">Anmelde-Portal (Gateway)</strong></span>
            )}
            {session?.role === 'customer' && (
              <span className="flex items-center gap-1.5"><span className="text-sky-400 font-bold">●</span> Kundenkonto: <strong className="text-white font-semibold">{session.displayName} ({session.companyName})</strong></span>
            )}
            {session?.role === 'admin' && activeTab === 'preview-public' && (
              <span className="flex items-center gap-1.5"><span className="text-indigo-400 animate-pulse">●</span> Admin-Modus: <strong className="text-white font-semibold">Live-Vorschau (Öffentliche Homepage)</strong></span>
            )}
            {session?.role === 'admin' && simulatedCustomerId && (
              <span className="flex items-center gap-1.5"><span className="text-yellow-500 animate-pulse">●</span> Admin-Modus: <strong className="text-white font-semibold">Portalsimulation ({data.customers.find(c => c.id === simulatedCustomerId)?.name})</strong></span>
            )}
            {session?.role === 'admin' && !simulatedCustomerId && activeTab !== 'preview-public' && (
              <span className="flex items-center gap-1.5"><span className="text-rose-500 animate-pulse">●</span> Admin-Modus: <strong className="text-white font-semibold">Sicherheitszentrale (Backend-Einstellung)</strong></span>
            )}
          </div>
        </div>

        {/* Workspace Quick Jump Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 mr-1.5 uppercase font-mono font-bold">Direkt-Wechsel:</span>
          
          {/* Button 1: Visitor Frontend Homepage */}
          <button
            type="button"
            onClick={() => {
              setSession(null);
              setShowLogin(false);
              setSimulatedCustomerId(null);
            }}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5 select-none ${
              !session && !showLogin
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
            title="Die öffentliche Homepage als unbekannter Besucher betrachten"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Öffentliche Website</span>
          </button>

          {/* Button 2: Administrator CRM Backend */}
          <button
            type="button"
            onClick={() => {
              const newSession = {
                role: 'admin' as const,
                userId: 'admin',
                displayName: 'System-Administrator'
              };
              setSession(newSession);
              sessionStorage.setItem('crm_active_session', JSON.stringify(newSession));
              setSimulatedCustomerId(null);
              setActiveTab('dashboard');
              setShowLogin(false);
            }}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5 select-none ${
              session?.role === 'admin' && !simulatedCustomerId && activeTab !== 'preview-public'
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
            title="Im Backoffice einloggen und Webinhalte, Produkte, DMs oder Kunden bearbeiten"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin-Backend</span>
          </button>

          {/* Button 3: Simulated Customer Portal */}
          <button
            type="button"
            onClick={() => {
              const firstCust = data.customers[0] || { id: 'cust-max', name: 'Max Mustermann', company: 'Muster GmbH' };
              const newSession = {
                role: 'admin' as const,
                userId: 'admin',
                displayName: 'System-Administrator'
              };
              setSession(newSession);
              sessionStorage.setItem('crm_active_session', JSON.stringify(newSession));
              setSimulatedCustomerId(firstCust.id);
              setActiveTab('dashboard');
              setShowLogin(false);
            }}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium text-[11px] flex items-center gap-1.5 select-none ${
              session?.role === 'admin' && simulatedCustomerId
                ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
            title="Sichtweise des Kunden simulieren (Dateien hochladen, Rechnungen u. Roadmap sehen)"
          >
            <User className="w-3.5 h-3.5" />
            <span>Kunden-Vorschau</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Workspace Container */}
      <div className="flex-1 flex overflow-hidden relative bg-slate-100">
        {session ? (
        /* APPLICAION ACTIVE PORTAL VIEW */
        <div className="flex w-full h-full">
          <Sidebar
            role={simulatedCustomerId ? 'customer' : session.role}
            displayName={simulatedCustomerId ? (data.customers.find(c => c.id === simulatedCustomerId)?.name || 'Geladener Mandant') : session.displayName}
            companyName={simulatedCustomerId ? (data.customers.find(c => c.id === simulatedCustomerId)?.company || 'Firma') : session.companyName}
            currentTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={() => {
              setSimulatedCustomerId(null);
              handleLogout();
            }}
            unreadCount={unreadMessagesCount}
            appointmentsEnabled={data.settings?.appointmentsEnabled !== false}
            invoicesEnabled={data.settings?.invoicesEnabled !== false}
            shopEnabled={data.settings?.shopEnabled !== false}
            blogEnabled={data.settings?.blogEnabled !== false}
            videosEnabled={data.settings?.videosEnabled !== false}
            botEnabled={data.settings?.botEnabled !== false}
            chatEnabled={data.settings?.chatEnabled !== false}
            siteHeaderName={data.settings?.siteHeaderName}
          />
          
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {session.role === 'admin' ? (
              activeTab === 'preview-public' ? (
                <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in">
                  <PublicFrontend
                    data={data}
                    onDataChange={setData}
                    onOpenLogin={() => {}}
                    isAdminPreview={true}
                    onClosePreview={() => setActiveTab('dashboard')}
                  />
                </div>
              ) : simulatedCustomerId ? (
                <div className="flex-grow flex flex-col h-full overflow-hidden animate-fade-in">
                  <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white px-5 py-2.5 flex items-center justify-between text-xs font-bold font-sans shadow-md select-none flex-shrink-0 animate-fade-in">
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 bg-white text-orange-700 font-mono text-[9px] rounded font-extrabold uppercase animate-pulse">Vorschau</span>
                       <span>Sie betrachten das Frontend (Kundenportal) von <strong className="underline decoration-wavy">{data.customers.find(c => c.id === simulatedCustomerId)?.name || 'Kunde'}</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setSimulatedCustomerId(null);
                        setActiveTab('dashboard'); // Go back to admin dashboard
                      }}
                      className="px-3 py-1 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 text-[10px] font-bold font-mono uppercase tracking-wide rounded-md transition-all cursor-pointer"
                    >
                      ← ADMIN-BACKEND (Vorschau beenden)
                    </button>
                  </div>
                  <CustomerPortal
                    customer={data.customers.find(c => c.id === simulatedCustomerId) || data.customers[0]}
                    data={data}
                    onDataChange={setData}
                    activeTab={activeTab}
                    isOnline={isOnline}
                    onOnlineToggle={handleSetOnline}
                    onTabChange={setActiveTab}
                  />
                </div>
              ) : (
                <AdminCRM
                  data={data}
                  onDataChange={setData}
                  activeTab={activeTab}
                  isOnline={isOnline}
                  onOnlineToggle={handleSetOnline}
                  onTabChange={setActiveTab}
                  onSimulateCustomer={setSimulatedCustomerId}
                  onPreviewPublicFrontend={() => setActiveTab('preview-public')}
                />
              )
            ) : (
              loggedInCustomer ? (
                <CustomerPortal
                  customer={loggedInCustomer}
                  data={data}
                  onDataChange={setData}
                  activeTab={activeTab}
                  isOnline={isOnline}
                  onOnlineToggle={handleSetOnline}
                  onTabChange={setActiveTab}
                />
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono">
                  Sitzungsfehler: Kundenprofil nicht in lokaler Mappe gefunden.
                </div>
              )
            )}
          </main>
        </div>
      ) : showLogin ? (
        /* APP GATEWAY LOGIN VIEW */
        <div className="flex w-full h-full lg:grid lg:grid-cols-2 overflow-hidden bg-slate-900 select-none">
          {/* LEFT PANEL: Branding & Visuals */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-slate-950 to-slate-900 text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
            
            {/* Logo */}
            <div className="flex items-center space-x-3.5 relative z-10">
              <div className="p-2 bg-blue-600/15 text-blue-400 rounded-xl border border-blue-500/20">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase leading-none font-sans text-white">Kraftwerk Suite</h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">Offline-Zentrale & Corporate Vault</p>
              </div>
            </div>

            {/* Intro typography */}
            <div className="max-w-md space-y-4 relative z-10">
              <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
                Die sichere Offline-Zentrale für Ihre Kundendaten.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Dieses Portal arbeitet vollständig in Ihrer lokalen Sandbox. Ohne externe Server, ohne Cloud oder Python-Dienste. Ihre Verträge, Dateiverläufe und Videoübertragungen bleiben immer auf Ihrem Computer geschützt.
              </p>
            </div>

            {/* Micro Credit Indicator */}
            <div className="flex items-center justify-center text-xs text-slate-500 font-mono relative z-10 border-t border-slate-800/80 pt-6">
              <span>Gestaltet von: System-Administration</span>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Form */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-950 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent"></div>
            
            <div className="w-full max-w-md space-y-8 relative z-10">
              <div className="text-center lg:text-left">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="mb-4 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono tracking-wider cursor-pointer font-bold uppercase transition-all"
                >
                  ← Zurück zur Homepage
                </button>
                <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Portal Anmeldung</h2>
                <p className="text-sm text-slate-400 mt-1.5">Wählen Sie Ihren Kontotyp und tragen Sie Ihre Login-Daten ein.</p>
              </div>

              {/* Login Role Toggle tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setLoginRole('admin'); setLoginError(null); }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    loginRole === 'admin' 
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Admin (CMS-Leitung)
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginRole('customer'); setLoginError(null); }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    loginRole === 'customer' 
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Mandant (Kundenportal)
                </button>
              </div>

              {/* Login error warnings card */}
              {loginError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/35 rounded-xl flex items-start space-x-3 text-rose-300 text-xs animate-shake">
                  <ShieldAlert className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-normal">{loginError}</p>
                </div>
              )}

              {/* Actual verification form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Benutzername</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="input-username"
                      type="text"
                      placeholder={loginRole === 'admin' ? 'z.B. admin' : 'z.B. max.muster'}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800/90 text-white rounded-xl py-3 pl-11 pr-4 outline-none text-sm focus:border-blue-500 focus:bg-slate-900 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Passwort</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="input-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800/90 text-white rounded-xl py-3 pl-11 pr-4 outline-none text-sm focus:border-blue-500 focus:bg-slate-900 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit"
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium text-sm rounded-xl transition-all duration-250 shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  {isVerifying ? 'Anmeldung wird geprüft...' : 'Im Portal anmelden'}
                </button>
              </form>

              {/* DEVELOPER QUICK-SIGN-IN BYPASS PANEL FOR DEMO WORKFLOWS */}
              <div className="pt-6 border-t border-slate-800/80 space-y-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-400">
                  <span className="uppercase font-bold text-slate-400">Entwickler-Schnellzugriff</span>
                  <span className="text-blue-400 font-bold animate-pulse">1-Click Live-Demo</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newSession = {
                        role: 'admin' as const,
                        userId: 'admin',
                        displayName: 'System-Administrator'
                      };
                      setSession(newSession);
                      sessionStorage.setItem('crm_active_session', JSON.stringify(newSession));
                      setActiveTab('dashboard');
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/30 rounded-xl transition-all group cursor-pointer"
                  >
                    <span className="text-[10px] text-slate-500 font-mono group-hover:text-blue-400 transition-colors uppercase">CMS-Leitung</span>
                    <span className="text-xs font-bold text-white mt-0.5">Admin-Zentrale</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const customer = data.customers[0] || { id: 'cust-max', name: 'Max Muster', company: 'Muster GmbH' };
                      const newSession = {
                        role: 'customer' as const,
                        userId: customer.id,
                        displayName: customer.name,
                        companyName: customer.company
                      };
                      setSession(newSession);
                      sessionStorage.setItem('crm_active_session', JSON.stringify(newSession));
                      setActiveTab('dashboard');
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/30 rounded-xl transition-all group cursor-pointer"
                  >
                    <span className="text-[10px] text-slate-500 font-mono group-hover:text-blue-400 transition-colors uppercase">Kundenbereich</span>
                    <span className="text-xs font-bold text-white mt-0.5">Kunden-Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PUBLIC VISITOR FRONTEND DISPLAYED BY DEFAULT */
        <div className="w-full h-full overflow-hidden flex flex-col">
          <PublicFrontend 
            data={data}
            onDataChange={setData}
            onOpenLogin={() => setShowLogin(true)}
            isAdminPreview={false}
          />
        </div>
      )}
      </div>
    </div>
  );
}
