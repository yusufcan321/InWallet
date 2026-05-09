package com.example.financeapp.service;

import com.example.financeapp.entity.Transaction;
import java.util.List;

public interface TransactionService {
    Transaction createTransaction(Long userId, Transaction transaction, Long assetId);
    List<Transaction> getUserTransactions(Long userId);
    List<Transaction> getAssetTransactions(Long assetId, Long userId);
    void deleteTransaction(Long transactionId, Long userId);
}
