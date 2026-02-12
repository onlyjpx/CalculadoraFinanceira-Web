package com.calculadora.backend.controller

import com.calculadora.backend.model.DescontoComercial
import com.calculadora.backend.service.DescontoComercialService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/desconto-comercial")
class
DescontoComercialController(private val service: DescontoComercialService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: DescontoComercial): Map<String, Double> {
        return service.calcular(data)
    }
}
