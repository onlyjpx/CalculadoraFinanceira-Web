import { useState } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
import ResultDisplay from './ui/ResultDisplay';
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
    <div>
      {/* Calculator Screen */}
      <ResultDisplay result={result} error={error} hint="Informe a taxa e os períodos para converter." mainKey="taxaEquivalente" />

      <form onSubmit={onSubmit} onReset={onReset} className="mt-5">
        {/* Formula reference */}
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-[#0c0c14] border border-slate-800/40">
          <FormulaTooltip formula="i_eq = (1 + i)^(n_eq/n) - 1" />
          <span className="text-[10px] text-slate-500">
            <span className="text-teal-400">i</span> = taxa informada,
            <span className="text-teal-400"> i_eq</span> = taxa equivalente,
            <span className="text-teal-400"> n</span> = período informado,
            <span className="text-teal-400"> n_eq</span> = período solicitado
          </span>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="taxaInformada">Taxa Informada (%)</label>
            <input
              id="taxaInformada"
              name="taxaInformada"
              type="number"
              step="any"
              value={values.taxaInformada}
              onChange={onChange}
              placeholder="ex: 2.5"
              required
              className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">Taxa efetiva no período informado</span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="periodoInformado">Período da Taxa</label>
            <Select
              id="periodoInformado"
              name="periodoInformado"
              value={values.periodoInformado}
              onChange={onChange}
              options={periodoOptions}
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">Período em que a taxa é efetiva</span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="periodoSolicitado">Período Solicitado</label>
            <Select
              id="periodoSolicitado"
              name="periodoSolicitado"
              value={values.periodoSolicitado}
              onChange={onChange}
              options={periodoOptions}
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">Período para conversão da taxa</span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="n">N° de Períodos (opc.)</label>
            <input
              id="n"
              name="n"
              type="number"
              step="any"
              value={values.n}
              onChange={onChange}
              placeholder="ex: 12"
              className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">Quantidade de períodos (se aplicável)</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="calc-btn calc-btn-primary flex-1 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider text-white cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
            {loading ? 'Calculando...' : '= Calcular'}
          </button>
          <button
            type="reset"
            disabled={loading}
            className="calc-btn rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-700/40 px-5 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 cursor-pointer disabled:opacity-40"
          >
            C
          </button>
        </div>
      </form>

      {/* Usage examples when empty */}
      {!result && !error && (
        <div className="mt-4 p-3 rounded-lg bg-[#0c0c14] border border-slate-800/40">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Exemplos</h4>
          <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc list-inside">
            <li>2% a.m. → equivalente a.a.</li>
            <li>12% a.a. → equivalente a.m.</li>
            <li>5% a.s. → equivalente a.t.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
