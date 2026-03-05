const LABEL_MAP = {
  // Capitalização Simples / Composta
  montante: 'Montante (VF)',
  capital: 'Capital (VP)',
  juros: 'Juros (J)',
  taxa: 'Taxa',
  tempo: 'Tempo (n)',
  // Desconto Comercial
  taxaDesconto: 'Taxa Desconto',
  taxaEfetiva: 'Taxa Efetiva',
  nominal: 'Nominal (N)',
  valorPresente: 'Valor Presente',
  desconto: 'Desconto (D)',
  // Taxa Equivalente
  taxaEquivalente: 'Taxa Equivalente',
  taxaInformadaDecimal: 'Taxa Informada (dec)',
  taxaEquivalenteDecimal: 'Taxa Equiv. (dec)',
  conversao: 'Conversão',
  // Taxas Abaixo
  taxaNominal: 'Taxa Nominal',
  taxaProporcional: 'Taxa Proporcional',
  // VPL
  vpl: 'VPL',
  investimento: 'Investimento',
  somaFluxosDescontados: 'Σ FC Descontados',
  valorResidualDescontado: 'V.R. Descontado',
};

function formatValue(key, val) {
  if (val == null) return '—';
  if (typeof val === 'string') return val;
  const isPercent = /taxa|Taxa/.test(key);
  if (isPercent) return `${Number(val).toFixed(6)} %`;
  return Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

/**
 * Calculator-style result display.
 * @param {{ result: object|null, error: string, hint: string, mainKey?: string }} props
 */
export default function ResultDisplay({ result, error, hint, mainKey }) {
  /* ---- Error state ---- */
  if (error) {
    return (
      <div className="calc-screen rounded-xl p-4 border border-rose-900/40">
        <div className="flex items-center gap-2 text-rose-400 text-sm">
          <span className="text-base">⚠</span>
          <span className="font-semibold">Erro</span>
        </div>
        <p className="calc-value text-rose-300 text-sm mt-1">{error}</p>
      </div>
    );
  }

  /* ---- Empty / hint state ---- */
  if (!result) {
    return (
      <div className="calc-screen rounded-xl p-4 border border-slate-800/40">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Resultado</span>
        </div>
        <p className="calc-value text-lg text-slate-600">0,00</p>
        {hint && <p className="text-[10px] text-slate-600 mt-2">{hint}</p>}
      </div>
    );
  }

  /* ---- Result state ---- */
  const entries = Object.entries(result).filter(([, v]) => v != null);

  // Determine the main entry to highlight
  let mainEntry, secondaryEntries;
  if (mainKey) {
    mainEntry = entries.find(([k]) => k === mainKey);
    secondaryEntries = entries.filter(([k]) => k !== mainKey);
  } else {
    mainEntry = entries[0];
    secondaryEntries = entries.slice(1);
  }

  return (
    <div className="calc-screen rounded-xl p-4 border border-emerald-900/30">
      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold">Resultado</span>
      </div>

      {/* Main highlighted value */}
      {mainEntry && (
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
            {LABEL_MAP[mainEntry[0]] || mainEntry[0]}
          </div>
          <div className="calc-value text-2xl sm:text-3xl font-bold text-emerald-400 tracking-wide">
            {formatValue(mainEntry[0], mainEntry[1])}
          </div>
        </div>
      )}

      {/* Secondary values */}
      {secondaryEntries.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 mt-1 border-t border-slate-800/50">
          {secondaryEntries.map(([key, val]) => (
            <div key={key} className="flex justify-between items-baseline text-xs">
              <span className="text-slate-500 truncate mr-2">{LABEL_MAP[key] || key}</span>
              <span className="calc-value text-slate-300 tabular-nums">{formatValue(key, val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
