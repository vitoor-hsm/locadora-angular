package com.locadora.backend.repositories;

import com.locadora.backend.models.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository //to make the favorites filter work
public interface MovieRepository extends JpaRepository<Movie, Long> {

    boolean existsByTitleAndReleaseYear(String title, int releaseYear);
    
    @Query("SELECT m FROM User u JOIN u.favoriteMovies m WHERE u.id = :userId")
    Page<Movie> findFavoritesByUserId(@Param("userId") Long userId, Pageable pageable);

}