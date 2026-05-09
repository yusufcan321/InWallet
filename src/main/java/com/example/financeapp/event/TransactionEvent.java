package com.example.financeapp.event;

import com.example.financeapp.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEvent {
    private Long transactionId;
    private Long userId;
    private Long assetId;
    private BigDecimal amount;
    private Transaction.TransactionType type;
}
