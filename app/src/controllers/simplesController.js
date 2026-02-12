import { calculateSimples } from '../services/simplesService';
import { convertPeriods } from '../utils/timeUnits';

// Simple controller to validate/normalize inputs before calling services
export function parseNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function calcularSimplesController(formValues) {
  // formValues: { target?: 'montante'|'capital'|'juros'|'taxa'|'tempo', capital, montante, juros, taxa, tempo }
  const payload = {
    capital: parseNumberOrNull(formValues.capital),
    montante: parseNumberOrNull(formValues.montante),
    juros: parseNumberOrNull(formValues.juros),
    taxa: parseNumberOrNull(formValues.taxa), // Backend expects percent; keep as provided
    tempo: parseNumberOrNull(formValues.tempo),
  };

  const taxaUnit = formValues.taxaUnit || 'mes';
  const tempoUnit = formValues.tempoUnit || 'mes';

  // Converter tempo para a unidade da taxa
  if (payload.tempo !== null) {
    payload.tempo = convertPeriods(payload.tempo, tempoUnit, taxaUnit);
  }

  // If target is provided, ensure that field is null so backend calculates it
  const allowedTargets = ['montante', 'capital', 'juros', 'taxa', 'tempo'];
  if (formValues.target && allowedTargets.includes(formValues.target)) {
    payload[formValues.target] = null;
  }

  // Ensure at least two non-null values + one target missing is a likely valid request
  const nonNullCount = Object.values(payload).filter((v) => v !== null).length;
  if (nonNullCount < 3) {
    const err = new Error('Forneça pelo menos 3 campos para calcular.');
    err.code = 'VALIDATION';
    throw err;
  }

  return calculateSimples(payload);
}
