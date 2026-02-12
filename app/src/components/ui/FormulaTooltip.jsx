// Pequeno componente de tooltip baseado em tailwind para mostrar fórmula apenas no hover
export default function FormulaTooltip({ formula, className = '' }) {
  return (
    <span className={`relative inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-slate-700 text-slate-200 cursor-help border border-slate-600 group ${className}`}>?
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 hidden group-hover:block z-20 whitespace-pre text-[11px] font-normal bg-slate-900/90 backdrop-blur border border-slate-600 rounded px-2 py-1 shadow-lg shadow-black/40">
        {formula}
      </span>
    </span>
  );
}
