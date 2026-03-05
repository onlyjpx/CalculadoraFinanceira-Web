import { useState } from 'react';
import Select from './ui/Select';
import UnitSelect from './ui/UnitSelect';
import { RATE_UNIT_OPTIONS, TIME_UNIT_OPTIONS } from '../utils/timeUnits';
import { calcularAmortizacaoController } from '../controllers/amortizacaoController';

const initial = { sistema: 'SAC', financiamento: '', taxa: '', tempo: '', taxaUnit: 'mes', tempoUnit: 'mes' };

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AmortizacaoForm() {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await calcularAmortizacaoController(values);
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
      {/* ───── Display area ───── */}
      {error ? (
        <div className="calc-screen rounded-xl p-4 border border-rose-900/40">
          <div className="flex items-center gap-2 text-rose-400 text-sm">
            <span className="text-base">⚠</span>
            <span className="font-semibold">Erro</span>
          </div>
          <p className="calc-value text-rose-300 text-sm mt-1">{error}</p>
        </div>
      ) : result ? (
        <div className="calc-screen rounded-xl p-4 border border-emerald-900/30">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold">
                Sistema {result.sistema}
              </span>
            </div>
            <div className="flex gap-4 text-[10px]">
              <span className="text-slate-500">
                Σ PMT:{' '}
                <span className="text-emerald-400 calc-value">{fmt(result.totalPmt)}</span>
              </span>
              <span className="text-slate-500">
                Σ Juros:{' '}
                <span className="text-amber-400 calc-value">{fmt(result.totalJuros)}</span>
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0a0a12]">
                <tr className="border-b border-slate-700/50">
                  <th className="py-2 px-2 text-left text-slate-400 font-semibold">n</th>
                  <th className="py-2 px-2 text-right text-slate-400 font-semibold">PMT</th>
                  <th className="py-2 px-2 text-right text-slate-400 font-semibold">Juros</th>
                  <th className="py-2 px-2 text-right text-slate-400 font-semibold">Amort.</th>
                  <th className="py-2 px-2 text-right text-slate-400 font-semibold">Saldo Dev.</th>
                </tr>
              </thead>
              <tbody>
                {result.periodos.map((p) => (
                  <tr
                    key={p.periodo}
                    className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-1.5 px-2 text-slate-500 calc-value">{p.periodo}</td>
                    <td className="py-1.5 px-2 text-right text-emerald-400 calc-value tabular-nums">
                      {fmt(p.pmt)}
                    </td>
                    <td className="py-1.5 px-2 text-right text-amber-400/80 calc-value tabular-nums">
                      {fmt(p.juros)}
                    </td>
                    <td className="py-1.5 px-2 text-right text-sky-400/80 calc-value tabular-nums">
                      {fmt(p.amortizacao)}
                    </td>
                    <td className="py-1.5 px-2 text-right text-slate-300 calc-value tabular-nums">
                      {fmt(p.saldoDevedor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="calc-screen rounded-xl p-4 border border-slate-800/40">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
              Tabela de Amortização
            </span>
          </div>
          <p className="calc-value text-lg text-slate-600">—</p>
          <p className="text-[10px] text-slate-600 mt-2">
            Preencha os campos e clique em Calcular.
          </p>
        </div>
      )}

      {/* ───── Form ───── */}
      <form onSubmit={onSubmit} onReset={onReset} className="mt-5">
        {/* Sistema select */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
            Sistema de Amortização
          </label>
          <Select
            value={values.sistema}
            onChange={(e) => {
              setValues((v) => ({ ...v, sistema: e.target.value }));
              setResult(null);
              setError('');
            }}
            options={[
              { value: 'SAC', label: 'SAC — Amortização Constante' },
              { value: 'SAF', label: 'SAF — Francês (Price)' },
              { value: 'SAA', label: 'SAA — Americano' },
            ]}
          />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="financiamento">
              Financiamento (VP)
            </label>
            <input
              id="financiamento"
              name="financiamento"
              type="number"
              step="any"
              value={values.financiamento}
              onChange={onChange}
              placeholder="ex: 100000"
              className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Valor do empréstimo
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="taxa">
              Taxa (%)
            </label>
            <div className="flex items-stretch gap-1.5 min-w-0">
              <input
                id="taxa"
                name="taxa"
                type="number"
                step="any"
                value={values.taxa}
                onChange={onChange}
                placeholder="ex: 1.5"
                className="calc-input flex-1 min-w-0 rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
              />
              <UnitSelect
                value={values.taxaUnit}
                onChange={(e) => setValues((v) => ({ ...v, taxaUnit: e.target.value }))}
                options={RATE_UNIT_OPTIONS}
              />
            </div>
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Taxa por período
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="tempo">
              Tempo (n)
            </label>
            <div className="flex items-stretch gap-1.5 min-w-0">
              <input
                id="tempo"
                name="tempo"
                type="number"
                step="1"
                min="1"
                value={values.tempo}
                onChange={onChange}
                placeholder="ex: 12"
                className="calc-input flex-1 min-w-0 rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
              />
              <UnitSelect
                value={values.tempoUnit}
                onChange={(e) => setValues((v) => ({ ...v, tempoUnit: e.target.value }))}
                options={TIME_UNIT_OPTIONS}
              />
            </div>
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Nº de períodos
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="calc-btn calc-btn-primary flex-1 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider text-white cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            )}
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
    </div>
  );
}
