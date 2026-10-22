package com.idt.java_backend.service;

import com.idt.java_backend.model.TextRequest;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@Service
public class PythonAiService {

    private final RestClient restClient =
            RestClient.create("http://127.0.0.1:8000");


    // -------------------------
    // TEXT DETECTION
    // -------------------------

    public Map detect(TextRequest request) {

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


    // -------------------------
    // IMAGE DETECTION
    // -------------------------

    public Map detectImage(MultipartFile file)
            throws IOException {

        ByteArrayResource imageResource =
                new ByteArrayResource(file.getBytes()) {

                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                };


        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("file", imageResource);


        return restClient
                .post()
                .uri("/detect-image")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(Map.class);
    }
}