package com.calculadora.backend.service

import com.calculadora.backend.model.Vpl
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import kotlin.math.pow

@Service
class VplService {

    /**
     * VPL = −I₀ + Σ FCₜ / (1+i)^t  +  VR / (1+i)^nᵥᵣ
     */
    fun calcular(data: Vpl): Map<String, Any> {
        val investimento = data.investimento
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o investimento inicial.")
        val i = (data.taxa
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a taxa.")) / 100.0
        val fluxos = data.fluxosDeCaixa
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe os fluxos de caixa.")

        if (fluxos.isEmpty())
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe pelo menos um fluxo de caixa.")

        val vr = data.valorResidual ?: 0.0
        val periodoVR = data.periodoResidual ?: fluxos.size

        // Desconto de cada fluxo de caixa
        var somaFluxos = 0.0
        val fluxosDescontados = mutableListOf<Double>()
        for ((index, fc) in fluxos.withIndex()) {
            val t = index + 1
            val fcDesc = fc / (1.0 + i).pow(t)
            somaFluxos += fcDesc
            fluxosDescontados.add(fcDesc)
        }

        // Valor residual descontado
        val vrDescontado = if (vr != 0.0) vr / (1.0 + i).pow(periodoVR) else 0.0

        // VPL final
        val vpl = -investimento + somaFluxos + vrDescontado

        return mapOf(
            "vpl" to vpl,
            "investimento" to investimento,
            "somaFluxosDescontados" to somaFluxos,
            "valorResidualDescontado" to vrDescontado
        )
    }
}
