package com.wallet.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

public class TransactionEvent {
    private Long transactionId;
    private Long userId;
    private Long assetId;
    private String type;
    private BigDecimal amount;
    private BigDecimal pricePerUnit;
    private java.time.OffsetDateTime transactionDate;

    public TransactionEvent() {}
    public TransactionEvent(Long transactionId, Long userId, Long assetId, String type, BigDecimal amount, BigDecimal pricePerUnit, java.time.OffsetDateTime transactionDate) {
        this.transactionId = transactionId; this.userId = userId; this.assetId = assetId; this.type = type;
        this.amount = amount; this.pricePerUnit = pricePerUnit; this.transactionDate = transactionDate;
    }

    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public java.time.OffsetDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(java.time.OffsetDateTime transactionDate) { this.transactionDate = transactionDate; }

    public static TransactionEventBuilder builder() {
        return new TransactionEventBuilder();
    }

    public static class TransactionEventBuilder {
        private Long transactionId;
        private Long userId;
        private Long assetId;
        private String type;
        private BigDecimal amount;
        private BigDecimal pricePerUnit;
        private java.time.OffsetDateTime transactionDate;

        public TransactionEventBuilder transactionId(Long transactionId) { this.transactionId = transactionId; return this; }
        public TransactionEventBuilder userId(Long userId) { this.userId = userId; return this; }
        public TransactionEventBuilder assetId(Long assetId) { this.assetId = assetId; return this; }
        public TransactionEventBuilder type(String type) { this.type = type; return this; }
        public TransactionEventBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TransactionEventBuilder pricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; return this; }
        public TransactionEventBuilder transactionDate(java.time.OffsetDateTime transactionDate) { this.transactionDate = transactionDate; return this; }

        public TransactionEvent build() {
            return new TransactionEvent(transactionId, userId, assetId, type, amount, pricePerUnit, transactionDate);
        }
    }
}
