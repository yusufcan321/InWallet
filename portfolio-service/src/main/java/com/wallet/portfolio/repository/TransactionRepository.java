package com.wallet.portfolio.repository;

import com.wallet.portfolio.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM transactions WHERE user_id = ?1", nativeQuery = true)
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByUserIdAndType(Long userId, String type);
}
