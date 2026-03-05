package com.calculadora.backend.service

import com.calculadora.backend.model.DescontoComercial
import org.springframework.stereotype.Service

@Service
class DescontoComercialService {
    // Calcula taxa de desconto comercial (d) ou taxa efetiva (i_e) conforme campos nulos
    fun calcular(data: DescontoComercial): Map<String, Double> {
        val N = data.nominal
        val VP = data.valorPresente
        val D = data.desconto
        val dPercent = data.taxaDesconto
        val n = data.tempo
        val iePercent = data.taxaEfetiva

        // converter percentuais para decimal quando necessário
        val d = dPercent?.div(100)

        return when {
            // Calcular taxa de desconto comercial (d) com base em N, D e n
            dPercent == null && iePercent == null && N != null && D != null && n != null && n != 0.0 ->
                mapOf("taxaDesconto" to (D / (N * n) * 100))

            // Calcular taxa de desconto comercial (d) com base em N, VP e n: VP = N(1 - d n)
            dPercent == null && iePercent == null && N != null && VP != null && n != null && n != 0.0 ->
                mapOf("taxaDesconto" to (((1 - (VP / N)) / n) * 100))

            // Calcular taxa efetiva equivalente i_e a partir de d e n: i_e = d / (1 - d n)
            iePercent == null && d != null && n != null && (1 - d * n) != 0.0 ->
                mapOf("taxaEfetiva" to (d / (1 - d * n) * 100))

            // Calcular taxa efetiva equivalente i_e a partir de N, VP e n: VP = N/(1 + i n)
            iePercent == null && dPercent == null && N != null && VP != null && n != null && n != 0.0 ->
                mapOf("taxaEfetiva" to ((((N / VP) - 1) / n) * 100))

            // Calcular taxa de desconto (d) a partir de i_e e n: d = i_e / (1 + i_e n)
            dPercent == null && iePercent != null && n != null && (1 + (iePercent/100) * n) != 0.0 -> {
                val ieDec = iePercent / 100
                mapOf("taxaDesconto" to (ieDec / (1 + ieDec * n) * 100))
            }

            // Caso seja possível calcular ambas simultaneamente (d e i_e) com N, VP e n
            dPercent == null && iePercent == null && N != null && VP != null && n != null && n != 0.0 -> {
                val dCalc = ((1 - (VP / N)) / n) * 100
                val dDec = dCalc / 100
                val ieCalc = if ((1 - dDec * n) != 0.0) dDec / (1 - dDec * n) * 100 else null
                if (ieCalc != null) mapOf("taxaDesconto" to dCalc, "taxaEfetiva" to ieCalc) else mapOf("taxaDesconto" to dCalc)
            }

            else -> emptyMap()
        }
    }
}
