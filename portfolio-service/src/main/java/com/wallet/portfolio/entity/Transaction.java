package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private User user;

    private String type;
    private String description;
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private Asset asset;

    private BigDecimal amount;
    private BigDecimal pricePerUnit;

    @Column(name = "transaction_date")
    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private java.time.OffsetDateTime transactionDate;

    public Transaction() {}
    public Transaction(Long id, User user, String type, String description, String category, Asset asset, BigDecimal amount, BigDecimal pricePerUnit, java.time.OffsetDateTime transactionDate) {
        this.id = id; this.user = user; this.type = type; this.description = description; this.category = category;
        this.asset = asset; this.amount = amount; this.pricePerUnit = pricePerUnit; this.transactionDate = transactionDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public java.time.OffsetDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(java.time.OffsetDateTime transactionDate) { this.transactionDate = transactionDate; }

    public static TransactionBuilder builder() {
        return new TransactionBuilder();
    }

    public static class TransactionBuilder {
        private Long id;
        private User user;
        private String type;
        private String description;
        private String category;
        private Asset asset;
        private BigDecimal amount;
        private BigDecimal pricePerUnit;
        private java.time.OffsetDateTime transactionDate;

        public TransactionBuilder id(Long id) { this.id = id; return this; }
        public TransactionBuilder user(User user) { this.user = user; return this; }
        public TransactionBuilder type(String type) { this.type = type; return this; }
        public TransactionBuilder description(String description) { this.description = description; return this; }
        public TransactionBuilder category(String category) { this.category = category; return this; }
        public TransactionBuilder asset(Asset asset) { this.asset = asset; return this; }
        public TransactionBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TransactionBuilder pricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; return this; }
        public TransactionBuilder transactionDate(java.time.OffsetDateTime transactionDate) { this.transactionDate = transactionDate; return this; }

        public Transaction build() {
            return new Transaction(id, user, type, description, category, asset, amount, pricePerUnit, transactionDate);
        }
    }

    @PrePersist
    protected void onCreate() {
        if (transactionDate == null) {
            transactionDate = java.time.OffsetDateTime.now();
        }
    }
}
