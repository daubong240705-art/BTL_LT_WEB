package com.movieapp.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/v1/test")
    public String testApi() {
        return "Backend Spring Boot đã kết nối thành công với Next.js!";
    }
}