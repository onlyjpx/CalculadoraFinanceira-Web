import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

// UnitSelect agora mostra "Unidade: <label>" dentro do botão seguindo estilo semelhante ao input
export default function UnitSelect({ value, onChange, options = [], className = '' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const activeIndex = useMemo(() => options.findIndex((o) => o.value === value), [options, value]);
  const [highlight, setHighlight] = useState(activeIndex >= 0 ? activeIndex : 0);
  const current = options[activeIndex] || options[0];

  // Definido antes de efeitos que o usam para evitar TDZ
  const selectOption = useCallback((opt) => {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  }, [onChange]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(options.length - 1, h + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(0, h - 1)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const opt = options[highlight];
        if (opt) selectOption(opt);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, highlight, options, selectOption]);

  return (
    <span ref={rootRef} className={`relative inline-flex shrink-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-slate-600/60 bg-[#0c0c14] px-2.5 py-2 text-[11px] font-semibold tracking-wide text-teal-400 hover:border-teal-500/40 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors cursor-pointer ${open ? 'ring-2 ring-teal-500/50 border-teal-500/40' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        {current?.label || '---'}
        <svg className={`h-3 w-3 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-full w-max rounded-lg bg-[#111118]/98 border border-slate-700 shadow-xl shadow-black/40 overflow-hidden backdrop-blur-sm"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`px-3 py-2 text-xs cursor-pointer select-none flex items-center justify-between gap-3 transition-colors ${
                idx === highlight ? 'bg-slate-800 text-slate-100' : 'text-slate-300'
              } ${opt.value === value ? 'bg-teal-900/30 text-teal-300' : ''}`}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => selectOption(opt)}
            >
              <span>{opt.label}</span>
              {opt.value === value && <span className="text-teal-500 text-[10px]">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
