package com.calculadora.backend.controller

import com.calculadora.backend.model.Vpl
import com.calculadora.backend.service.VplService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/vpl")
class VplController(private val service: VplService) {

    @PostMapping("/calculate")
    fun calculate(@RequestBody data: Vpl): Map<String, Any> {
        return service.calcular(data)
    }
}
