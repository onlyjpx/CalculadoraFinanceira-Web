package com.calculadora.backend.model

data class TaxaEquivalente(
    val taxaInformada: Double? = null, // taxa efetiva informada (em %)
    val periodoInformado: String? = null, // período da taxa informada (mensal, anual, semestral)
    val periodoSolicitado: String? = null, // período da taxa equivalente solicitada
    val n: Double? = null // número de períodos (opcional)
)
