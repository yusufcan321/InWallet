package com.example.financeapp.service.kafka;

import com.example.financeapp.config.KafkaConfig;
import com.example.financeapp.entity.Asset;
import com.example.financeapp.entity.Transaction;
import com.example.financeapp.event.TransactionEvent;
import com.example.financeapp.service.AssetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final AssetService assetService;

    @KafkaListener(topics = KafkaConfig.TRANSACTION_TOPIC, groupId = "finance-group")
    public void consumeTransactionEvent(TransactionEvent event) {
        log.info("Consumed transaction event: {}", event);

        // Update asset balance asynchronously
        if (event.getAssetId() != null) {
            try {
                Asset asset = assetService.getAssetById(event.getAssetId(), event.getUserId());
                BigDecimal currentValue = asset.getValue();
                BigDecimal newAmount = event.getAmount();

                if (event.getType() == Transaction.TransactionType.INCOME) {
                    asset.setValue(currentValue.add(newAmount));
                } else if (event.getType() == Transaction.TransactionType.EXPENSE) {
                    asset.setValue(currentValue.subtract(newAmount));
                }

                assetService.updateAsset(asset.getId(), asset, event.getUserId());
                log.info("Asset '{}' updated successfully to {}", asset.getName(), asset.getValue());
            } catch (Exception e) {
                log.error("Failed to update asset after transaction event", e);
            }
        }
    }
}
