package com.wallet.ai.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.web.client.RestClient;
import java.util.function.Function;

@Configuration
public class AIAgentToolsConfig {

    @org.springframework.beans.factory.annotation.Value("${PORTFOLIO_SERVICE_URL:http://portfolio-service:8080}")
    private String portfolioServiceUrl;

    public record UserPortfolioRequest(Long userId) {}
    public record UserPortfolioResponse(String portfolioSummary) {}

    public record UserGoalsRequest(Long userId) {}
    public record UserGoalsResponse(String goalsSummary) {}

    public record UserTransactionsRequest(Long userId) {}
    public record UserTransactionsResponse(String transactionsSummary) {}

    @Bean
    @Description("Kullanıcının mevcut yatırım portföyünü (hangi hisseden/altından ne kadar var, anlık fiyatlar nedir) getirir.")
    public Function<UserPortfolioRequest, UserPortfolioResponse> getUserPortfolio(RestClient restClient) {
        return request -> {
            try {
                String response = restClient.get()
                        .uri(portfolioServiceUrl + "/api/assets/user/" + request.userId())
                        .retrieve()
                        .body(String.class);
                return new UserPortfolioResponse(response);
            } catch (Exception e) {
                return new UserPortfolioResponse("Portföy bilgisi alınamadı: " + e.getMessage());
            }
        };
    }

    @Bean
    @Description("Kullanıcının belirlediği hedefleri (ev, araba vb.), enflasyon bazlı hedef maliyetleri ve bu hedeflere ulaşma yüzdesini getirir.")
    public Function<UserGoalsRequest, UserGoalsResponse> getUserGoals(RestClient restClient) {
        return request -> {
            try {
                String response = restClient.get()
                        .uri(portfolioServiceUrl + "/api/goals/user/" + request.userId())
                        .retrieve()
                        .body(String.class);
                return new UserGoalsResponse(response);
            } catch (Exception e) {
                return new UserGoalsResponse("Hedef bilgileri alınamadı: " + e.getMessage());
            }
        };
    }

    @Bean
    @Description("Kullanıcının gelirlerini, giderlerini ve aylık tasarruf oranını/nakit akışını getirir.")
    public Function<UserTransactionsRequest, UserTransactionsResponse> getUserTransactions(RestClient restClient) {
        return request -> {
            try {
                String response = restClient.get()
                        .uri(portfolioServiceUrl + "/api/transactions/user/" + request.userId())
                        .retrieve()
                        .body(String.class);
                return new UserTransactionsResponse(response);
            } catch (Exception e) {
                return new UserTransactionsResponse("Gelir/Gider bilgileri alınamadı: " + e.getMessage());
            }
        };
    }
}

