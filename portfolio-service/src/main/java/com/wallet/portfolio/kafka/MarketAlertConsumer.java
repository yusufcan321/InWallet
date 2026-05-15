package com.wallet.portfolio.kafka;

import com.wallet.portfolio.dto.MarketPriceAlertEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MarketAlertConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MarketAlertConsumer.class);
    private final SimpMessagingTemplate messagingTemplate;

    public MarketAlertConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "market-price-alerts", groupId = "portfolio-alerts-group")
    public void consumeAlert(MarketPriceAlertEvent event) {
        LOGGER.info("📢 Kafka'dan piyasa uyarısı alındı: {}. WebSocket'e basılıyor...", event.getSymbol());
        // WebSocket üzerinden /topic/alerts kanalına abone olan tüm kullanıcılara gönder
        messagingTemplate.convertAndSend("/topic/alerts", event);
    }
}
