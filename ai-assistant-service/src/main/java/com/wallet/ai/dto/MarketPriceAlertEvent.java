package com.wallet.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class MarketPriceAlertEvent {
    private String symbol;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private double changePercentage;
    private long timestamp;

    public MarketPriceAlertEvent() {}

    public MarketPriceAlertEvent(String symbol, BigDecimal oldPrice, BigDecimal newPrice, double changePercentage, long timestamp) {
        this.symbol = symbol;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
        this.changePercentage = changePercentage;
        this.timestamp = timestamp;
    }

    public String getSymbol() { return symbol; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public BigDecimal getNewPrice() { return newPrice; }
    public double getChangePercentage() { return changePercentage; }
    public long getTimestamp() { return timestamp; }
}
