import { useState, useMemo } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
import { calcularSimplesController } from '../controllers/simplesController';
import { RATE_UNIT_OPTIONS, TIME_UNIT_OPTIONS } from '../utils/timeUnits';
import UnitSelect from './ui/UnitSelect';

const initial = { target: 'montante', capital: '', montante: '', juros: '', taxa: '', tempo: '', taxaUnit: 'mes', tempoUnit: 'mes' };

const fieldMeta = {
  capital: { label: 'Capital (VP)', placeholder: 'ex: 1000', help: 'Valor inicial investido/aplicado.' },
  montante: { label: 'Montante (VF)', placeholder: 'ex: 1200', help: 'Valor final após juros.' },
  juros: { label: 'Juros (J)', placeholder: 'ex: 200', help: 'Valor absoluto dos juros.' },
  taxa: { label: 'Taxa (% a.m.)', placeholder: 'ex: 2', help: 'Taxa simples em percentual.' },
  tempo: { label: 'Tempo (n)', placeholder: 'ex: 10', help: 'Períodos (ex: meses).' },
};

const targetExplanations = {
  montante: 'Calcular o valor futuro a partir de capital, taxa e tempo (ou juros).',
  capital: 'Calcular o capital inicial a partir de montante, taxa e tempo.',
  juros: 'Calcular o valor dos juros a partir de capital, taxa e tempo.',
  taxa: 'Calcular a taxa percentual a partir de capital, juros e tempo.',
  tempo: 'Calcular o tempo necessário a partir de capital, juros e taxa.',
};

// Fórmulas simples (juros simples)
const formulaMap = {
  montante: 'VF = VP (1 + i · n)',
  capital: 'VP = VF / (1 + i · n)',
  juros: 'J = VP · i · n',
  taxa: 'i = J / (VP · n)',
  tempo: 'n = J / (VP · i)',
};

export default function SimplesForm() {
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
    // Reset the target field to blank and keep others
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
      const res = await calcularSimplesController(values);
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

  const disabledFields = useMemo(() => ({ [values.target]: true }), [values.target]);

  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-6 shadow-lg shadow-black/30 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Capitalização Simples
        <span className="text-xs font-normal px-2 py-0.5 rounded bg-sky-600/30 text-sky-300 border border-sky-500/40">Beta</span>
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
              { value: 'montante', label: 'Montante (VF)' },
              { value: 'capital', label: 'Capital (VP)' },
              { value: 'juros', label: 'Juros (J)' },
              { value: 'taxa', label: 'Taxa (%)' },
              { value: 'tempo', label: 'Tempo (n)' },
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
              {(key === 'taxa' || key === 'tempo') ? (
                <div className="flex items-stretch gap-2">
                  <input
                    id={key}
                    name={key}
                    value={values[key]}
                    onChange={onChange}
                    placeholder={meta.placeholder}
                    disabled={disabledFields[key]}
                    className={`flex-1 rounded-lg border px-3 py-2 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-40 disabled:cursor-not-allowed border-slate-600`}
                  />
                  {key === 'taxa' && (
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
                  disabled={disabledFields[key]}
                  className={`rounded-lg border px-3 py-2 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-40 disabled:cursor-not-allowed border-slate-600`}
                />
              )}
              <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">{meta.help}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800/50 disabled:cursor-not-allowed px-5 py-2 text-sm font-medium shadow shadow-sky-900/50 transition-colors">
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
        <p className="mt-6 text-xs text-slate-500">Preencha os campos necessários e clique em Calcular. O campo escolhido fica desabilitado e será calculado.</p>
      )}
    </div>
  );
}
