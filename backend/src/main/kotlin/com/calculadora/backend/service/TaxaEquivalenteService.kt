package com.calculadora.backend.service

import com.calculadora.backend.model.TaxaEquivalente
import org.springframework.stereotype.Service
import kotlin.math.pow

@Service
class TaxaEquivalenteService {
    
    // Mapeamento de período para número de períodos no ano
    private val periodMap = mapOf(
        "anual" to 1.0,
        "semestral" to 2.0,
        "trimestral" to 4.0,
        "bimestral" to 6.0,
        "mensal" to 12.0,
        "diario" to 360.0 // convenção de 360 dias
    )
    
    fun calcularTaxaEquivalente(data: TaxaEquivalente): Map<String, Any> {
        val taxaInformada = data.taxaInformada?.div(100) ?: return mapOf("error" to "Taxa informada é obrigatória")
        val periodoInformado = data.periodoInformado?.lowercase() ?: return mapOf("error" to "Período informado é obrigatório")
        val periodoSolicitado = data.periodoSolicitado?.lowercase() ?: return mapOf("error" to "Período solicitado é obrigatório")
        
        // Validar se os períodos existem
        if (periodoInformado !in periodMap) {
            return mapOf("error" to "Período informado inválido. Use: anual, semestral, trimestral, bimestral, mensal ou diario")
        }
        if (periodoSolicitado !in periodMap) {
            return mapOf("error" to "Período solicitado inválido. Use: anual, semestral, trimestral, bimestral, mensal ou diario")
        }
        
        // Obter número de períodos por ano
        val nInformado = periodMap[periodoInformado]!!
        val nSolicitado = periodMap[periodoSolicitado]!!
        
        // Calcular taxa equivalente usando a fórmula:
        // i_equivalente = (1 + i_original)^(n_solicitado/n_informado) - 1
        val expoente = nSolicitado / nInformado
        val taxaEquivalente = (1 + taxaInformada).pow(expoente) - 1
        
        // Converter de volta para percentual
        val taxaEquivalentePercentual = taxaEquivalente * 100
        
        return mapOf(
            "taxaEquivalente" to taxaEquivalentePercentual,
            "taxaInformadaDecimal" to taxaInformada,
            "taxaEquivalenteDecimal" to taxaEquivalente,
            "periodoInformado" to periodoInformado,
            "periodoSolicitado" to periodoSolicitado,
            "conversao" to "Taxa de ${"%.4f".format(data.taxaInformada)}% ao $periodoInformado = ${"%.4f".format(taxaEquivalentePercentual)}% ao $periodoSolicitado"
        )
    }
}
