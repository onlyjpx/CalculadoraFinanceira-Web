package com.calculadora.backend.service

import com.calculadora.backend.model.CapitalizacaoComposta
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import kotlin.math.ln
import kotlin.math.pow

@Service
class CompostaService {
    fun calcularComposta(data: CapitalizacaoComposta): Map<String, Double> {
        val target = data.target?.lowercase()
        val vp = data.capital
        val vf = data.montante
        val j = data.juros
        val i = data.taxa?.div(100) // % -> decimal
        val n = data.tempo

        // Se o frontend enviar o alvo, calcula exatamente a variável selecionada
        if (target != null) {
            return when (target) {
                "montante" -> when {
                    vp != null && i != null && n != null -> mapOf("montante" to (vp * (1 + i).pow(n)))
                    vp != null && j != null -> mapOf("montante" to (vp + j))
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Montante (VF), informe (Capital, Taxa e Tempo) ou (Capital e Juros)."
                    )
                }

                "capital" -> when {
                    vf != null && i != null && n != null -> mapOf("capital" to (vf / (1 + i).pow(n)))
                    vf != null && j != null -> mapOf("capital" to (vf - j))
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Capital (VP), informe (Montante, Taxa e Tempo) ou (Montante e Juros)."
                    )
                }

                "juros" -> when {
                    vf != null && vp != null -> mapOf("juros" to (vf - vp))
                    vp != null && i != null && n != null -> mapOf("juros" to (vp * ((1 + i).pow(n) - 1)))
                    vf != null && i != null && n != null -> {
                        val vpCalc = vf / (1 + i).pow(n)
                        mapOf("juros" to (vf - vpCalc))
                    }
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Juros (J), informe (Montante e Capital) ou (Capital, Taxa e Tempo) ou (Montante, Taxa e Tempo)."
                    )
                }

                "taxa" -> when {
                    vp != null && vf != null && n != null && vp > 0.0 && n != 0.0 -> {
                        val taxa = (vf / vp).pow(1.0 / n) - 1
                        mapOf("taxa" to (taxa * 100))
                    }
                    vp == null || vf == null || n == null -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Taxa (i), informe (Capital, Montante e Tempo)."
                    )
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Taxa (i), Capital deve ser > 0 e Tempo deve ser diferente de zero."
                    )
                }

                "tempo" -> when {
                    vp != null && vf != null && i != null && vp > 0.0 && vf > 0.0 && (1 + i) > 0.0 && ln(1 + i) != 0.0 -> {
                        val tempo = ln(vf / vp) / ln(1 + i)
                        mapOf("tempo" to tempo)
                    }
                    vp == null || vf == null || i == null -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Tempo (n), informe (Capital, Montante e Taxa)."
                    )
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Tempo (n), Capital e Montante devem ser > 0 e Taxa deve ser válida (ln(1+i) ≠ 0)."
                    )
                }

                else -> throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Alvo inválido. Use: montante, capital, juros, taxa ou tempo."
                )
            }
        }

        return when {
            // Montante: VF = VP * (1+i)^n
            vf == null && vp != null && i != null && n != null ->
                mapOf("montante" to (vp * (1 + i).pow(n)))

            // Montante usando J: VF = VP + J
            vf == null && vp != null && j != null ->
                mapOf("montante" to (vp + j))

            // Capital: VP = VF / (1+i)^n
            vp == null && vf != null && i != null && n != null ->
                mapOf("capital" to (vf / (1 + i).pow(n)))

            // Capital usando J: VP = VF - J
            vp == null && vf != null && j != null ->
                mapOf("capital" to (vf - j))

            // Taxa: i = (VF/VP)^(1/n) - 1
            i == null && vp != null && vf != null && n != null && vp > 0.0 && n != 0.0 -> {
                val taxa = (vf / vp).pow(1.0 / n) - 1
                mapOf("taxa" to (taxa * 100))
            }

            // Tempo: n = ln(VF/VP) / ln(1+i)
            n == null && vp != null && vf != null && i != null && vp > 0.0 && vf > 0.0 && (1 + i) > 0.0 && ln(1 + i) != 0.0 -> {
                val tempo = ln(vf / vp) / ln(1 + i)
                mapOf("tempo" to tempo)
            }

            // Juros via VF - VP
            j == null && vp != null && vf != null ->
                mapOf("juros" to (vf - vp))

            // Juros: J = VP * ((1+i)^n - 1)
            j == null && vp != null && i != null && n != null ->
                mapOf("juros" to (vp * ((1 + i).pow(n) - 1)))

            else -> emptyMap()
        }
    }
}
