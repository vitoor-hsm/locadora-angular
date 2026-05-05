package com.locadora.backend.controllers;

import com.locadora.backend.DTOS.UserDTO;
import com.locadora.backend.models.Movie;
import com.locadora.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import com.locadora.backend.models.User;
import com.locadora.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private UserService service;

    @GetMapping
    public ResponseEntity<Page<User>> listAll(@PageableDefault(size = 5, sort = "id") Pageable pageable){
        Page<User> users = repository.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id){
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> save(@Valid @RequestBody UserDTO data){
        User newUser = service.save(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Void> favorite(@PathVariable Long userId, @PathVariable Long movieId){
        service.favoriteMovie(userId, movieId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Movie>> getFavorites(@PathVariable Long userId){
        return ResponseEntity.ok(service.listFavorites(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody UserDTO data) {
        return ResponseEntity.ok(service.update(id, data));
    }

    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Void> unfavorite(@PathVariable Long userId, @PathVariable Long movieId) {
        service.unfavoriteMovie(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}