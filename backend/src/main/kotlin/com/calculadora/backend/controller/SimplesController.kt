package com.calculadora.backend.controller

import com.calculadora.backend.model.CapitalizacaoSimples
import com.calculadora.backend.service.SimplesService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/simples")
class SimplesController(private val service: SimplesService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: CapitalizacaoSimples): Map<String, Double> {
        return service.calcularSimples(data)
    }
}
