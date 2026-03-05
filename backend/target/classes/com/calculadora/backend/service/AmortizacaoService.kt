package com.calculadora.backend.service

import com.calculadora.backend.model.Amortizacao
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import kotlin.math.pow

@Service
class AmortizacaoService {

    data class PeriodoAmortizacao(
        val periodo: Int,
        val pmt: Double,
        val juros: Double,
        val amortizacao: Double,
        val saldoDevedor: Double
    )

    fun calcular(data: Amortizacao): Map<String, Any> {
        val sistema = data.sistema?.uppercase()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o sistema (SAC, SAF ou SAA).")
        val vp = data.financiamento
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o valor do financiamento (VP).")
        val i = (data.taxa
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a taxa (i).")) / 100.0
        val n = data.tempo
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o tempo (n).")

        if (n <= 0) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O tempo deve ser maior que zero.")
        if (vp <= 0) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O financiamento deve ser maior que zero.")
        if (i < 0) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "A taxa não pode ser negativa.")

        val periodos = when (sistema) {
            "SAC" -> calcularSAC(vp, i, n)
            "SAF", "PRICE" -> calcularSAF(vp, i, n)
            "SAA" -> calcularSAA(vp, i, n)
            else -> throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Sistema inválido. Use: SAC, SAF ou SAA."
            )
        }

        val totalPmt = periodos.sumOf { it.pmt }
        val totalJuros = periodos.sumOf { it.juros }
        val totalAmortizacao = periodos.sumOf { it.amortizacao }

        return mapOf(
            "sistema" to sistema,
            "periodos" to periodos,
            "totalPmt" to totalPmt,
            "totalJuros" to totalJuros,
            "totalAmortizacao" to totalAmortizacao
        )
    }

    /**
     * SAC — Sistema de Amortização Constante
     * Amortização fixa; juros e PMT decrescentes.
     */
    private fun calcularSAC(vp: Double, i: Double, n: Int): List<PeriodoAmortizacao> {
        val amortConstante = vp / n
        var saldo = vp
        return (1..n).map { t ->
            val juros = saldo * i
            val pmt = amortConstante + juros
            saldo -= amortConstante
            PeriodoAmortizacao(t, pmt, juros, amortConstante, maxOf(saldo, 0.0))
        }
    }

    /**
     * SAF — Sistema de Amortização Francês (Price)
     * PMT fixo; juros decrescentes, amortização crescente.
     */
    private fun calcularSAF(vp: Double, i: Double, n: Int): List<PeriodoAmortizacao> {
        val fator = (1.0 + i).pow(n)
        val pmt = vp * (i * fator) / (fator - 1.0)
        var saldo = vp
        return (1..n).map { t ->
            val juros = saldo * i
            val amort = pmt - juros
            saldo -= amort
            PeriodoAmortizacao(t, pmt, juros, amort, maxOf(saldo, 0.0))
        }
    }

    /**
     * SAA — Sistema de Amortização Americano
     * Paga apenas juros durante o prazo; principal devolvido integralmente no final.
     */
    private fun calcularSAA(vp: Double, i: Double, n: Int): List<PeriodoAmortizacao> {
        return (1..n).map { t ->
            val juros = vp * i
            val amort = if (t == n) vp else 0.0
            val pmt = juros + amort
            val saldo = if (t == n) 0.0 else vp
            PeriodoAmortizacao(t, pmt, juros, amort, saldo)
        }
    }
}
