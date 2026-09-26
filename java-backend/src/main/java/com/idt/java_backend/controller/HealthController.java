package com.idt.java_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public String health() {   //this basically checks whether our java backend is alive
        return "Java backend is running";
    }
}