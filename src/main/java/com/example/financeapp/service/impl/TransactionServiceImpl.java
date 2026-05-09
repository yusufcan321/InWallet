package com.example.financeapp.service.impl;

import com.example.financeapp.entity.Asset;
import com.example.financeapp.entity.Transaction;
import com.example.financeapp.entity.User;
import com.example.financeapp.repository.TransactionRepository;
import com.example.financeapp.service.AssetService;
import com.example.financeapp.service.TransactionService;
import com.example.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.financeapp.service.kafka.TransactionProducer;
import com.example.financeapp.event.TransactionEvent;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final AssetService assetService;
    private final TransactionProducer transactionProducer;

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "portfolios", allEntries = true)
    public Transaction createTransaction(Long userId, Transaction transaction, Long assetId) {
        User user = userService.getUserById(userId);
        transaction.setUser(user);
        
        if (assetId != null) {
            Asset asset = assetService.getAssetById(assetId, userId);
            transaction.setAsset(asset);
        }
        
        Transaction saved = transactionRepository.save(transaction);
        
        if (assetId != null) {
            TransactionEvent event = TransactionEvent.builder()
                .transactionId(saved.getId())
                .userId(userId)
                .assetId(assetId)
                .amount(saved.getAmount())
                .type(saved.getType())
                .build();
            transactionProducer.sendTransactionEvent(event);
        }
        
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getAssetTransactions(Long assetId, Long userId) {
        // Validate asset belongs to user
        assetService.getAssetById(assetId, userId);
        return transactionRepository.findByAssetId(assetId);
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "portfolios", allEntries = true)
    public void deleteTransaction(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
                
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this transaction");
        }
        
        transactionRepository.delete(transaction);
    }
}
