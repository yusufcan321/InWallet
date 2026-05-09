package com.example.financeapp.service.impl;

import com.example.financeapp.entity.Asset;
import com.example.financeapp.service.AssetService;
import com.example.financeapp.service.PortfolioService;
import com.example.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final AssetService assetService;
    private final UserService userService;

    // Estimated average annual returns per asset type (e.g., STOCKS -> 8%, CRYPTO
    // -> 15%)
    private static final Map<Asset.AssetType, Double> ANNUAL_RETURN_RATES = Map.of(
            Asset.AssetType.CASH, 0.0,
            Asset.AssetType.REAL_ESTATE, 0.05,
            Asset.AssetType.STOCKS, 0.08,
            Asset.AssetType.CRYPTO, 0.15,
            Asset.AssetType.BONDS, 0.04,
            Asset.AssetType.OTHER, 0.02);

    @Override
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "portfolios", key = "#userId")
    public BigDecimal calculateTotalPortfolioValue(Long userId) {
        userService.getUserById(userId); // Validate user

        List<Asset> assets = assetService.getUserAssets(userId);
        return assets.stream()
                .map(Asset::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "portfolios", key = "'estimate_' + #userId + '_' + #months")
    public Map<String, BigDecimal> estimateFuturePortfolioValue(Long userId, int months) {
        userService.getUserById(userId);
        List<Asset> assets = assetService.getUserAssets(userId);

        Map<String, BigDecimal> projections = new HashMap<>();
        BigDecimal totalProjected = BigDecimal.ZERO;

        double years = months / 12.0;

        for (Asset asset : assets) {
            double annualRate = ANNUAL_RETURN_RATES.getOrDefault(asset.getType(), 0.0);

            // FV = PV * (1 + r)^t
            BigDecimal futureValueFactor = BigDecimal.valueOf(Math.pow(1 + annualRate, years));
            BigDecimal projectedValue = asset.getValue().multiply(futureValueFactor).setScale(2, RoundingMode.HALF_UP);

            // Add to the specific asset type sum
            String typeName = asset.getType().name();
            projections.put(typeName, projections.getOrDefault(typeName, BigDecimal.ZERO).add(projectedValue));

            totalProjected = totalProjected.add(projectedValue);
        }

        projections.put("TOTAL", totalProjected);
        return projections;
    }
}
