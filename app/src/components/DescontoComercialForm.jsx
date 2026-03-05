import { useMemo, useState } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
import ResultDisplay from './ui/ResultDisplay';
import { RATE_UNIT_OPTIONS, TIME_UNIT_OPTIONS } from '../utils/timeUnits';
import UnitSelect from './ui/UnitSelect';
import { calcularDescontoController } from '../controllers/descontoController';

const initial = { target: 'taxaDesconto', nominal: '', valorPresente: '', desconto: '', taxaDesconto: '', tempo: '', taxaEfetiva: '', taxaUnit: 'mes', tempoUnit: 'mes' };

const fieldMeta = {
  nominal: { label: 'Nominal (N)', placeholder: 'ex: 1000', help: 'Valor nominal do título.' },
  valorPresente: { label: 'Valor Presente (VP)', placeholder: 'ex: 950', help: 'Valor atual após o desconto.' },
  desconto: { label: 'Desconto (D)', placeholder: 'ex: 50', help: 'Desconto absoluto aplicado.' },
  taxaDesconto: { label: 'Taxa de Desconto (%)', placeholder: 'ex: 2', help: 'Taxa comercial por período.' },
  tempo: { label: 'Tempo (n)', placeholder: 'ex: 1', help: 'Períodos (ex: meses).' },
  taxaEfetiva: { label: 'Taxa Efetiva (%)', placeholder: 'ex: 2.1', help: 'Taxa equivalente por período.' },
};

const targetExplanations = {
  taxaDesconto: 'Calcular a taxa de desconto comercial (d) a partir de N, VP e n ou N, D e n.',
  taxaEfetiva: 'Calcular a taxa efetiva equivalente (iₑ) a partir de d e n ou N, VP e n.',
};

const formulaMap = {
  taxaDesconto: 'd = D / (N · n) | d = (1 - VP/N) / n | d = iₑ / (1 + iₑ · n)',
  taxaEfetiva: 'iₑ = d / (1 - d · n) | iₑ = ((N/VP) - 1) / n',
};

export default function DescontoComercialForm() {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onTargetChange = (e) => {
    const target = e.target.value;
    setValues((v) => ({ ...v, target, [target]: '' }));
    setResult(null);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await calcularDescontoController(values);
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

  const disabled = useMemo(() => ({ [values.target]: true }), [values.target]);

  return (
    <div>
      {/* Calculator Screen */}
      <ResultDisplay result={result} error={error} hint="Preencha N, VP e n (ou N, D e n) para calcular d; para iₑ use d e n ou N, VP e n." mainKey={values.target} />

      <form onSubmit={onSubmit} onReset={onReset} className="mt-5">
        {/* Target selector */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Variável a calcular</label>
            <FormulaTooltip formula={formulaMap[values.target]} />
          </div>
          <Select
            value={values.target}
            onChange={onTargetChange}
            options={[
              { value: 'taxaDesconto', label: 'Taxa de Desconto (%)' },
              { value: 'taxaEfetiva', label: 'Taxa Efetiva (%)' },
            ]}
          />
          <p className="mt-1.5 text-[10px] text-slate-500">{targetExplanations[values.target]}</p>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(fieldMeta).map(([key, meta]) => (
            <div key={key} className="flex flex-col">
              <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor={key}>{meta.label}</label>
              {(key === 'taxaDesconto' || key === 'taxaEfetiva' || key === 'tempo') ? (
                <div className="flex items-stretch gap-1.5 min-w-0">
                  <input
                    id={key}
                    name={key}
                    type="number"
                    step="any"
                    value={values[key]}
                    onChange={onChange}
                    placeholder={meta.placeholder}
                    disabled={!!disabled[key]}
                    className="calc-input flex-1 min-w-0 rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  />
                  {(key === 'taxaDesconto' || key === 'taxaEfetiva') && (
                    <UnitSelect
                      value={values.taxaUnit}
                      onChange={(e) => setValues((v) => ({ ...v, taxaUnit: e.target.value }))}
                      options={RATE_UNIT_OPTIONS}
                    />
                  )}
                  {key === 'tempo' && (
                    <UnitSelect
                      value={values.tempoUnit}
                      onChange={(e) => setValues((v) => ({ ...v, tempoUnit: e.target.value }))}
                      options={TIME_UNIT_OPTIONS}
                    />
                  )}
                </div>
              ) : (
                <input
                  id={key}
                  name={key}
                  type="number"
                  step="any"
                  value={values[key]}
                  onChange={onChange}
                  placeholder={meta.placeholder}
                  disabled={!!disabled[key]}
                  className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                />
              )}
              <span className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-600">{meta.help}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button type="submit" disabled={loading} className="calc-btn calc-btn-primary flex-1 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider text-white cursor-pointer inline-flex items-center justify-center gap-2">
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
            {loading ? 'Calculando...' : '= Calcular'}
          </button>
          <button type="reset" disabled={loading} className="calc-btn rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-700/40 px-5 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 cursor-pointer disabled:opacity-40">
            C
          </button>
        </div>
      </form>
    </div>
  );
}
