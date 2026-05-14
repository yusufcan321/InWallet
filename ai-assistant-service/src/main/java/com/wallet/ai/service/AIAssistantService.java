package com.wallet.ai.service;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;
import org.springframework.util.StreamUtils;

@Service
public class AIAssistantService {

    private final RestClient restClient;

    @org.springframework.beans.factory.annotation.Value("${PORTFOLIO_SERVICE_URL:http://portfolio-service:8080}")
    private String portfolioServiceUrl;

    @org.springframework.beans.factory.annotation.Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    public AIAssistantService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    public String chatWithAgent(String userMessage, Long userId) {
        return chatWithAgent(userMessage, userId, null);
    }

    public String chatWithAgent(String userMessage, Long userId, Resource imageResource) {
        try {
            CompletableFuture<String> portfolioFuture = CompletableFuture.supplyAsync(() -> fetchData(portfolioServiceUrl + "/api/assets/user/" + userId));
            CompletableFuture<String> goalsFuture = CompletableFuture.supplyAsync(() -> fetchData(portfolioServiceUrl + "/api/goals/user/" + userId));
            CompletableFuture<String> transactionsFuture = CompletableFuture.supplyAsync(() -> fetchData(portfolioServiceUrl + "/api/transactions/user/" + userId));

            CompletableFuture.allOf(portfolioFuture, goalsFuture, transactionsFuture).join();

            String portfolio = portfolioFuture.join();
            String goals = goalsFuture.join();
            String transactions = transactionsFuture.join();

            String systemPromptText = """
                Sen InWallet finansal asistanısın. Kullanıcının cüzdan verileri aşağıdadır:
                
                PORTFÖY: %s
                HEDEFLER: %s
                İŞLEMLER: %s
                
                GÖREVİN:
                1. Kullanıcının sorularını yanıtla ve portföy analizi yap.
                2. Kullanıcı bir FİŞ veya FATURA fotoğrafı gönderdiğinde; Harcama Yerini, Tutarı ve Kategoriyi GÖRSELden kendin tespit et.
                3. Tespit ettiğin bu verilerle 'saveTransaction' aracını HİÇ BEKLEMEDEN ve kullanıcıya soru sormadan otomatik olarak çağır.
                4. İşlem bittikten sonra kullanıcıya "Fişinizi okudum, [Tutar] TL tutarındaki [Harcama Yeri] harcamasını başarıyla kaydettim" şeklinde bilgi ver.
                
                KESİNLİKLE tutar veya kategori sorma, görselden ne görüyorsan onu kullan. Görsel net değilse tahmin yürüt veya en yakın kategoriyi seç.
                
                Yanıtların profesyonel, motive edici ve finansal açıdan tutarlı olsun.
                Yasal Uyarı: Burada yer alan yatırım bilgi, yorum ve tavsiyeleri yatırım danışmanlığı kapsamında değildir.
                """.formatted(portfolio, goals, transactions);

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            List<Map<String, Object>> parts = new java.util.ArrayList<>();
            parts.add(Map.of("text", systemPromptText + "\n\nKullanıcı Mesajı: " + userMessage));

            if (imageResource != null) {
                byte[] imageBytes = org.springframework.util.StreamUtils.copyToByteArray(imageResource.getInputStream());
                String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
                parts.add(Map.of(
                    "inline_data", Map.of(
                        "mime_type", "image/jpeg",
                        "data", base64Image
                    )
                ));
            }

            List<Map<String, Object>> tools = List.of(
                Map.of("function_declarations", List.of(
                    Map.of(
                        "name", "saveTransaction",
                        "description", "Gelir veya gider işlemini (fiş/fatura verilerini) sisteme kaydeder.",
                        "parameters", Map.of(
                            "type", "OBJECT",
                            "properties", Map.of(
                                "userId", Map.of("type", "NUMBER", "description", "Kullanıcının ID'si"),
                                "type", Map.of("type", "STRING", "description", "İşlem türü: INCOME veya EXPENSE"),
                                "description", Map.of("type", "STRING", "description", "Harcama açıklaması veya yer ismi"),
                                "category", Map.of("type", "STRING", "description", "Harcama kategorisi"),
                                "amount", Map.of("type", "NUMBER", "description", "Harcama tutarı")
                            ),
                            "required", List.of("userId", "type", "description", "amount")
                        )
                    )
                ))
            );

            Map<String, Object> requestBody = new java.util.HashMap<>();
            requestBody.put("contents", List.of(Map.of("role", "user", "parts", parts)));
            requestBody.put("tools", tools);
            requestBody.put("generationConfig", Map.of("temperature", 0.7, "maxOutputTokens", 2048));

            Map<String, Object> response = restClient.post()
                    .uri(url)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                    Map<String, Object> firstPart = resParts.get(0);
                    
                    if (firstPart.containsKey("functionCall")) {
                        Map<String, Object> functionCall = (Map<String, Object>) firstPart.get("functionCall");
                        String functionName = (String) functionCall.get("name");
                        Map<String, Object> args = (Map<String, Object>) functionCall.get("args");
                        
                        if ("saveTransaction".equals(functionName)) {
                            return executeSaveTransaction(args, userId);
                        }
                    }
                    
                    return (String) firstPart.get("text");
                }
            }
            
            return "Üzgünüm, şu an yanıt oluşturamıyorum. Lütfen daha sonra tekrar deneyin.";

        } catch (Exception e) {
            return "AI Servis Hatası: " + e.getMessage();
        }
    }

    private String executeSaveTransaction(Map<String, Object> args, Long userId) {
        try {
            Map<String, Object> body = Map.of(
                "user", Map.of("id", userId),
                "type", args.getOrDefault("type", "EXPENSE"),
                "description", args.get("description"),
                "category", args.getOrDefault("category", "Genel"),
                "amount", new java.math.BigDecimal(args.get("amount").toString())
            );

            restClient.post()
                    .uri(portfolioServiceUrl + "/api/transactions")
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            
            return "Tamamdır! Fişteki harcamayı (" + args.get("description") + ", " + args.get("amount") + " TL) başarıyla cüzdanınıza kaydettim. ✅";
        } catch (Exception e) {
            return "Harcamayı kaydederken bir sorun oluştu: " + e.getMessage();
        }
    }

    private String fetchData(String url) {
        try {
            return restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            return "Veri alınamadı: " + e.getMessage();
        }
    }

    public String chatWithVoice(Resource audioResource, Long userId) {
        return chatWithAgent("Sesli mesaj gönderildi.", userId);
    }

    public String chatWithImage(Resource imageResource, String message, Long userId) {
        return chatWithAgent(message != null ? message : "Bu görseli analiz et.", userId, imageResource);
    }
}
