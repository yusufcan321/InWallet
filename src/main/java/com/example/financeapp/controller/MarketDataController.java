package com.example.financeapp.controller;

import com.example.financeapp.entity.Asset;
import com.example.financeapp.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/{type}/{symbol}")
    public ResponseEntity<Map<String, Object>> getLatestPrice(
            @PathVariable Asset.AssetType type,
            @PathVariable String symbol) {
        
        BigDecimal price = marketDataService.getLatestPrice(symbol, type);
        
        return ResponseEntity.ok(Map.of(
                "symbol", symbol,
                "type", type,
                "latestPrice", price
        ));
    }
}
