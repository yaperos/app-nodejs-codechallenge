package org.beh.transactionservice.infrastructure.outbox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.transactionservice.infrastructure.kafka.producer.TransactionEventProducer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPoller {

    private final OutboxRepository outboxRepository;
    private final TransactionEventProducer eventProducer;

    /**
     * Polling interval: 500ms is a good balance.
     * Too low: DB pressure. Too high: event latency.
     * In very high-throughput scenarios, consider Debezium CDC instead,
     * which tails the PostgreSQL WAL log rather than polling.
     */
    @Scheduled(fixedDelay = 500)
    @Transactional
    public void pollAndPublish() {
        List<OutboxEvent> events = outboxRepository.findUnprocessedEventsForUpdate();

        if (events.isEmpty()) return;

        log.debug("Processing {} outbox events", events.size());

        for (OutboxEvent event : events) {
            try {
                eventProducer.publish(event.getEventType(), event.getAggregateId(), event.getPayload());
                event.markProcessed();
                log.debug("Outbox event {} published successfully", event.getId());
            } catch (Exception e) {
                event.markFailed(e.getMessage());
                log.error("Failed to publish outbox event {} (attempt {}): {}",
                    event.getId(), event.getRetryCount(), e.getMessage());
            }
        }

        outboxRepository.saveAll(events);
    }
}
