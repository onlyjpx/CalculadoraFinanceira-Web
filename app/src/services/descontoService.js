import { httpClient } from './httpClient';

// Backend endpoint /api/desconto-comercial/calculate
export async function calculateDescontoComercial(payload) {
  // payload may contain: nominal, valorPresente, desconto, taxaDesconto, tempo, taxaEfetiva
  return httpClient.post('/api/desconto-comercial/calculate', payload);
}
