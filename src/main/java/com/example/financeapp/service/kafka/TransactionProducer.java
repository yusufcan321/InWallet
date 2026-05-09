package com.example.financeapp.service.kafka;

import com.example.financeapp.config.KafkaConfig;
import com.example.financeapp.event.TransactionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;

    public void sendTransactionEvent(TransactionEvent event) {
        log.info("Publishing transaction event: {}", event);
        kafkaTemplate.send(KafkaConfig.TRANSACTION_TOPIC, event.getTransactionId().toString(), event);
    }
}
