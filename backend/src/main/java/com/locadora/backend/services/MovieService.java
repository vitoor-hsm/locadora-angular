package com.locadora.backend.services;

import com.locadora.backend.DTOS.MovieDTO;
import com.locadora.backend.models.Movie;
import com.locadora.backend.models.User;
import com.locadora.backend.repositories.MovieRepository;
import com.locadora.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class MovieService {

    @Autowired
    private MovieRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<MovieDTO> listAll(Pageable pageable, Long userId) {
        User currentUser = null;
        if (userId != null) {
            currentUser = userRepository.findByIdWithFavorites(userId).orElse(null);
            if (currentUser != null){
                currentUser.getFavoriteMovies().size();
            }
        }

        Page<Movie> movies = repository.findAll(pageable);


        User finalUser = currentUser;
        return movies.map(movie -> convertToDTO(movie, finalUser));
    }

    public void toggleFavorite(Long movieId, Long userId) {
        //Search for the user by the ID that came from Angular
        User user = userRepository.findByIdWithFavorites(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + userId));

        // search a movie
        Movie movie = findById(movieId);

        //Favorite/Unfavorite Logic
        if (user.getFavoriteMovies().contains(movie)) {
            user.getFavoriteMovies().remove(movie);
            System.out.println("Removendo favorito: " + movie.getTitle());
        } else {
            user.getFavoriteMovies().add(movie);
            System.out.println("Adicionando favorito: " + movie.getTitle());
        }

        // Saves the user (this updates the N:N join table)
        userRepository.save(user);
    }

    public Page<MovieDTO> listFavorites(Pageable pageable, Long userId) {
        User user = userRepository.findByIdWithFavorites(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return repository.findFavoritesByUserId(userId, pageable)
                .map(movie -> convertToDTO(movie, user));
    }
    // Convert the Entity to DTO and mark it as a favorite
    private MovieDTO convertToDTO(Movie movie, User user) {
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setGenre(movie.getGenre());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setSynopsis(movie.getSynopsis());

        // Check if the movie is in the logged-in user's list
        if (user != null && user.getFavoriteMovies() != null) {
            dto.setFavorite(user.getFavoriteMovies().contains(movie));
        } else {
            dto.setFavorite(false);
        }

        return dto;
    }

    //Retrieves the logged-in user via Spring Security
    private User getLoggedUser() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return null;

        String login = authentication.getName();
        return userRepository.findByLogin(login).orElse(null);
    }



    public Movie save(Movie movie) {
        // Validate rules (Synopsis and Future Year)
        validateMovieRules(movie.getSynopsis(), movie.getReleaseYear());

        // Check if the movie already exists (Title + Year)
        if (repository.existsByTitleAndReleaseYear(movie.getTitle(), movie.getReleaseYear())) {
            throw new RuntimeException("Error: A movie with this title and release year already exists.");
        }

        return repository.save(movie);
    }

    public Movie update(Long id, MovieDTO data) {
        Movie movie = findById(id);

        validateMovieRules(data.getSynopsis(), data.getReleaseYear());

        movie.setTitle(data.getTitle());
        movie.setGenre(data.getGenre());
        movie.setReleaseYear(data.getReleaseYear());
        movie.setPosterUrl(data.getPosterUrl());
        movie.setSynopsis(data.getSynopsis());

        return repository.save(movie);
    }

    public Movie findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public boolean delete(Long id){
        if (repository.existsById(id)){
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    private void validateMovieRules(String synopsis, int releaseYear) {

        if (synopsis != null && synopsis.length() > 500) {
            throw new RuntimeException("Error: 'synopsis' field exceeded the 500 character limit");
        }

        int currentYear = LocalDate.now().getYear();
        if (releaseYear > currentYear) {
            throw new RuntimeException("Error: Release year " + releaseYear + " cannot be in the future");
        }
    }
}