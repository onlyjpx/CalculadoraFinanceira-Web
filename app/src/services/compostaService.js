import { httpClient } from './httpClient';

export async function calculateComposta(payload) {
  return httpClient.post('/api/composta/calculate', payload);
}
