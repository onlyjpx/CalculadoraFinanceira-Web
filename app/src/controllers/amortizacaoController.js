import { calculateAmortizacao } from '../services/amortizacaoService';
import { convertPeriods } from '../utils/timeUnits';

function parseNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function calcularAmortizacaoController(formValues) {
  const financiamento = parseNumberOrNull(formValues.financiamento);
  const taxa = parseNumberOrNull(formValues.taxa);
  const taxaUnit = formValues.taxaUnit || 'mes';
  const tempoUnit = formValues.tempoUnit || 'mes';
  const tempoRaw = parseNumberOrNull(formValues.tempo);
  // Converter tempo para a unidade da taxa
  const tempoConverted = tempoRaw !== null ? convertPeriods(tempoRaw, tempoUnit, taxaUnit) : null;
  const tempo = tempoConverted !== null ? Math.round(tempoConverted) : null;

  if (!formValues.sistema) {
    const err = new Error('Selecione o sistema de amortização (SAC, SAF ou SAA).');
    err.code = 'VALIDATION';
    throw err;
  }

  if (financiamento === null || taxa === null || tempo === null) {
    const err = new Error('Preencha todos os campos: Financiamento, Taxa e Tempo.');
    err.code = 'VALIDATION';
    throw err;
  }

  const payload = {
    sistema: formValues.sistema,
    financiamento,
    taxa,
    tempo,
  };

  return calculateAmortizacao(payload);
}
