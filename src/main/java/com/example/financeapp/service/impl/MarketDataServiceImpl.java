package com.example.financeapp.service.impl;

import com.example.financeapp.entity.Asset;
import com.example.financeapp.service.MarketDataService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataServiceImpl implements MarketDataService {

    private final WebClient.Builder webClientBuilder;

    // A mock fallback map for assets where we don't have a free public API handy
    private static final Map<String, BigDecimal> MOCK_PRICES = Map.of(
            "AAPL", BigDecimal.valueOf(185.50),
            "TSLA", BigDecimal.valueOf(170.20),
            "XAU", BigDecimal.valueOf(2340.00) // Gold
    );

    @Override
    @Cacheable(value = "marketPrices", key = "#symbol")
    public BigDecimal getLatestPrice(String symbol, Asset.AssetType type) {
        log.info("Fetching price for {} from EXTERNAL API (Not from Redis Cache!)...", symbol);
        
        // Simulating network delay to prove caching works
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // For Crypto, we use a real public API (CoinDesk)
        if (type == Asset.AssetType.CRYPTO && "BTC".equalsIgnoreCase(symbol)) {
            try {
                JsonNode response = webClientBuilder.build()
                        .get()
                        .uri("https://api.coindesk.com/v1/bpi/currentprice.json")
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .block();

                if (response != null) {
                    double rate = response.get("bpi").get("USD").get("rate_float").asDouble();
                    return BigDecimal.valueOf(rate).setScale(2, RoundingMode.HALF_UP);
                }
            } catch (Exception e) {
                log.error("Failed to fetch crypto price from external API", e);
            }
        }

        // For other types, return a mock price
        return Optional.ofNullable(MOCK_PRICES.get(symbol.toUpperCase()))
                .orElse(BigDecimal.valueOf(100.00)); // Default fallback
    }
}
