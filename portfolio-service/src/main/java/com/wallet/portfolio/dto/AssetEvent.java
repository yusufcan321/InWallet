package com.wallet.portfolio.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

public class AssetEvent {
    private Long userId;
    private String symbol;
    private String type;          // STOCK, GOLD, CRYPTO, FOREX vb.
    private BigDecimal quantity;
    private BigDecimal price;
    private String action;        // "ADDED" | "UPDATED" | "REMOVED"
    private java.time.Instant timestamp;

    public AssetEvent() {}
    public AssetEvent(Long userId, String symbol, String type, BigDecimal quantity, BigDecimal price, String action, java.time.Instant timestamp) {
        this.userId = userId; this.symbol = symbol; this.type = type; this.quantity = quantity;
        this.price = price; this.action = action; this.timestamp = timestamp;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public java.time.Instant getTimestamp() { return timestamp; }
    public void setTimestamp(java.time.Instant timestamp) { this.timestamp = timestamp; }

    public static AssetEventBuilder builder() {
        return new AssetEventBuilder();
    }

    public static class AssetEventBuilder {
        private Long userId;
        private String symbol;
        private String type;
        private BigDecimal quantity;
        private BigDecimal price;
        private String action;
        private java.time.Instant timestamp;

        public AssetEventBuilder userId(Long userId) { this.userId = userId; return this; }
        public AssetEventBuilder symbol(String symbol) { this.symbol = symbol; return this; }
        public AssetEventBuilder type(String type) { this.type = type; return this; }
        public AssetEventBuilder quantity(BigDecimal quantity) { this.quantity = quantity; return this; }
        public AssetEventBuilder price(BigDecimal price) { this.price = price; return this; }
        public AssetEventBuilder action(String action) { this.action = action; return this; }
        public AssetEventBuilder timestamp(java.time.Instant timestamp) { this.timestamp = timestamp; return this; }

        public AssetEvent build() {
            return new AssetEvent(userId, symbol, type, quantity, price, action, timestamp);
        }
    }
}
