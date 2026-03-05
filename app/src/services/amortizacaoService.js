import { httpClient } from './httpClient';

export async function calculateAmortizacao(payload) {
  return httpClient.post('/api/amortizacao/calculate', payload);
}
