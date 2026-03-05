package com.calculadora.backend.model

data class Amortizacao(
    val sistema: String? = null,       // SAC, SAF ou SAA
    val financiamento: Double? = null,  // VP — valor do empréstimo
    val taxa: Double? = null,           // i  — taxa por período (%)
    val tempo: Int? = null              // n  — número de períodos
)
