package org.beh.transactionservice.infrastructure.outbox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OutboxRepository extends JpaRepository<OutboxEvent, UUID> {

    /**
     * FOR UPDATE SKIP LOCKED is critical for multi-instance deployments.
     *
     * Without it: instance A and instance B both read the same 100 rows and
     * publish duplicates to Kafka. SKIP LOCKED makes them grab different batches.
     *
     * retry_count < 5 acts as a dead-letter threshold — poison pills won't block the queue.
     */
    @Query(value = """
        SELECT * FROM outbox_events
        WHERE processed = false
          AND retry_count < 5
        ORDER BY created_at ASC
        LIMIT 100
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<OutboxEvent> findUnprocessedEventsForUpdate();
}
