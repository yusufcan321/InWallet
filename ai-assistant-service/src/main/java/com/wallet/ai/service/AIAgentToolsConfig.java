package com.wallet.ai.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.web.client.RestClient;
import java.util.function.Function;
import java.util.Map;

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
    @Description("Kullanıcının portföyündeki varlıkları ve toplam değerini getirir.")
    public Function<UserPortfolioRequest, UserPortfolioResponse> getUserPortfolio(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.build();
        return request -> {
            try {
                String result = restClient.get()
                        .uri(portfolioServiceUrl + "/api/assets/user/" + request.userId())
                        .retrieve()
                        .body(String.class);
                return new UserPortfolioResponse(result);
            } catch (Exception e) {
                return new UserPortfolioResponse("Portföy bilgisi alınamadı: " + e.getMessage());
            }
        };
    }

    @Bean
    @Description("Kullanıcının finansal hedeflerini getirir.")
    public Function<UserGoalsRequest, UserGoalsResponse> getUserGoals(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.build();
        return request -> {
            try {
                String result = restClient.get()
                        .uri(portfolioServiceUrl + "/api/goals/user/" + request.userId())
                        .retrieve()
                        .body(String.class);
                return new UserGoalsResponse(result);
            } catch (Exception e) {
                return new UserGoalsResponse("Hedef bilgileri alınamadı: " + e.getMessage());
            }
        };
    }

    @Bean
    @Description("Kullanıcının son gelir ve gider işlemlerini getirir.")
    public Function<UserTransactionsRequest, UserTransactionsResponse> getUserTransactions(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.build();
        return request -> {
            try {
                String result = restClient.get()
                        .uri(portfolioServiceUrl + "/api/transactions/user/" + request.userId())
                        .retrieve()
                        .body(String.class);
                return new UserTransactionsResponse(result);
            } catch (Exception e) {
                return new UserTransactionsResponse("Gelir/Gider bilgileri alınamadı: " + e.getMessage());
            }
        };
    }

    @Bean
    @Description("Gelir veya gider işlemini (örn. bir fişten okunan harcamayı) sisteme kaydeder.")
    public Function<SaveTransactionRequest, SaveTransactionResponse> saveTransaction(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.build();
        return request -> {
            try {
                Map<String, Object> body = Map.of(
                    "user", Map.of("id", request.userId()),
                    "type", request.type(),
                    "description", request.description(),
                    "category", request.category(),
                    "amount", request.amount()
                );

                restClient.post()
                        .uri(portfolioServiceUrl + "/api/transactions")
                        .body(body)
                        .retrieve()
                        .toBodilessEntity();
                
                return new SaveTransactionResponse(true, "İşlem başarıyla kaydedildi.");
            } catch (Exception e) {
                return new SaveTransactionResponse(false, "İşlem kaydedilemedi: " + e.getMessage());
            }
        };
    }

    public record SaveTransactionRequest(Long userId, String type, String description, String category, java.math.BigDecimal amount) {}
    public record SaveTransactionResponse(boolean success, String message) {}
}
