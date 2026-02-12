import { useState } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
import { calcularTaxaEquivalenteController } from '../controllers/taxaEquivalenteController';

const initial = { 
  taxaInformada: '', 
  periodoInformado: 'mensal', 
  periodoSolicitado: 'anual',
  n: '' 
};

const periodoOptions = [
  { value: 'diario', label: 'Diário' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'bimestral', label: 'Bimestral' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

export default function TaxaEquivalenteForm() {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await calcularTaxaEquivalenteController(values);
      setResult(res);
    } catch (err) {
      setError(err?.payload?.message || err?.message || 'Erro ao calcular');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setValues(initial);
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-6 shadow-lg shadow-black/30 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Taxas Equivalentes
        <span className="text-xs font-normal px-2 py-0.5 rounded bg-sky-600/30 text-sky-300 border border-sky-500/40">Beta</span>
      </h2>
      
      <form onSubmit={onSubmit} onReset={onReset} className="grid gap-5">
        <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-slate-200">Fórmula</h3>
            <FormulaTooltip formula="i_eq = (1 + i)^(n_eq/n) - 1" />
          </div>
          <p className="text-xs text-slate-400">
            Onde: <span className="text-sky-400">i</span> = taxa informada, 
            <span className="text-sky-400"> i_eq</span> = taxa equivalente, 
            <span className="text-sky-400"> n</span> = período informado, 
            <span className="text-sky-400"> n_eq</span> = período solicitado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-300 mb-1" htmlFor="taxaInformada">
              Taxa Informada (%)
            </label>
            <input
              id="taxaInformada"
              name="taxaInformada"
              type="number"
              step="any"
              value={values.taxaInformada}
              onChange={onChange}
              placeholder="ex: 2.5"
              required
              className="rounded-lg border px-3 py-2 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 border-slate-600"
            />
            <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Taxa efetiva no período informado</span>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-300 mb-1" htmlFor="periodoInformado">
              Período da Taxa Informada
            </label>
            <Select
              id="periodoInformado"
              name="periodoInformado"
              value={values.periodoInformado}
              onChange={onChange}
              options={periodoOptions}
            />
            <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Período em que a taxa é efetiva</span>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-300 mb-1" htmlFor="periodoSolicitado">
              Período Solicitado (Equivalente)
            </label>
            <Select
              id="periodoSolicitado"
              name="periodoSolicitado"
              value={values.periodoSolicitado}
              onChange={onChange}
              options={periodoOptions}
            />
            <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Período para conversão da taxa</span>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-300 mb-1" htmlFor="n">
              N° de Períodos (opcional)
            </label>
            <input
              id="n"
              name="n"
              type="number"
              step="any"
              value={values.n}
              onChange={onChange}
              placeholder="ex: 12"
              className="rounded-lg border px-3 py-2 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 border-slate-600"
            />
            <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Quantidade de períodos (se aplicável)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            type="submit" 
            disabled={loading} 
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800/50 disabled:cursor-not-allowed px-5 py-2 text-sm font-medium shadow shadow-sky-900/50 transition-colors"
          >
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />}
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
          <button 
            type="reset" 
            disabled={loading} 
            className="rounded-lg border border-slate-600 hover:border-slate-500 px-5 py-2 text-sm font-medium text-slate-200 disabled:opacity-50"
          >
            Limpar
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6">
          <div className="text-sm font-medium text-slate-300 mb-3">Resultado</div>
          {result.conversao && (
            <div className="mb-4 p-4 bg-emerald-950/30 border border-emerald-700/40 rounded-lg">
              <p className="text-emerald-300 text-sm font-medium">{result.conversao}</p>
            </div>
          )}
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between p-3 bg-slate-950/70 border border-slate-700 rounded-lg">
              <span className="text-slate-400">Taxa Equivalente (%):</span>
              <span className="text-emerald-300 font-semibold">{result.taxaEquivalente?.toFixed(6)}%</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-950/70 border border-slate-700 rounded-lg">
              <span className="text-slate-400">Taxa Informada (decimal):</span>
              <span className="text-sky-300">{result.taxaInformadaDecimal?.toFixed(8)}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-950/70 border border-slate-700 rounded-lg">
              <span className="text-slate-400">Taxa Equivalente (decimal):</span>
              <span className="text-sky-300">{result.taxaEquivalenteDecimal?.toFixed(8)}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 text-sm text-rose-300 bg-rose-950/30 border border-rose-700/40 rounded-lg p-3">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {!result && !error && (
        <div className="mt-6">
          <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-200 mb-2">Exemplos de uso:</h4>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Taxa de 2% ao mês → equivalente ao ano</li>
              <li>Taxa de 12% ao ano → equivalente ao mês</li>
              <li>Taxa de 5% ao semestre → equivalente ao trimestre</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
