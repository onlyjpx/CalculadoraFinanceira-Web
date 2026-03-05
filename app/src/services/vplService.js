import { httpClient } from './httpClient';

export async function calculateVpl(payload) {
  return httpClient.post('/api/vpl/calculate', payload);
}
