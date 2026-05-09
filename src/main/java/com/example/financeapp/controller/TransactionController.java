package com.example.financeapp.controller;

import com.example.financeapp.entity.Transaction;
import com.example.financeapp.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @PathVariable Long userId,
            @RequestBody Transaction transaction,
            @RequestParam(required = false) Long assetId) {
        return new ResponseEntity<>(transactionService.createTransaction(userId, transaction, assetId), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<List<Transaction>> getAssetTransactions(@PathVariable Long userId, @PathVariable Long assetId) {
        return ResponseEntity.ok(transactionService.getAssetTransactions(assetId, userId));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long transactionId, @PathVariable Long userId) {
        transactionService.deleteTransaction(transactionId, userId);
        return ResponseEntity.noContent().build();
    }
}
