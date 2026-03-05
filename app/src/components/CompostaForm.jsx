import { useMemo, useState } from 'react';
import FormulaTooltip from './ui/FormulaTooltip';
import Select from './ui/Select';
import UnitSelect from './ui/UnitSelect';
import ResultDisplay from './ui/ResultDisplay';
import { RATE_UNIT_OPTIONS, TIME_UNIT_OPTIONS } from '../utils/timeUnits';
import { calcularCompostaController } from '../controllers/compostaController';
import { calcularTaxasAbaixoController } from '../controllers/taxasAbaixoController';

const initial = {
  target: 'montante',
  capital: '',
  montante: '',
  juros: '',
  taxa: '',
  tempo: '',
  taxaUnit: 'mes',
  tempoUnit: 'mes',
};

const fieldMeta = {
  capital: { label: 'Capital (VP)', placeholder: 'ex: 1000', help: 'Valor presente.' },
  montante: { label: 'Montante (VF)', placeholder: 'ex: 1500', help: 'Valor futuro.' },
  juros: { label: 'Juros (J)', placeholder: 'ex: 500', help: 'J = VF - VP.' },
  taxa: { label: 'Taxa (%)', placeholder: 'ex: 2', help: 'Taxa efetiva por período (em %).' },
  tempo: { label: 'Tempo (n)', placeholder: 'ex: 12', help: 'Número de períodos.' },
};

const targetExplanations = {
  montante: 'Calcular o valor futuro (VF) em capitalização composta.',
  capital: 'Calcular o valor presente (VP) em capitalização composta.',
  juros: 'Calcular juros (J) em capitalização composta.',
  taxa: 'Calcular a taxa efetiva (i) em capitalização composta.',
  tempo: 'Calcular o tempo (n) em capitalização composta.',
};

const formulaMap = {
  montante: 'VF = VP · (1 + i)^n',
  capital: 'VP = VF / (1 + i)^n',
  juros: 'J = VF - VP | J = VP · ((1 + i)^n - 1)',
  taxa: 'i = (VF/VP)^(1/n) - 1',
  tempo: 'n = ln(VF/VP) / ln(1 + i)',
};

const taxasAbaixoInitial = {
  target: 'taxaProporcional',
  taxaNominal: '',
  taxaProporcional: '',
  k: '',
};

export default function CompostaForm() {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [taxasAbaixo, setTaxasAbaixo] = useState(taxasAbaixoInitial);
  const [taxasAbaixoLoading, setTaxasAbaixoLoading] = useState(false);
  const [taxasAbaixoResult, setTaxasAbaixoResult] = useState(null);
  const [taxasAbaixoError, setTaxasAbaixoError] = useState('');

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
      const res = await calcularCompostaController(values);
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

  const onTaxasAbaixoChange = (e) => {
    const { name, value } = e.target;
    setTaxasAbaixo((v) => ({ ...v, [name]: value }));
  };

  const onTaxasAbaixoTargetChange = (e) => {
    const target = e.target.value;
    setTaxasAbaixo((v) => ({ ...v, target, [target]: '' }));
    setTaxasAbaixoResult(null);
    setTaxasAbaixoError('');
  };

  const onTaxasAbaixoSubmit = async (e) => {
    e.preventDefault();
    setTaxasAbaixoLoading(true);
    setTaxasAbaixoError('');
    setTaxasAbaixoResult(null);
    try {
      const res = await calcularTaxasAbaixoController(taxasAbaixo);
      setTaxasAbaixoResult(res);
    } catch (err) {
      setTaxasAbaixoError(err?.payload?.message || err?.message || 'Erro ao calcular');
    } finally {
      setTaxasAbaixoLoading(false);
    }
  };

  const onTaxasAbaixoReset = () => {
    setTaxasAbaixo(taxasAbaixoInitial);
    setTaxasAbaixoResult(null);
    setTaxasAbaixoError('');
  };

  const taxasAbaixoDisabled = useMemo(() => ({ [taxasAbaixo.target]: true }), [taxasAbaixo.target]);

  return (
    <div className="space-y-6">
      {/* ===== Capitalização Composta ===== */}
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

      {/* ===== Taxas Abaixo (Capitalização) ===== */}
      <div className="pt-5 border-t border-slate-700/30">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Taxas Abaixo</h3>
          <span className="text-[9px] font-normal px-1.5 py-0.5 rounded bg-teal-600/20 text-teal-400 border border-teal-500/30">Nominal ↔ Proporcional</span>
        </div>

        <ResultDisplay result={taxasAbaixoResult} error={taxasAbaixoError} hint="Informe k e a taxa conhecida." mainKey={taxasAbaixo.target} />

        <form onSubmit={onTaxasAbaixoSubmit} onReset={onTaxasAbaixoReset} className="mt-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">O que calcular?</label>
              <FormulaTooltip formula="i_proporcional = i_k / k | i_k = k · i_proporcional" />
            </div>
            <Select
              value={taxasAbaixo.target}
              onChange={onTaxasAbaixoTargetChange}
              options={[
                { value: 'taxaProporcional', label: 'i proporcional (efetiva)' },
                { value: 'taxaNominal', label: 'i_k nominal' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="taxaNominal">i_k nominal (%)</label>
              <input
                id="taxaNominal"
                name="taxaNominal"
                type="number"
                step="any"
                value={taxasAbaixo.taxaNominal}
                onChange={onTaxasAbaixoChange}
                placeholder="ex: 12"
                disabled={taxasAbaixoDisabled.taxaNominal}
                className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="taxaProporcional">i proporcional (%)</label>
              <input
                id="taxaProporcional"
                name="taxaProporcional"
                type="number"
                step="any"
                value={taxasAbaixo.taxaProporcional}
                onChange={onTaxasAbaixoChange}
                placeholder="ex: 1"
                disabled={taxasAbaixoDisabled.taxaProporcional}
                className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-[11px] font-medium text-slate-400 mb-1" htmlFor="k">k (periodicidade)</label>
              <input
                id="k"
                name="k"
                type="number"
                step="any"
                value={taxasAbaixo.k}
                onChange={onTaxasAbaixoChange}
                placeholder="ex: 12"
                className="calc-input rounded-lg border border-slate-700/50 px-3 py-2.5 bg-[#0c0c14] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={taxasAbaixoLoading} className="calc-btn calc-btn-primary flex-1 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider text-white cursor-pointer inline-flex items-center justify-center gap-2">
              {taxasAbaixoLoading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
              {taxasAbaixoLoading ? 'Calculando...' : '= Calcular'}
            </button>
            <button type="reset" disabled={taxasAbaixoLoading} className="calc-btn rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-700/40 px-5 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 cursor-pointer disabled:opacity-40">
              C
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
