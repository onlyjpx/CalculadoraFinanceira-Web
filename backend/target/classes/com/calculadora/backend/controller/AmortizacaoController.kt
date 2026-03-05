package com.calculadora.backend.controller

import com.calculadora.backend.model.Amortizacao
import com.calculadora.backend.service.AmortizacaoService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/amortizacao")
class AmortizacaoController(private val service: AmortizacaoService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: Amortizacao): Map<String, Any> {
        return service.calcular(data)
    }
}
