package com.yape.payment.transaction.infrastructure.kafka;

import com.yape.payment.transaction.infrastructure.db.entity.OutboxEventEntity;
import com.yape.payment.transaction.infrastructure.db.entity.OutboxEventEntity.OutboxStatus;
import com.yape.payment.transaction.infrastructure.db.repository.OutboxEventJpaRepository;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OutboxPublisherJob {

    private final OutboxEventJpaRepository outboxRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private final int batchSize;

    public OutboxPublisherJob(
            OutboxEventJpaRepository outboxRepository,
            KafkaTemplate<String, String> kafkaTemplate,
            @Value("${outbox.publisher.batch-size:50}") int batchSize) {
        this.outboxRepository = outboxRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.batchSize = batchSize;
    }

    @Scheduled(fixedDelayString = "${outbox.publisher.fixed-delay-ms:1000}")
    @Transactional
    public void publishPendingEvents() {
        List<OutboxEventEntity> events = outboxRepository.findByStatusOrderByCreatedAtAsc(
                OutboxStatus.PENDING,
                PageRequest.of(0, batchSize)
        );

        for (OutboxEventEntity event : events) {
            try {
                kafkaTemplate.send(event.getTopic(), event.getAggregateId().toString(), event.getPayload())
                        .get();

                event.setStatus(OutboxStatus.PUBLISHED);
                event.setPublishedAt(OffsetDateTime.now());
                event.setError(null);
            } catch (Exception ex) {
                event.setStatus(OutboxStatus.FAILED);
                event.setError(ex.getMessage());
            }
            outboxRepository.save(event);
        }
    }
}
