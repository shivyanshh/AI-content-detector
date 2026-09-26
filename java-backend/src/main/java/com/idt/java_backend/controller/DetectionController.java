package com.idt.java_backend.controller;

import com.idt.java_backend.model.TextRequest;
import com.idt.java_backend.service.PythonAiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
//this is the endpoint (/api/detect/)
//this receives the request and pass it to the PythonAi service on
@RestController
@RequestMapping("/api")
public class DetectionController {

    private final PythonAiService pythonAiService;

    public DetectionController(PythonAiService pythonAiService) {
        this.pythonAiService = pythonAiService;
    }

    @PostMapping("/detect")
    public Map detect(@RequestBody TextRequest request) {

        return pythonAiService.detect(request);
    }
}
