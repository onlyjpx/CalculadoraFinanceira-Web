import { httpClient } from './httpClient';

// Mirror backend endpoint /api/simples/calculate
export async function calculateSimples(payload) {
  // Backend expects fields possibly null: capital, montante, juros, taxa, tempo
  return httpClient.post('/api/simples/calculate', payload);
}
