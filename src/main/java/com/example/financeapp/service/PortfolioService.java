package com.example.financeapp.service;

import java.math.BigDecimal;
import java.util.Map;

public interface PortfolioService {
    
    /**
     * Calculates the total value of all assets combined for a given user.
     */
    BigDecimal calculateTotalPortfolioValue(Long userId);

    /**
     * Estimates the future value of the user's portfolio over a specified number of months,
     * based on average historical returns of the asset types they hold.
     * @param userId the user ID
     * @param months number of months into the future
     * @return a map containing the projected value by AssetType, and the "TOTAL" projected value.
     */
    Map<String, BigDecimal> estimateFuturePortfolioValue(Long userId, int months);
}
