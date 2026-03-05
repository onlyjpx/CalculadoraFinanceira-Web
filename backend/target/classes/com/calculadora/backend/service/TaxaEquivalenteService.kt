package com.calculadora.backend.service

import com.calculadora.backend.model.TaxaEquivalente
import org.springframework.stereotype.Service
import kotlin.math.pow
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class TaxaEquivalenteService {

    // Quantidade de períodos por ano
    private val periodMap = mapOf(
        "anual" to 1.0,
        "semestral" to 2.0,
        "trimestral" to 4.0,
        "bimestral" to 6.0,
        "mensal" to 12.0,
        "diario" to 360.0 // Convenção financeira 30/360
    )

    fun calcularTaxaEquivalente(data: TaxaEquivalente): Map<String, Any> {

        val taxaPercentual = data.taxaInformada
            ?: return mapOf("error" to "Taxa informada é obrigatória")

        val periodoInformado = data.periodoInformado?.lowercase()
            ?: return mapOf("error" to "Período informado é obrigatório")

        val periodoSolicitado = data.periodoSolicitado?.lowercase()
            ?: return mapOf("error" to "Período solicitado é obrigatório")

        if (periodoInformado !in periodMap) {
            return mapOf("error" to "Período informado inválido. Use: anual, semestral, trimestral, bimestral, mensal ou diario")
        }

        if (periodoSolicitado !in periodMap) {
            return mapOf("error" to "Período solicitado inválido. Use: anual, semestral, trimestral, bimestral, mensal ou diario")
        }

        // Converter percentual para decimal
        val taxaDecimal = taxaPercentual / 100.0

        val nInformado = periodMap.getValue(periodoInformado)
        val nSolicitado = periodMap.getValue(periodoSolicitado)

        /*
         Fórmula correta:
         i_eq = (1 + i)^(nInformado / nSolicitado) - 1

         Porque:
         periodMap representa períodos por ano.
        */
        val expoente = nInformado / nSolicitado
        val taxaEquivalenteDecimal = (1 + taxaDecimal).pow(expoente) - 1

        val taxaEquivalentePercentual = arredondar(taxaEquivalenteDecimal * 100, 6)

        return mapOf(
            "taxaEquivalente" to taxaEquivalentePercentual,
            "taxaInformadaDecimal" to arredondar(taxaDecimal, 10),
            "taxaEquivalenteDecimal" to arredondar(taxaEquivalenteDecimal, 10),
            "periodoInformado" to periodoInformado,
            "periodoSolicitado" to periodoSolicitado,
            "conversao" to "Taxa de ${arredondar(taxaPercentual,4)}% ao $periodoInformado = $taxaEquivalentePercentual% ao $periodoSolicitado"
        )
    }

    private fun arredondar(valor: Double, casas: Int): Double {
        return BigDecimal(valor)
            .setScale(casas, RoundingMode.HALF_UP)
            .toDouble()
    }
}
