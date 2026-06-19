import React, { useState } from 'react';
import { STYLE_TEMPLATES, StyleTemplate } from '../styleTemplates';
import { CRMData } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  RefreshCw, 
  Palette, 
  Layers, 
  AlertCircle, 
  Bookmark,
  Eye,
  EyeOff,
  GripVertical,
  Sliders,
  Power,
  Info 
} from 'lucide-react';

interface TemplatesManagerProps {
  data: CRMData;
  onDataChange: (data: CRMData) => void;
  logAction: (action: string, details: string) => void;
  activeTemplate: StyleTemplate;
}

export default function TemplatesManager({ data, onDataChange, logAction, activeTemplate }: TemplatesManagerProps) {
  const settings = data.settings || {
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

  const currentTemplateId = settings.activeTemplateId;

  // --- HOMEPAGE DRAG & DROP & LAYOUT MODUS STATES ---
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedWidgetId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedWidgetId && draggedWidgetId !== id) {
      setDragOverWidgetId(id);
    }
  };

  const handleDrop = (targetId: string) => {
    if (!draggedWidgetId || draggedWidgetId === targetId) return;
    
    const currentOrder = [...(settings.publicWidgetsOrder || ['hero', 'modules', 'advantages', 'blogTeaser'])];
    const draggedIndex = currentOrder.indexOf(draggedWidgetId);
    const targetIndex = currentOrder.indexOf(targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      currentOrder.splice(draggedIndex, 1);
      currentOrder.splice(targetIndex, 0, draggedWidgetId);
      
      onDataChange({
        ...data,
        settings: {
          ...settings,
          publicWidgetsOrder: currentOrder
        }
      });
      logAction('Homepage Widgets sortiert', `Reihenfolge: ${currentOrder.join(' → ')}`);
    }
    
    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const handleToggleVisibility = (id: string) => {
    const currentVisibility = { ...(settings.publicWidgetsVisibility || { hero: true, modules: true, advantages: true, blogTeaser: true }) };
    currentVisibility[id] = currentVisibility[id] !== false ? false : true;

    onDataChange({
      ...data,
      settings: {
        ...settings,
        publicWidgetsVisibility: currentVisibility
      }
    });
    logAction('Homepage Widget-Sichtbarkeit geändert', `${id} ist nun ${currentVisibility[id] ? 'Sichtbar' : 'Ausgeblendet'}`);
  };

  const handleToggleLayoutModus = () => {
    const nextVal = !settings.publicLayoutModusEnabled;
    onDataChange({
      ...data,
      settings: {
        ...settings,
        publicLayoutModusEnabled: nextVal
      }
    });
    logAction('Layout-Modus geändert', `Der Layout-Modus für das öffentliche Frontend wurde ${nextVal ? 'aktiviert' : 'deaktiviert'}.`);
  };

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    const updatedSettings = {
      ...settings,
      activeTemplateId: templateId
    };

    onDataChange({
      ...data,
      settings: updatedSettings
    });

    logAction('Portal-Design geändert', `Neues aktives Layout: '${templateName}' (${templateId})`);
    alert(`Das Design '${templateName}' wurde erfolgreich geladen und systemweit als Standard aktiviert!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-600" />
            Vorschau- & Theme-Templatesystem
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Wählen Sie aus 10 hochwertig gestalteten Design-Pre-Configurations. Jedes Template passt Farben, Abstände, Rundungen und Fonts des Dashboards und Shops an.
          </p>
        </div>

        <div className="text-[10px] bg-indigo-50 font-mono font-bold tracking-wider rounded border border-indigo-100 text-indigo-700 px-3 py-1 bg-indigo-50 px-3 py-1">
          AKTIV: {activeTemplate.name}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STYLE_TEMPLATES.map((tpl) => {
          const isActive = tpl.id === currentTemplateId;
          return (
            <div 
              key={tpl.id} 
              className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 ${
                isActive ? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-slate-100'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header title */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                      <Bookmark className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {tpl.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wide">ID: {tpl.id}</p>
                  </div>

                  {isActive ? (
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white border border-indigo-500 font-bold text-[9px] tracking-wide rounded-full uppercase">
                      Aktiviert
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 border border-slate-100/50 font-semibold text-[9px] tracking-wide rounded-full uppercase">
                      Inaktiv
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-normal">{tpl.description}</p>

                {/* Color and element previews */}
                <div className="space-y-2">
                  <span className="text-[8px] text-slate-400 font-mono block uppercase">Stiluhr-Parameter</span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-center select-none font-mono">
                    <div className="py-1 bg-slate-100 rounded text-slate-600 border border-slate-200/50">
                      Rundung: {tpl.roundedClass.replace('rounded-', '') || 'Kanten'}
                    </div>
                    <div className="py-1 bg-slate-100 rounded text-slate-600 border border-slate-200/50">
                      Font: {tpl.fontClass.replace('font-', '')}
                    </div>
                    <div className="py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Theme
                    </div>
                    <div className={`${tpl.bgMain} ${tpl.borderClass} border py-1 rounded text-slate-600`}>
                      Hintergrund
                    </div>
                  </div>
                </div>

                {/* Element rendering preview block */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-150/50 space-y-2 select-none">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Vorschau Card Element</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] ${tpl.badgeClass}`}>Badge</span>
                  </div>
                  <div className="flex gap-2">
                    <div className={`p-2.5 flex-1 bg-white border ${tpl.borderClass} ${tpl.roundedClass} ${tpl.fontClass} text-xs`}>
                      <span className={`font-bold block ${tpl.textPrimary}`}>Überschrift</span>
                      <span className="text-slate-400 text-[10px]">Beschreibungstext im Template Stil</span>
                    </div>
                    <button className={`p-2 px-3 self-center text-[10px] font-bold ${tpl.primaryButton} ${tpl.roundedClass} leading-none`}>
                      Button
                    </button>
                  </div>
                </div>
              </div>

              {/* Activation panel */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100/50 flex justify-end">
                {isActive ? (
                  <div className="text-xs text-indigo-600 font-bold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Aktuelles Thema
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectTemplate(tpl.id, tpl.name)}
                    className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Theme aktivieren <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- PUBLIC FRONTEND LAYOUT CUSTOMIZATION LAYER --- */}
      <div className="bg-slate-900 text-white rounded-3xl border border-indigo-950 p-6 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-indigo-950/60">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold font-sans text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-400" />
              Öffentliches Frontend: Homepage Layout-Modus
            </h2>
            <p className="text-xs text-slate-400 max-w-xl font-sans">
              Aktivieren Sie den Layout-Modus, um die Anordnung und Sichtbarkeit der Homepage-Widgets komplett selbst per Drag-and-Drop zu steuern.
            </p>
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={handleToggleLayoutModus}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-sans tracking-wide col-span-1 border flex items-center gap-2 transition-all cursor-pointer ${
              settings.publicLayoutModusEnabled
                ? 'bg-indigo-650 hover:bg-indigo-700 text-white border-indigo-600 shadow-md shadow-indigo-700/10'
                : 'bg-slate-800 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Power className={`w-4 h-4 ${settings.publicLayoutModusEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Layout-Modus: {settings.publicLayoutModusEnabled ? 'AKTIVIERT' : 'DEAKTIVIERT'}</span>
          </button>
        </div>

        {/* Informative Box if Deactivated */}
        {!settings.publicLayoutModusEnabled && (
          <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl flex gap-3 text-xs text-slate-400 leading-normal font-sans">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p>
              Derzeit ist das <strong>standardmäßige statische Layout</strong> auf der Homepage aktiv. Wenn Sie den Layout-Modus aktivieren, überschreibt Ihre eigens gestaltete widgetspezifische Reihenfolge und Einblendung das Standard-Layout.
            </p>
          </div>
        )}

        {/* Drag-and-Drop Editor Canvas */}
        <div className="space-y-3.5">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 block">
            Anordnung & Sichtbarkeit der Sektionen auf der Homepage:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(settings.publicWidgetsOrder || ['hero', 'modules', 'advantages', 'blogTeaser']).map((widgetId, index) => {
              const isVisible = (settings.publicWidgetsVisibility || { hero: true, modules: true, advantages: true, blogTeaser: true })[widgetId] !== false;
              let title = '';
              let desc = '';
              if (widgetId === 'hero') {
                title = '1. Hero-Banner';
                desc = 'Haupt-Begrüßungstext, Slogan und Button-Verweise.';
              } else if (widgetId === 'modules') {
                title = '2. Modul-Status Grid';
                desc = 'Das Gitter mit aktuellen Statusanzeigen der Suite-Module.';
              } else if (widgetId === 'advantages') {
                title = '3. Systemvorteile Block';
                desc = 'Vorteile wie E2E, DSGVO und Rechtstexte.';
              } else if (widgetId === 'blogTeaser') {
                title = '4. Blog-Artikel Teaser';
                desc = 'Die 3 neuesten verfassten Blogeinträge.';
              }

              return (
                <div
                  key={widgetId}
                  draggable
                  onDragStart={() => handleDragStart(widgetId)}
                  onDragOver={(e) => handleDragOver(e, widgetId)}
                  onDrop={() => handleDrop(widgetId)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing select-none relative ${
                    isVisible
                      ? 'bg-slate-850 border-indigo-500/20 hover:border-indigo-500/40'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-800 opacity-50'
                  } ${
                    dragOverWidgetId === widgetId ? 'border-yellow-400 scale-[1.01]' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-sans font-bold text-xs text-white min-w-0">
                        <GripVertical className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(widgetId)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer outline-none ${
                          isVisible ? 'text-indigo-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-850'
                        }`}
                        title={isVisible ? 'Sektion ausblenden' : 'Sektion einblenden'}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between font-mono text-[9px] text-slate-500">
                    <span>Reihenfolge: #{index + 1}</span>
                    <span className={isVisible ? 'text-indigo-400 font-bold' : 'text-rose-500 font-semibold'}>
                      {isVisible ? 'SICHTBAR' : 'STUMM'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/40 p-3 rounded-xl border border-indigo-950/40 flex items-start gap-2 select-none">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500/80 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Echtzeit-Synchronisation:</strong> Die Änderungen werden ohne Neuladen wirksam. Sie können ein neues Browser-Tab mit dem öffentlichen Frontend öffnen oder in die Livevorschau wechseln, um die Anordnung sofort zu bewundern.
          </p>
        </div>
      </div>
    </div>
  );
}
