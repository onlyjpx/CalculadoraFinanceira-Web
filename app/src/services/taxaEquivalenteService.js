import httpClient from './httpClient';

export const calcularTaxaEquivalenteService = async (payload) => {
  return httpClient.post('/api/taxa-equivalente/calculate', payload);
};
