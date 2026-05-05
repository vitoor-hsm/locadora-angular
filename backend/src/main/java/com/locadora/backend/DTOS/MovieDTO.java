package com.locadora.backend.DTOS;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

public class MovieDTO {
    private Long id;
    @NotBlank(message = "Título é obrigatório")
    private String title;

    @NotBlank(message = "Gênero é obrigatório")
    private String genre;

    @NotNull(message = "Ano de lançamento é obrigatório")
    private Integer releaseYear;

    private String posterUrl;
    private String synopsis;
    private boolean favorite;
}
