package com.calculadora.backend.controller

import com.calculadora.backend.model.TaxaEquivalente
import com.calculadora.backend.service.TaxaEquivalenteService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/taxa-equivalente")
class TaxaEquivalenteController(private val service: TaxaEquivalenteService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: TaxaEquivalente): Map<String, Any> {
        return service.calcularTaxaEquivalente(data)
    }
}
