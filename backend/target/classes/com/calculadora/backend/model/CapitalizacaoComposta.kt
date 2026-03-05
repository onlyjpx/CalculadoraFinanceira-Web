package com.calculadora.backend.model

data class CapitalizacaoComposta(
    val target: String? = null, // variável alvo (opcional)
    val capital: Double? = null, // VP
    val montante: Double? = null, // VF
    val juros: Double? = null, // J
    val taxa: Double? = null, // i (percentual)
    val tempo: Double? = null // n
)
