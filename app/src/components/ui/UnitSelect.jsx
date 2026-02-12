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
    <span ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${open ? 'ring-2 ring-sky-500' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate text-[10px]">Unidade: <span className="text-slate-100 text-[10px] font-semibold">{current?.label || '---'}</span></span>
        <svg className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg bg-slate-900/95 border border-slate-700 shadow-xl overflow-hidden"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`px-3 py-2 text-xs cursor-pointer select-none flex items-center justify-between ${
                idx === highlight ? 'bg-slate-800 text-slate-100' : 'text-slate-200'
              } ${opt.value === value ? 'bg-sky-900/40 text-sky-300' : ''}`}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => selectOption(opt)}
            >
              <span>{opt.label}</span>
              {opt.value === value && <span className="text-sky-400 text-[10px]">Selecionado</span>}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
