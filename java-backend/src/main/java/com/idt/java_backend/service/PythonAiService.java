package com.idt.java_backend.service;

import com.idt.java_backend.model.TextRequest;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class PythonAiService {
    //.\mvnw.cmd spring-boot:run
    private final RestClient restClient =
            RestClient.create("http://127.0.0.1:8000");

    public Map<String, Object> detect(TextRequest request) {

        Map<String, String> body = Map.of(
                "text", request.text()
        );

        return restClient
                .post()
                .uri("/detect")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }
}