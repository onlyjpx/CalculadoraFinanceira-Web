import { calculateComposta } from '../services/compostaService';
import { convertPeriods } from '../utils/timeUnits';

export function parseNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function calcularCompostaController(formValues) {
  const payload = {
    target: formValues.target || null,
    capital: parseNumberOrNull(formValues.capital),
    montante: parseNumberOrNull(formValues.montante),
    juros: parseNumberOrNull(formValues.juros),
    taxa: parseNumberOrNull(formValues.taxa), // percentual
    tempo: parseNumberOrNull(formValues.tempo),
  };

  const taxaUnit = formValues.taxaUnit || 'mes';
  const tempoUnit = formValues.tempoUnit || 'mes';

  // Converter tempo para a unidade da taxa
  if (payload.tempo !== null) {
    payload.tempo = convertPeriods(payload.tempo, tempoUnit, taxaUnit);
  }

  const allowedTargets = ['montante', 'capital', 'juros', 'taxa', 'tempo'];
  if (formValues.target && allowedTargets.includes(formValues.target)) {
    payload[formValues.target] = null;
  }

  const nonNullCount = Object.values(payload).filter((v) => v !== null).length;
  if (nonNullCount < 3) {
    const err = new Error('Forneça pelo menos 3 campos para calcular.');
    err.code = 'VALIDATION';
    throw err;
  }

  return calculateComposta(payload);
}
