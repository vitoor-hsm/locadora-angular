package com.locadora.backend.controllers;

import com.locadora.backend.DTOS.LoginDTO;
import com.locadora.backend.config.TokenService;
import com.locadora.backend.models.User;
import com.locadora.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class Authentication {

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO login) {
        var userOptional = authService.processLogin(login);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = tokenService.generateToken(user);
            
            return ResponseEntity.ok(new LoginResponseDTO(
                    user.getId(),
                    user.getName(),
                    user.getLogin(),
                    user.getRole(),
                    user.isHighContrast(),
                    token
            ));
        }

        return ResponseEntity.status(401).body("Login ou senha inválidos!");
    }
}