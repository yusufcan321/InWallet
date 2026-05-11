package com.wallet.portfolio.service;

import com.wallet.portfolio.entity.User;
import com.wallet.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @CacheEvict(value = "users", key = "#id")
    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);
        if (updatedUser.getMonthlyIncome() != null) {
            existingUser.setMonthlyIncome(updatedUser.getMonthlyIncome());
        }
        if (updatedUser.getMonthlyExpense() != null) {
            existingUser.setMonthlyExpense(updatedUser.getMonthlyExpense());
        }
        // Diğer alanlar da eklenebilir
        return userRepository.save(existingUser);
    }
}
