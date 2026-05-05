package com.locadora.backend.models;

import jakarta.persistence.*;
import lombok.*;


@Table(name = "movies")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;
    private String genre;
    private Integer releaseYear;
    private String posterUrl;
    private Boolean favorite = false; 
    @Column(length = 500)
    private String synopsis;

}