import { useEffect, useMemo, useRef, useState } from 'react';

export default function Select({ value, onChange, options = [], placeholder = 'Selecione...', className = '', name = 'target' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const nameRef = useRef(name);

  onChangeRef.current = onChange;
  nameRef.current = name;
  const activeIndex = useMemo(() => options.findIndex((o) => o.value === value), [options, value]);
  const [highlight, setHighlight] = useState(activeIndex >= 0 ? activeIndex : 0);

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
        if (opt) { onChangeRef.current({ target: { value: opt.value, name: nameRef.current } }); setOpen(false); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, highlight, options]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="w-full rounded-lg bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : <span className="text-slate-500">{placeholder}</span>}</span>
        <svg className={`h-4 w-4 text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute z-20 mt-1 w-full rounded-lg bg-slate-900/95 border border-slate-700 shadow-xl overflow-hidden">
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`px-3 py-2 text-sm cursor-pointer select-none ${
                idx === highlight ? 'bg-slate-800 text-slate-100' : 'text-slate-200'
              } ${opt.value === value ? 'bg-teal-900/40 text-teal-300' : ''}`}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => { onChangeRef.current({ target: { value: opt.value, name: nameRef.current } }); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
