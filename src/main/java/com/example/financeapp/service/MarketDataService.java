package com.example.financeapp.service;

import com.example.financeapp.entity.Asset;
import java.math.BigDecimal;

public interface MarketDataService {
    
    /**
     * Fetches the latest price of a specific asset symbol from an external API.
     * The result should be cached using Redis.
     *
     * @param symbol the asset ticker (e.g., "BTC", "AAPL", "XAU")
     * @param type the type of the asset
     * @return the latest price in USD
     */
    BigDecimal getLatestPrice(String symbol, Asset.AssetType type);
}
