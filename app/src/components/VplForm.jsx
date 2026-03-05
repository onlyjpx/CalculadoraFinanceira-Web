import { useState } from 'react';
import ResultDisplay from './ui/ResultDisplay';
import UnitSelect from './ui/UnitSelect';
import { RATE_UNIT_OPTIONS, TIME_UNIT_OPTIONS } from '../utils/timeUnits';
import { calcularVplController } from '../controllers/vplController';

const initial = { investimento: '', taxa: '', valorResidual: '', periodoResidual: '', taxaUnit: 'mes', tempoUnit: 'mes' };

export default function VplForm() {
  const [values, setValues] = useState(initial);
  const [tempo, setTempo] = useState('');
  const [fluxos, setFluxos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  /* Ao mudar o tempo, redimensiona o array de fluxos de caixa */
  const onTempoChange = (e) => {
    const val = e.target.value;
    setTempo(val);
    const n = Math.max(0, Math.min(100, parseInt(val) || 0));
    setFluxos((prev) => {
      const next = [...prev];
      while (next.length < n) next.push('');
      next.length = n;
      return next;
    });
  };

  const onFluxoChange = (index, value) => {
    setFluxos((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  /* Preenche todos os fluxos com o mesmo valor */
  const fillAll = () => {
    const firstValue = fluxos.find((f) => f !== '') || '';
    if (firstValue) setFluxos(fluxos.map(() => firstValue));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await calcularVplController({ ...values, fluxosDeCaixa: fluxos, tempo });
      setResult(res);
    } catch (err) {
      setError(err?.payload?.message || err?.message || 'Erro ao calcular');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setValues(initial);
    setTempo('');
    setFluxos([]);
    setResult(null);
    setError('');
  };

  return (
    <div>
      <ResultDisplay
        result={result}
        error={error}
        hint="Informe investimento, taxa, fluxos de caixa e clique em Calcular."
        mainKey="vpl"
      />

      <form onSubmit={onSubmit} onReset={onReset} className="mt-5">
        {/* Row 1: Investimento + Taxa */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="investimento">
              Investimento (I₀)
            </label>
            <input
              id="investimento"
              name="investimento"
              type="number"
              step="any"
              value={values.investimento}
              onChange={onChange}
              placeholder="ex: 50000"
              className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Desembolso inicial
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="taxaVpl">
              Taxa (%)
            </label>
            <div className="flex items-stretch gap-1.5 min-w-0">
              <input
                id="taxaVpl"
                name="taxa"
                type="number"
                step="any"
                value={values.taxa}
                onChange={onChange}
                placeholder="ex: 10"
                className="calc-input flex-1 min-w-0 rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
              />
              <UnitSelect
                value={values.taxaUnit}
                onChange={(e) => setValues((v) => ({ ...v, taxaUnit: e.target.value }))}
                options={RATE_UNIT_OPTIONS}
              />
            </div>
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Taxa de desconto
            </span>
          </div>
        </div>

        {/* Tempo */}
        <div className="mt-3">
          <label className="text-[11px] font-medium text-slate-400 mb-1 block" htmlFor="tempoVpl">
            Tempo (n) — Nº de períodos
          </label>
          <div className="flex items-stretch gap-1.5">
            <input
              id="tempoVpl"
              type="number"
              min="0"
              max="100"
              step="1"
              value={tempo}
              onChange={onTempoChange}
              placeholder="ex: 5"
              className="calc-input flex-1 min-w-0 rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <UnitSelect
              value={values.tempoUnit}
              onChange={(e) => setValues((v) => ({ ...v, tempoUnit: e.target.value }))}
              options={TIME_UNIT_OPTIONS}
            />
          </div>
        </div>

        {/* Dynamic cash flow inputs */}
        {fluxos.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Fluxos de Caixa
              </label>
              <button
                type="button"
                onClick={fillAll}
                className="text-[10px] text-teal-500 hover:text-teal-300 transition-colors cursor-pointer"
                title="Preencher todos com o valor do primeiro"
              >
                ↻ Preencher iguais
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {fluxos.map((fc, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-medium pointer-events-none select-none">
                    {idx + 1}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={fc}
                    onChange={(e) => onFluxoChange(idx, e.target.value)}
                    placeholder="0"
                    className="calc-input w-full rounded-lg border border-slate-700/50 pl-7 pr-2 py-2 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Valor Residual */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="valorResidual">
              Valor Residual
            </label>
            <input
              id="valorResidual"
              name="valorResidual"
              type="number"
              step="any"
              value={values.valorResidual}
              onChange={onChange}
              placeholder="Opcional"
              className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Valor ao final (opcional)
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="periodoResidual">
              Período do V.R.
            </label>
            <input
              id="periodoResidual"
              name="periodoResidual"
              type="number"
              step="1"
              min="1"
              value={values.periodoResidual}
              onChange={onChange}
              placeholder="Último"
              className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
            />
            <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">
              Pode ser diferente de n
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
