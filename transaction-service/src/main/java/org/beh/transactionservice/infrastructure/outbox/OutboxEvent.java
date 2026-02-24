package org.beh.transactionservice.infrastructure.outbox;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Transactional Outbox Pattern.
 *
 * Problem it solves: if we save the Transaction and then crash before publishing to Kafka,
 * the event is lost. If we publish to Kafka first and then crash before saving to DB,
 * we have an event with no corresponding data.
 *
 * Solution: write the outbox event in the SAME DB transaction as the business data.
 * A background poller then reliably publishes it to Kafka and marks it processed.
 * This gives us at-least-once delivery with no distributed transaction needed.
 */
@Entity
@Table(name = "outbox_events", indexes = {
    @Index(name = "idx_outbox_unprocessed", columnList = "processed, created_at"),
    @Index(name = "idx_outbox_aggregate", columnList = "aggregate_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "aggregate_id", nullable = false)
    private String aggregateId;

    @Column(name = "aggregate_type", nullable = false, length = 100)
    private String aggregateType;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    @Builder.Default
    private boolean processed = false;

    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private int retryCount = 0;

    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    public void markProcessed() {
        this.processed = true;
        this.processedAt = LocalDateTime.now();
    }

    public void markFailed(String error) {
        this.retryCount++;
        this.lastError = error;
    }
}
