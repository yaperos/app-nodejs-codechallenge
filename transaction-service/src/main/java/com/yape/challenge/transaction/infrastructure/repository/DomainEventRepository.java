package com.yape.challenge.transaction.infrastructure.repository;

import com.yape.challenge.transaction.domain.entity.DomainEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for DomainEvent persistence
 */
@Repository
public interface DomainEventRepository extends JpaRepository<DomainEvent, Long> {

    /**
     * Find all events for a specific aggregate, ordered by version
     */
    List<DomainEvent> findByAggregateIdOrderByVersionAsc(UUID aggregateId);

    /**
     * Find the last version number for an aggregate
     */
    @Query("SELECT MAX(de.version) FROM DomainEvent de WHERE de.aggregateId = :aggregateId")
    Optional<Integer> findLastVersionByAggregateId(@Param("aggregateId") UUID aggregateId);

    /**
     * Check if an aggregate has any events
     */
    boolean existsByAggregateId(UUID aggregateId);

    /**
     * Find events by aggregate type
     */
    List<DomainEvent> findByAggregateTypeOrderByOccurredAtDesc(String aggregateType);

    /**
     * Find events by event type
     */
    List<DomainEvent> findByEventTypeOrderByOccurredAtDesc(String eventType);

    /**
     * Count events for an aggregate
     */
    long countByAggregateId(UUID aggregateId);
}

