package com.calculadora.backend.service

import com.calculadora.backend.model.TaxasAbaixo
import org.springframework.stereotype.Service

@Service
class TaxasAbaixoService {
    fun calcular(data: TaxasAbaixo): Map<String, Double> {
        val ikNominal = data.taxaNominal
        val iProporcional = data.taxaProporcional
        val k = data.k

        return when {
            // i_proporcional = i_k / k
            iProporcional == null && ikNominal != null && k != null && k != 0 ->
                mapOf("taxaProporcional" to (ikNominal / k))

            // i_k = k * i_proporcional
            ikNominal == null && iProporcional != null && k != null ->
                mapOf("taxaNominal" to (iProporcional * k))

            else -> emptyMap()
        }
    }
}
