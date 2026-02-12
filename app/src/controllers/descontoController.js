import { calculateDescontoComercial } from '../services/descontoService';
import { convertPeriods } from '../utils/timeUnits';

export function parseNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function calcularDescontoController(formValues) {
  // formValues: { target: 'taxaDesconto'|'taxaEfetiva', nominal, valorPresente, desconto, taxaDesconto, tempo }
  const payload = {
    nominal: parseNumberOrNull(formValues.nominal),
    valorPresente: parseNumberOrNull(formValues.valorPresente),
    desconto: parseNumberOrNull(formValues.desconto),
    taxaDesconto: parseNumberOrNull(formValues.taxaDesconto), // %
    tempo: parseNumberOrNull(formValues.tempo),
    taxaEfetiva: parseNumberOrNull(formValues.taxaEfetiva), // %
  };

  const taxaUnit = formValues.taxaUnit || 'mes';
  const tempoUnit = formValues.tempoUnit || 'mes';
  if (payload.tempo !== null) {
    payload.tempo = convertPeriods(payload.tempo, tempoUnit, taxaUnit);
  }

  const allowedTargets = ['taxaDesconto', 'taxaEfetiva'];
  if (formValues.target && allowedTargets.includes(formValues.target)) {
    payload[formValues.target] = null;
  }

  // Basic validation: need minimally N & n & (VP or D) for taxaDesconto, or d & n OR N & VP & n for taxaEfetiva
  const target = formValues.target;

  // Conjuntos de requisitos mínimos dependendo do alvo
  const has = (k) => payload[k] !== null;
  let valid = false;
  if (target === 'taxaEfetiva') {
    // (d & n) OU (N & VP & n)
    valid = (has('taxaDesconto') && has('tempo')) || (has('nominal') && has('valorPresente') && has('tempo'));
  } else if (target === 'taxaDesconto') {
    // (i_e & n) OU (N & VP & n) OU (N & desconto & n)
    valid = (has('taxaEfetiva') && has('tempo')) || (has('nominal') && has('valorPresente') && has('tempo')) || (has('nominal') && has('desconto') && has('tempo'));
  }

  if (!valid) {
    const err = new Error('Combinação insuficiente: para taxa efetiva use (taxaDesconto + tempo) ou (nominal + valorPresente + tempo). Para taxa de desconto use (taxaEfetiva + tempo), (nominal + valorPresente + tempo) ou (nominal + desconto + tempo).');
    err.code = 'VALIDATION';
    throw err;
  }

  return calculateDescontoComercial(payload);
}
