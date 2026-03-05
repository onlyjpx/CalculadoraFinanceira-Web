import { httpClient } from './httpClient';

export async function calculateTaxasAbaixo(payload) {
  return httpClient.post('/api/taxas-abaixo/calculate', payload);
}
