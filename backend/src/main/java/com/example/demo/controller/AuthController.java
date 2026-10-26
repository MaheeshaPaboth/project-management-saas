package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.dto.AuthRequest;
import com.example.demo.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(
            @RequestBody User user) {

        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(
            @RequestBody AuthRequest request) {

        return authService.login(
                request.email(),
                request.password());
    }
}