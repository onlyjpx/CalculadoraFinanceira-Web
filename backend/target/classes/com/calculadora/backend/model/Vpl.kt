package com.calculadora.backend.model

data class Vpl(
    val investimento: Double? = null,            // I₀ — desembolso inicial
    val taxa: Double? = null,                    // i  — taxa de desconto por período (%)
    val fluxosDeCaixa: List<Double>? = null,     // FC₁, FC₂, ..., FCₙ
    val valorResidual: Double? = null,           // VR — valor residual (opcional)
    val periodoResidual: Int? = null             // período do valor residual (opcional, default = n)
)
