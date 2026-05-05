package com.locadora.backend.repositories;

import com.locadora.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);


    @Query("SELECT u FROM User u LEFT JOIN FETCH u.favoriteMovies WHERE u.id = :id")
    Optional<User> findByIdWithFavorites(@Param("id") Long id);
    
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.favoriteMovies")
    List<User> findAllWithFavorites();
    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);
}