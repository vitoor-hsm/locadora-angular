package com.locadora.backend.controllers;


public record LoginResponseDTO(
        Long id,
        String name,
        String login,
        String role,
        boolean highContrast,
        String token
) {}
