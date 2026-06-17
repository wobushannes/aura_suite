export interface StyleTemplate {
  id: string;
  name: string;
  description: string;
  bgMain: string;
  bgCard: string;
  bgSidebar: string;
  textPrimary: string;
  textSecondary: string;
  borderClass: string;
  primaryButton: string;
  primaryButtonHover: string;
  badgeClass: string;
  accentClass: string;
  fontClass: string;
  roundedClass: string;
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: "slate-modern",
    name: "Standard Modern Slate",
    description: "Klassisches, elegantes Business-Design mit Slate-Grau und Indigoblauen Akzenten. Sehr klar, modern und aufgeräumt.",
    bgMain: "bg-slate-50",
    bgCard: "bg-white",
    bgSidebar: "bg-slate-900 border-r border-slate-800",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-500",
    borderClass: "border-slate-100",
    primaryButton: "bg-indigo-600 text-white shadow-sm",
    primaryButtonHover: "hover:bg-indigo-700",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100 border",
    accentClass: "text-indigo-600",
    fontClass: "font-sans",
    roundedClass: "rounded-lg"
  },
  {
    id: "royal-velvet",
    name: "Royal Gold & Velvet",
    description: "Luxuriöser, klassischer Gold- und Dunkelrot-Stil mit anmutigen Serifenschriften. Hochwertig, edel und repräsentativ.",
    bgMain: "bg-stone-100",
    bgCard: "bg-stone-50 border border-stone-200",
    bgSidebar: "bg-stone-900 border-r border-amber-500/30",
    textPrimary: "text-stone-900",
    textSecondary: "text-stone-600",
    borderClass: "border-amber-200/55",
    primaryButton: "bg-amber-700 text-stone-100 border border-amber-600 shadow-sm",
    primaryButtonHover: "hover:bg-amber-800",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200 border",
    accentClass: "text-amber-700",
    fontClass: "font-serif",
    roundedClass: "rounded"
  },
  {
    id: "nordic-breeze",
    name: "Nordic Breeze",
    description: "Sehr reduziertes, helles skandinavisches Design mit frischem Minzgrün und viel weißer Fläche. Luftig und harmonisch.",
    bgMain: "bg-zinc-50/60",
    bgCard: "bg-white shadow-xs border border-zinc-100",
    bgSidebar: "bg-zinc-900 border-r border-zinc-800",
    textPrimary: "text-zinc-800",
    textSecondary: "text-zinc-500",
    borderClass: "border-zinc-200/70",
    primaryButton: "bg-emerald-600 text-white font-medium",
    primaryButtonHover: "hover:bg-emerald-700",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    accentClass: "text-emerald-600",
    fontClass: "font-sans",
    roundedClass: "rounded-2xl"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Edge (Neon)",
    description: "Interaktives Tech-Dunkeldesign mit leuchtenden Pink- und Cyan-Akzenten. Modernes monospace Raster-Feeling.",
    bgMain: "bg-zinc-950",
    bgCard: "bg-zinc-900 border border-pink-500/40 shadow-[0_0_15px_-3px_rgba(236,72,153,0.1)]",
    bgSidebar: "bg-black border-r border-pink-500/40",
    textPrimary: "text-pink-50",
    textSecondary: "text-cyan-400",
    borderClass: "border-zinc-800",
    primaryButton: "bg-pink-600 text-black font-mono font-bold tracking-wider",
    primaryButtonHover: "hover:bg-pink-500",
    badgeClass: "bg-zinc-900 text-cyan-400 border border-cyan-400/40 font-mono",
    accentClass: "text-pink-500",
    fontClass: "font-mono",
    roundedClass: "rounded-none"
  },
  {
    id: "bauhaus-school",
    name: "Bauhaus Modernism",
    description: "Starke geometrische Formen, rohe Struktur und Akzente in Primärfarben (Blau/Rot/Gelb). Kantig und ausdrucksstark.",
    bgMain: "bg-neutral-100",
    bgCard: "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    bgSidebar: "bg-zinc-950 border-r-2 border-black",
    textPrimary: "text-black",
    textSecondary: "text-neutral-600",
    borderClass: "border-black border-2",
    primaryButton: "bg-red-600 text-white font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    primaryButtonHover: "hover:bg-red-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
    badgeClass: "bg-yellow-400 text-black border border-black font-bold uppercase",
    accentClass: "text-blue-600",
    fontClass: "font-sans",
    roundedClass: "rounded-none"
  },
  {
    id: "emerald-garden",
    name: "Emerald Garden",
    description: "Tiefes Waldgrün kombiniert mit sanften Sandtönen. Ein Vibe von Nachhaltigkeit, Natur und tiefem Vertrauen.",
    bgMain: "bg-[#fbfaf7]",
    bgCard: "bg-white border border-emerald-900/10 shadow-sm",
    bgSidebar: "bg-emerald-950 border-r border-emerald-900/35",
    textPrimary: "text-emerald-950",
    textSecondary: "text-[#656e60]",
    borderClass: "border-stone-100",
    primaryButton: "bg-emerald-800 text-stone-50 hover:bg-emerald-900",
    primaryButtonHover: "hover:bg-emerald-900",
    badgeClass: "bg-[#f3f4f1] text-emerald-800 border border-emerald-800/10",
    accentClass: "text-emerald-700",
    fontClass: "font-sans",
    roundedClass: "rounded-3xl"
  },
  {
    id: "oceanic-ice",
    name: "Oceanic Ice",
    description: "Kühles Meeresblau gemischt mit zuckersüßen Eis-Cyan-Nuancen. Kristallklarer Glasmorphismus-Grundton.",
    bgMain: "bg-sky-50/20",
    bgCard: "bg-white border border-sky-100 shadow-sm",
    bgSidebar: "bg-slate-950 border-r border-sky-950/40",
    textPrimary: "text-slate-900",
    textSecondary: "text-sky-700",
    borderClass: "border-sky-100",
    primaryButton: "bg-sky-600 text-white hover:bg-sky-700",
    primaryButtonHover: "hover:bg-sky-700",
    badgeClass: "bg-sky-50 text-sky-700 border border-sky-100",
    accentClass: "text-sky-600",
    fontClass: "font-sans",
    roundedClass: "rounded-xl"
  },
  {
    id: "midnight-obsidian",
    name: "Sleek Midnight Obsidian",
    description: "Hochtechnologisches Dunkeldesign mit feinen violetten Konturen. Sehr futuristisch, fokussiert und schonend für die Augen.",
    bgMain: "bg-slate-950",
    bgCard: "bg-slate-900 border border-violet-950/80 shadow-md",
    bgSidebar: "bg-slate-950 border-r border-slate-900",
    textPrimary: "text-slate-100",
    textSecondary: "text-slate-400",
    borderClass: "border-slate-800/60",
    primaryButton: "bg-violet-600 text-white shadow-lg shadow-violet-900/20",
    primaryButtonHover: "hover:bg-violet-700",
    badgeClass: "bg-slate-950 text-violet-300 border border-violet-800/40",
    accentClass: "text-violet-400",
    fontClass: "font-sans",
    roundedClass: "rounded-lg"
  },
  {
    id: "terracotta-warm",
    name: "Warm Terracotta",
    description: "Kreative Kombination aus erdigem Orange-Rot, Kohleschwarz und warmweißen Ebenen. Bezaubernd und nahbar.",
    bgMain: "bg-amber-50/10",
    bgCard: "bg-white border border-amber-900/10 shadow-sm",
    bgSidebar: "bg-neutral-900 border-r border-amber-900/20",
    textPrimary: "text-neutral-900",
    textSecondary: "text-amber-800/80",
    borderClass: "border-orange-50",
    primaryButton: "bg-orange-700 text-stone-50",
    primaryButtonHover: "hover:bg-orange-850",
    badgeClass: "bg-orange-50 text-orange-800 border border-orange-200/50",
    accentClass: "text-orange-700",
    fontClass: "font-sans",
    roundedClass: "rounded-xl"
  },
  {
    id: "swiss-mono",
    name: "Swiss Monochromatic",
    description: "Extrem kontrastreiches Schwarz-Weiß-Konzept nach Schweizer Typografie-Art. Kompromisslos und puristisch.",
    bgMain: "bg-white",
    bgCard: "bg-white border-2 border-black",
    bgSidebar: "bg-neutral-950 border-r-2 border-black",
    textPrimary: "text-black",
    textSecondary: "text-neutral-500",
    borderClass: "border-black",
    primaryButton: "bg-black text-white hover:bg-neutral-800",
    primaryButtonHover: "hover:bg-neutral-800",
    badgeClass: "bg-white text-black border-2 border-black font-semibold",
    accentClass: "text-black font-bold underline decoration-1",
    fontClass: "font-mono",
    roundedClass: "rounded-none"
  }
];

export function getActiveTemplate(templateId?: string): StyleTemplate {
  return STYLE_TEMPLATES.find(t => t.id === templateId) || STYLE_TEMPLATES[0];
}
