package com.calculadora.backend.model

data class TaxasAbaixo(
    val taxaNominal: Double? = null, // i_k nominal (percentual)
    val taxaProporcional: Double? = null, // i proporcional/efetiva por período (percentual)
    val k: Int? = null // número de conversões/periodicidade
)
