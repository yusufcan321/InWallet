package com.wallet.portfolio.inwallet_service.service;

import com.wallet.portfolio.inwallet_service.entity.Asset;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.List;
import java.util.function.Function;

@Configuration
public class AIAgentToolsConfig {

    public record UserPortfolioRequest(Long userId) {}
    public record UserPortfolioResponse(List<String> portfolioSummary) {}

    @Bean
    @Description("Kullanıcının mevcut yatırım portföyünü (hangi hisseden/altından ne kadar var) getirir.")
    public Function<UserPortfolioRequest, UserPortfolioResponse> getUserPortfolio(AssetService assetService) {
        return request -> {
            List<Asset> assets = assetService.getAssetsByUserId(request.userId());
            List<String> summary = assets.stream()
                    .map(a -> a.getSymbol() + " - Miktar: " + a.getQuantity() + " - Anlık Değer: " + a.getCurrentPrice())
                    .toList();
            return new UserPortfolioResponse(summary);
        };
    }
}
