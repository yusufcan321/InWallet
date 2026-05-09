package com.wallet.portfolio.inwallet_service.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
public class AIAssistantService {

    private final ChatClient chatClient;

    public AIAssistantService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem("Sen, InWallet uygulaması için çalışan uzman bir Kişisel Finans Asistanısın. " +
                        "Kullanıcılara yatırım, bütçe ve hedefler konusunda dürüst ve kısa tavsiyeler verirsin. " +
                        "Ayrıca senin emrine sunulan 'Agentic Tools' (fonksiyonları) kullanarak kullanıcının gerçek verilerini sorgulayabilirsin.")
                .build();
    }

    public String chatWithAgent(String userMessage, Long userId) {
        return chatClient.prompt()
                .user(userMessage + " (Benim Kullanıcı ID'm: " + userId + ")")
                .functions("getUserPortfolio") // Tool fonksiyonları entegre edildi
                .call()
                .content();
    }
}
