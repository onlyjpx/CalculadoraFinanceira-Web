package com.calculadora.backend.model

data class DescontoComercial(
    val nominal: Double? = null, // Valor nominal do título (N)
    val valorPresente: Double? = null, // Valor presente (VP)
    val desconto: Double? = null, // Desconto absoluto (D)
    val taxaDesconto: Double? = null, // Taxa de desconto comercial (d) em % por período
    val tempo: Double? = null, // Prazo (n)
    val taxaEfetiva: Double? = null // Taxa efetiva equivalente (i_e) em % por período
)
