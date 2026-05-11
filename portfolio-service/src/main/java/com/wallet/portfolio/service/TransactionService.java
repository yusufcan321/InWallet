package com.wallet.portfolio.service;

import com.wallet.portfolio.entity.Transaction;
import com.wallet.portfolio.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionService.class);
    private final TransactionRepository transactionRepository;
    private final com.wallet.portfolio.kafka.TransactionProducer transactionProducer;

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        try {
            Transaction saved = transactionRepository.save(transaction);
            LOGGER.info("Transaction saved to database: {}", saved.getId());
            try {
                transactionProducer.sendTransactionEvent(saved);
            } catch (Exception kafkaError) {
                LOGGER.warn("Kafka event sending failed but transaction saved: {}", kafkaError.getMessage());
            }
            return saved;
        } catch (Exception e) {
            LOGGER.error("Transaction save failed: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
