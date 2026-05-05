package com.locadora.backend.service;

import com.locadora.backend.DTOS.LoginDTO;
import com.locadora.backend.models.User;
import com.locadora.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;

    // it searches for the user by login, and if found, checks if the password matches
    public Optional<User> processLogin(LoginDTO login) {
        return repository.findByLogin(login.getLogin())
                .filter(user -> user.getPassword().equals(login.getPassword()));
    }
}






