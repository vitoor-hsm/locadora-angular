package com.locadora.backend.controllers;
import com.locadora.backend.DTOS.MovieDTO;
import com.locadora.backend.models.Movie;
import com.locadora.backend.services.MovieService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movies") // Route for movies
public class MovieController {

    @Autowired
    private MovieService service;

    @GetMapping
    public ResponseEntity<Page<MovieDTO>> listAll(
            @PageableDefault(size = 14, sort = "title") Pageable pageable,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(service.listAll(pageable, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> findById(@PathVariable Long id) {
        Movie movie = service.findById(id);
        return ResponseEntity.ok(movie);
    }
    @PostMapping
    public ResponseEntity<Movie> save(@Valid @RequestBody MovieDTO data) {
        Movie newMovie = new Movie();
        newMovie.setTitle(data.getTitle());
        newMovie.setGenre(data.getGenre());
        newMovie.setReleaseYear(data.getReleaseYear());
        newMovie.setPosterUrl(data.getPosterUrl());
        newMovie.setSynopsis(data.getSynopsis());

        return ResponseEntity.status(201).body(service.save(newMovie));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id){
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> update(@PathVariable Long id, @Valid @RequestBody MovieDTO data){
        return ResponseEntity.ok(service.update(id, data));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> toggleFavorite(@PathVariable Long id, @RequestBody Long userId){
        service.toggleFavorite(id, userId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/favorites")
    public ResponseEntity<Page<MovieDTO>> listFavorites(
            @PageableDefault(size = 14) Pageable pageable,
            @RequestParam Long userId) {
        return ResponseEntity.ok(service.listFavorites(pageable, userId));
    }
}
