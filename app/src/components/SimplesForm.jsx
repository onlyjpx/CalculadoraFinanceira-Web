import { useState, useMemo } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
import ResultDisplay from './ui/ResultDisplay';
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
    <div>
      {/* Calculator Screen */}
      <ResultDisplay result={result} error={error} hint="Preencha os campos e clique em Calcular." mainKey={values.target} />

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
              { value: 'montante', label: 'Montante (VF)' },
              { value: 'capital', label: 'Capital (VP)' },
              { value: 'juros', label: 'Juros (J)' },
              { value: 'taxa', label: 'Taxa (%)' },
              { value: 'tempo', label: 'Tempo (n)' },
            ]}
          />
          <p className="mt-1.5 text-[10px] text-slate-500">{targetExplanations[values.target]}</p>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(fieldMeta).map(([key, meta]) => (
            <div key={key} className="flex flex-col">
              <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor={key}>{meta.label}</label>
              {(key === 'taxa' || key === 'tempo') ? (
                <div className="flex items-stretch gap-1.5 min-w-0">
                  <input
                    id={key}
                    name={key}
                    type="number"
                    step="any"
                    value={values[key]}
                    onChange={onChange}
                    placeholder={meta.placeholder}
                    disabled={disabledFields[key]}
                    className="calc-input flex-1 min-w-0 rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
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
                  type="number"
                  step="any"
                  value={values[key]}
                  onChange={onChange}
                  placeholder={meta.placeholder}
                  disabled={disabledFields[key]}
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
