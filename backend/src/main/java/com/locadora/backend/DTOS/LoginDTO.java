package com.locadora.backend.DTOS;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class LoginDTO {

    @NotBlank(message = "O login não pode estar vazio")
    private String login;

    @NotBlank(message = "A senha não pode estar vazia")
    private String password;
}
