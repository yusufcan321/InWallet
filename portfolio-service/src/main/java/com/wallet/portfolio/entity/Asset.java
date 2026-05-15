package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "assets")
public class Asset {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private User user;
    
    private String type;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal averageBuyPrice;
    private BigDecimal targetSellPrice;
    private BigDecimal currentPrice;
    
    @Column(name = "updated_at")
    private java.time.OffsetDateTime updatedAt;

    public Asset() {}
    public Asset(Long id, User user, String type, String symbol, BigDecimal quantity, BigDecimal averageBuyPrice, BigDecimal targetSellPrice, BigDecimal currentPrice, java.time.OffsetDateTime updatedAt) {
        this.id = id; this.user = user; this.type = type; this.symbol = symbol; this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice; this.targetSellPrice = targetSellPrice; this.currentPrice = currentPrice; this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getAverageBuyPrice() { return averageBuyPrice; }
    public void setAverageBuyPrice(BigDecimal averageBuyPrice) { this.averageBuyPrice = averageBuyPrice; }
    public BigDecimal getTargetSellPrice() { return targetSellPrice; }
    public void setTargetSellPrice(BigDecimal targetSellPrice) { this.targetSellPrice = targetSellPrice; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
    public java.time.OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public static AssetBuilder builder() {
        return new AssetBuilder();
    }

    public static class AssetBuilder {
        private Long id;
        private User user;
        private String type;
        private String symbol;
        private BigDecimal quantity;
        private BigDecimal averageBuyPrice;
        private BigDecimal targetSellPrice;
        private BigDecimal currentPrice;
        private java.time.OffsetDateTime updatedAt;

        public AssetBuilder id(Long id) { this.id = id; return this; }
        public AssetBuilder user(User user) { this.user = user; return this; }
        public AssetBuilder type(String type) { this.type = type; return this; }
        public AssetBuilder symbol(String symbol) { this.symbol = symbol; return this; }
        public AssetBuilder quantity(BigDecimal quantity) { this.quantity = quantity; return this; }
        public AssetBuilder averageBuyPrice(BigDecimal averageBuyPrice) { this.averageBuyPrice = averageBuyPrice; return this; }
        public AssetBuilder targetSellPrice(BigDecimal targetSellPrice) { this.targetSellPrice = targetSellPrice; return this; }
        public AssetBuilder currentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; return this; }
        public AssetBuilder updatedAt(java.time.OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Asset build() {
            return new Asset(id, user, type, symbol, quantity, averageBuyPrice, targetSellPrice, currentPrice, updatedAt);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.OffsetDateTime.now();
    }
}
