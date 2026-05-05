package com.locadora.backend.services;

import com.locadora.backend.DTOS.UserDTO;
import com.locadora.backend.models.Movie;
import com.locadora.backend.models.User;
import com.locadora.backend.repositories.MovieRepository;
import com.locadora.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    public void favoriteMovie(Long userId, Long movieId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        if (!user.getFavoriteMovies().contains(movie)) {
            user.getFavoriteMovies().add(movie);
            userRepository.save(user);
        }

    }
    public List<Movie> listFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return user.getFavoriteMovies();
    }

    public void unfavoriteMovie(Long userId, Long movieId ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        user.getFavoriteMovies().remove(movie);
        userRepository.save(user);

    }

    public User update(Long id, UserDTO data) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // It only validates the email if it is not null/empty
        if (data.getEmail() != null && !data.getEmail().isBlank()) {
            if (userRepository.existsByEmailAndIdNot(data.getEmail(), id)) {
                throw new RuntimeException("Error: Email is already in use.");
            }
            user.setEmail(data.getEmail());
        }

        // It only updates the fields if they are included in the DTO
        if (data.getName() != null) user.setName(data.getName());
        if (data.getLogin() != null) user.setLogin(data.getLogin());

        if (data.getPassword() != null && !data.getPassword().isBlank()) {
            user.setPassword(data.getPassword());
        }

        if (data.getRole() != null) user.setRole(data.getRole());

        // The contrast will always be updated
        user.setHighContrast(data.isHighContrast());

        return userRepository.save(user);
    }
    public User save(UserDTO data) {
        if (userRepository.existsByEmail(data.getEmail())) {
            throw new RuntimeException("Error: Email is already in use.");
        }
        
        User newUser = new User();
        newUser.setName(data.getName());
        newUser.setLogin(data.getLogin());
        newUser.setEmail(data.getEmail());
        newUser.setPassword(data.getPassword());
        newUser.setRole(data.getRole() != null ? data.getRole() : "USER");

        newUser.setHighContrast(data.isHighContrast());

        return userRepository.save(newUser);
    }

}
