package com.calculadora.backend.model

data class CapitalizacaoSimples(
    val target: String? = null, // variável alvo (opcional)
    val capital: Double? = null, // variável VP
    val montante: Double? = null, // variável VF
    val juros: Double? = null, // juros (J)
    val taxa: Double? = null, // taxa (i)
    val tempo: Double? = null // tempo (n)
)
