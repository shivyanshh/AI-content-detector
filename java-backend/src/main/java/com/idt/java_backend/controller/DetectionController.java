package com.idt.java_backend.controller;

import com.idt.java_backend.model.TextRequest;
import com.idt.java_backend.service.PythonAiService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class DetectionController {

    private final PythonAiService pythonAiService;


    public DetectionController(
            PythonAiService pythonAiService
    ) {
        this.pythonAiService = pythonAiService;
    }


    // -------------------------
    // TEXT
    // -------------------------

    @PostMapping("/detect")
    public Map detect(
            @RequestBody TextRequest request
    ) {

        return pythonAiService.detect(request);
    }


    // -------------------------
    // IMAGE
    // -------------------------

    @PostMapping(
            value = "/detect-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map detectImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return pythonAiService.detectImage(file);
    }
}