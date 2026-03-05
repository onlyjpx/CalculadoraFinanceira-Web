package com.calculadora.backend.controller

import com.calculadora.backend.model.TaxasAbaixo
import com.calculadora.backend.service.TaxasAbaixoService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/taxas-abaixo")
class TaxasAbaixoController(private val service: TaxasAbaixoService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: TaxasAbaixo): Map<String, Double> {
        return service.calcular(data)
    }
}
