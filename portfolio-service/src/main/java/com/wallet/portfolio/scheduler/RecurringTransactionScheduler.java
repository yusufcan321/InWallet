package com.wallet.portfolio.scheduler;

import com.wallet.portfolio.service.RecurringTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RecurringTransactionScheduler {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(RecurringTransactionScheduler.class);
    private final RecurringTransactionService recurringService;

    public RecurringTransactionScheduler(RecurringTransactionService recurringService) {
        this.recurringService = recurringService;
    }

    // Her gün gece yarısı çalışır (00:00)
    @Scheduled(cron = "0 0 0 * * ?")
    public void runRecurringTransactions() {
        log.info("Starting scheduled recurring transactions processing...");
        recurringService.processPendingTransactions();
        log.info("Finished scheduled recurring transactions processing.");
    }
}
