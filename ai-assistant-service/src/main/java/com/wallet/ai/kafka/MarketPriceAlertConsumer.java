package com.wallet.ai.kafka;

import com.wallet.ai.dto.MarketPriceAlertEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MarketPriceAlertConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MarketPriceAlertConsumer.class);
    
    // En son piyasa uyarılarını hafızada tutuyoruz (AI Insight için context olarak kullanılabilir)
    private final Map<String, MarketPriceAlertEvent> latestAlerts = new ConcurrentHashMap<>();

    @KafkaListener(topics = "market-price-alerts", groupId = "ai-assistant-group")
    public void consumeMarketAlert(MarketPriceAlertEvent event) {
        LOGGER.info("📥 Kafka'dan piyasa uyarısı alındı: {} (Değişim: %{})", event.getSymbol(), event.getChangePercentage());
        latestAlerts.put(event.getSymbol(), event);
    }

    public Map<String, MarketPriceAlertEvent> getLatestAlerts() {
        return latestAlerts;
    }
}
