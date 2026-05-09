package com.example.financeapp.controller;

import com.example.financeapp.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalPortfolioValue(@PathVariable Long userId) {
        return ResponseEntity.ok(portfolioService.calculateTotalPortfolioValue(userId));
    }

    @GetMapping("/estimate")
    public ResponseEntity<Map<String, BigDecimal>> getEstimatedFutureValue(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(portfolioService.estimateFuturePortfolioValue(userId, months));
    }
}
