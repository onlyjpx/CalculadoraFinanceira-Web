import { calcularTaxaEquivalenteService } from '../services/taxaEquivalenteService';

export const calcularTaxaEquivalenteController = async (formData) => {
  try {
    const payload = {
      taxaInformada: parseFloat(formData.taxaInformada) || null,
      periodoInformado: formData.periodoInformado || null,
      periodoSolicitado: formData.periodoSolicitado || null,
      n: formData.n ? parseFloat(formData.n) : null
    };

    const result = await calcularTaxaEquivalenteService(payload);
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Erro no controller:', error);
    throw error;
  }
};
