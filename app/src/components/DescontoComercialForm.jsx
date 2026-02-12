import { useMemo, useState } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
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
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-6 shadow-lg shadow-black/30 border border-slate-700 mt-10">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Desconto Comercial
        <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">Novo</span>
      </h2>
      <form onSubmit={onSubmit} onReset={onReset} className="grid gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-slate-300">Qual variável deseja calcular?</label>
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
          <p className="mt-2 text-xs text-slate-400">{targetExplanations[values.target]}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(fieldMeta).map(([key, meta]) => (
            <div key={key} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <label className="text-sm font-medium text-slate-300" htmlFor={key}>{meta.label}</label>
              </div>
              {(key === 'taxaDesconto' || key === 'taxaEfetiva' || key === 'tempo') && (
                <div className="-mb-1">
                  <span className="text-[10px] tracking-wide text-slate-500">
                    Unidade: <span className="text-slate-300">
                      {key === 'tempo' ? (TIME_UNIT_OPTIONS.find(o => o.value === values.tempoUnit)?.label) : (RATE_UNIT_OPTIONS.find(o => o.value === values.taxaUnit)?.label)}
                    </span>
                  </span>
                </div>
              )}
              {(key === 'taxaDesconto' || key === 'taxaEfetiva' || key === 'tempo') ? (
                <div className="flex items-stretch gap-2">
                  <input
                    id={key}
                    name={key}
                    value={values[key]}
                    onChange={onChange}
                    placeholder={meta.placeholder}
                    disabled={!!disabled[key]}
                    className="flex-1 rounded-lg border px-3 py-2 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed border-slate-600"
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
                  value={values[key]}
                  onChange={onChange}
                  placeholder={meta.placeholder}
                  disabled={!!disabled[key]}
                  className="rounded-lg border px-3 py-2 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed border-slate-600"
                />
              )}
              <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">{meta.help}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:cursor-not-allowed px-5 py-2 text-sm font-medium shadow shadow-emerald-900/50 transition-colors">
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />}
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
          <button type="reset" disabled={loading} className="rounded-lg border border-slate-600 hover:border-slate-500 px-5 py-2 text-sm font-medium text-slate-200 disabled:opacity-50">Limpar</button>
        </div>
      </form>

      {result && (
        <div className="mt-6">
          <div className="text-sm font-medium text-slate-300 mb-1">Resultado</div>
          <pre className="text-sm bg-slate-950/70 border border-slate-700 rounded-lg p-4 overflow-x-auto text-emerald-300 shadow-inner">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-6 text-sm text-rose-300 bg-rose-950/30 border border-rose-700/40 rounded-lg p-3">
          <strong>Erro:</strong> {error}
        </div>
      )}
      {!result && !error && (
        <p className="mt-6 text-xs text-slate-500">Preencha N, VP e n (ou N, D e n) para calcular d; para iₑ use d e n ou N, VP e n.</p>
      )}
    </div>
  );
}
