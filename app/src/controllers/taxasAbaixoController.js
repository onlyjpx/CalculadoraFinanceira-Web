import { calculateTaxasAbaixo } from '../services/taxasAbaixoService';

export function parseNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export async function calcularTaxasAbaixoController(formValues) {
  const payload = {
    taxaNominal: parseNumberOrNull(formValues.taxaNominal),
    taxaProporcional: parseNumberOrNull(formValues.taxaProporcional),
    k: formValues.k === '' || formValues.k == null ? null : parseInt(String(formValues.k), 10),
  };

  const allowedTargets = ['taxaNominal', 'taxaProporcional'];
  if (formValues.target && allowedTargets.includes(formValues.target)) {
    payload[formValues.target] = null;
  }

  // validação mínima: precisa k e uma das taxas
  if (!payload.k || (payload.taxaNominal == null && payload.taxaProporcional == null)) {
    const err = new Error('Informe k e uma das taxas (nominal ou proporcional).');
    err.code = 'VALIDATION';
    throw err;
  }

  const res = await calculateTaxasAbaixo(payload);
  return res;
}
