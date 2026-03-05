package com.calculadora.backend.controller

import com.calculadora.backend.model.CapitalizacaoComposta
import com.calculadora.backend.service.CompostaService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/composta")
class CompostaController(private val service: CompostaService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: CapitalizacaoComposta): Map<String, Double> {
        return service.calcularComposta(data)
    }
}
