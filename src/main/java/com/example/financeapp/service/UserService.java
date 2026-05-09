package com.example.financeapp.service;

import com.example.financeapp.entity.User;

public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    User getUserByUsername(String username);
}
