package com.calculadora.backend.service

import com.calculadora.backend.model.CapitalizacaoSimples
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class SimplesService { //service que vai fornecer a lógica de negócio, req e res no controller
    fun calcularSimples(data: CapitalizacaoSimples): Map<String, Double> {
        val target = data.target?.lowercase()
        val vp = data.capital
        val vf = data.montante
        val j = data.juros
        val i = data.taxa?.div(100) //isso vai converter para decimal
        val n = data.tempo

        // Se o frontend enviar o alvo, calcula exatamente a variável selecionada
        if (target != null) {
            return when (target) {
                "montante" -> when {
                    vp != null && i != null && n != null -> mapOf("montante" to vp * (1 + i * n))
                    vp != null && j != null -> mapOf("montante" to (vp + j))
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Montante (VF), informe (Capital, Taxa e Tempo) ou (Capital e Juros)."
                    )
                }

                "capital" -> when {
                    vf != null && i != null && n != null -> mapOf("capital" to vf / (1 + i * n))
                    vf != null && j != null -> mapOf("capital" to (vf - j))
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Capital (VP), informe (Montante, Taxa e Tempo) ou (Montante e Juros)."
                    )
                }

                "juros" -> when {
                    vf != null && vp != null -> mapOf("juros" to (vf - vp))
                    vp != null && i != null && n != null -> mapOf("juros" to vp * i * n)
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Juros (J), informe (Montante e Capital) ou (Capital, Taxa e Tempo)."
                    )
                }

                "taxa" -> when {
                    vp != null && j != null && n != null && vp != 0.0 && n != 0.0 -> mapOf("taxa" to (j / (vp * n)) * 100)
                    vp == null || j == null || n == null -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Taxa (i), informe (Capital, Juros e Tempo)."
                    )
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Taxa (i), Capital e Tempo devem ser diferentes de zero."
                    )
                }

                "tempo" -> when {
                    vp != null && j != null && i != null && vp != 0.0 && i != 0.0 -> mapOf("tempo" to j / (vp * i))
                    vp == null || j == null || i == null -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Tempo (n), informe (Capital, Juros e Taxa)."
                    )
                    else -> throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para calcular Tempo (n), Capital e Taxa devem ser diferentes de zero."
                    )
                }

                else -> throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Alvo inválido. Use: montante, capital, juros, taxa ou tempo."
                )
            }
        }

        return when {
            // Achar o valor futuro (prioridade quando VF está ausente)
            vf == null && vp != null && i != null && n != null ->
                mapOf("montante" to vp * (1 + i * n))

            // Achar o valor futuro usando J (VF = VP + J)
            vf == null && vp != null && j != null ->
                mapOf("montante" to (vp + j))

            // Achar o valor presente (VP)
            vp == null && vf != null && i != null && n != null ->
                mapOf("capital" to vf / (1 + i * n))

            // Achar o valor presente usando J (VP = VF - J)
            vp == null && vf != null && j != null ->
                mapOf("capital" to (vf - j))

            // Achar Juros
            j == null && vp != null && i != null && n != null ->
                mapOf("juros" to vp * i * n)

            // Achar a taxa
            i == null && vp != null && j != null && n != null && vp != 0.0 && n != 0.0 ->
                mapOf("taxa" to (j / (vp * n)) * 100)

            // Achar o tempo
            n == null && vp != null && j != null && i != null && vp != 0.0 && i != 0.0 ->
                mapOf("tempo" to j / (vp * i))

            else -> emptyMap() // em caso de dados insuficientes
        }
    }
}