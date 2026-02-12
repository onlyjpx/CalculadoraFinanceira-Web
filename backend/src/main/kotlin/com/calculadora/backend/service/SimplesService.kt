package com.calculadora.backend.service

import com.calculadora.backend.model.CapitalizacaoSimples
import org.springframework.stereotype.Service

@Service
class SimplesService { //service que vai fornecer a lógica de negócio, req e res no controller
    fun calcularSimples(data: CapitalizacaoSimples): Map<String, Double> {
        val vp = data.capital
        val vf = data.montante
        val j = data.juros
        val i = data.taxa?.div(100) //isso vai converter para decimal
        val n = data.tempo

        return when {
            // Achar Juros
            j == null && vp != null && i!= null && n != null ->
                mapOf("juros" to vp * i * n)

            // Achar o valor futuro
            vf == null && vp != null && i!= null && n != null ->
                mapOf("montante" to vp * (1 + i * n))

            // Achar o valor presente
            vp == null && vf != null && i!= null && n != null ->
                mapOf("montante" to vf / (1 + i * n))

            // Achar a taxa
            i == null && vp != null && j != null && n != null ->
                mapOf("taxa" to (j / (vp * n)) * 100)

            // Achar o tempo
            n == null && vp != null && j != null && i != null ->
                mapOf("tempo" to j / (vp * i))

            else -> emptyMap() // em caso de dados insuficientes
        }
    }
}