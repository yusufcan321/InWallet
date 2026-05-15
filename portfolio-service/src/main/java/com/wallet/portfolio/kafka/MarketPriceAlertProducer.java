package com.wallet.portfolio.kafka;

import com.wallet.portfolio.dto.MarketPriceAlertEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class MarketPriceAlertProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MarketPriceAlertProducer.class);
    private static final String TOPIC = "market-price-alerts";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public MarketPriceAlertProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendAlert(MarketPriceAlertEvent event) {
        LOGGER.info("🚀 Piyasa uyarısı gönderiliyor: {} (Değişim: %{})", event.getSymbol(), event.getChangePercentage());
        kafkaTemplate.send(TOPIC, event.getSymbol(), event);
    }
}
