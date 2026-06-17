import React, { useState } from 'react';
import { STYLE_TEMPLATES, StyleTemplate } from '../styleTemplates';
import { CRMData } from '../types';
import { Sparkles, CheckCircle2, ChevronRight, RefreshCw, Palette, Layers, AlertCircle, Bookmark } from 'lucide-react';

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
    companyName: 'Kraftwerk Enterprise Solutions',
    companyAddress: 'Hauptstr. 45, 80331 München, Germany',
    companyEmail: 'billing@kraftwerk-suite.de',
    companyPhone: '+49 89 20304050',
    iban: 'DE89 3704 0044 0532 9901 02',
    bic: 'SOLODEM1XXX',
    taxId: 'DE 258/119/93120'
  };

  const currentTemplateId = settings.activeTemplateId;

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
    </div>
  );
}
