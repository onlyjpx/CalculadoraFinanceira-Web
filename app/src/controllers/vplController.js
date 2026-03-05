import { calculateVpl } from '../services/vplService';
import { convertPeriods } from '../utils/timeUnits';

function parseNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function calcularVplController(formValues) {
  const investimento = parseNumberOrNull(formValues.investimento);
  const taxaUnit = formValues.taxaUnit || 'mes';
  const tempoUnit = formValues.tempoUnit || 'mes';

  // Converter a taxa para a unidade do tempo (cada FC já está por período do tempo)
  // Usamos convertPeriods para achar quantos "tempoUnit" cabem em 1 "taxaUnit"
  // e recalcular: i_tempo = (1+i_taxa)^(1/k) - 1 via proporcionalidade simples
  // Para simplificar, convertemos o nº de períodos para a unidade da taxa.
  const taxa = parseNumberOrNull(formValues.taxa);

  const fluxosDeCaixa = (formValues.fluxosDeCaixa || [])
    .map((v) => parseNumberOrNull(v))
    .filter((v) => v !== null);

  const valorResidual = parseNumberOrNull(formValues.valorResidual);
  const periodoResidualRaw = parseNumberOrNull(formValues.periodoResidual);
  const periodoResidual = periodoResidualRaw !== null ? Math.round(periodoResidualRaw) : null;

  if (investimento === null) {
    const err = new Error('Informe o investimento inicial.');
    err.code = 'VALIDATION';
    throw err;
  }

  if (taxa === null) {
    const err = new Error('Informe a taxa.');
    err.code = 'VALIDATION';
    throw err;
  }

  if (fluxosDeCaixa.length === 0) {
    const err = new Error('Informe pelo menos um fluxo de caixa.');
    err.code = 'VALIDATION';
    throw err;
  }

  const payload = {
    investimento,
    taxa,
    fluxosDeCaixa,
    valorResidual,
    periodoResidual,
  };

  return calculateVpl(payload);
}
