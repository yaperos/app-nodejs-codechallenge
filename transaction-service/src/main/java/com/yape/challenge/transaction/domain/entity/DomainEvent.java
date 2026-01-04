package com.yape.challenge.transaction.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a domain event in the Event Store
 */
@Entity
@Table(name = "domain_events", indexes = {
        @Index(name = "idx_domain_events_aggregate_id", columnList = "aggregate_id"),
        @Index(name = "idx_domain_events_event_type", columnList = "event_type"),
        @Index(name = "idx_domain_events_occurred_at", columnList = "occurred_at"),
        @Index(name = "idx_domain_events_aggregate_type", columnList = "aggregate_type")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_aggregate_version", columnNames = {"aggregate_id", "version"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aggregate_id", nullable = false)
    private UUID aggregateId;

    @Column(name = "aggregate_type", nullable = false, length = 100)
    private String aggregateType;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "event_data", nullable = false, columnDefinition = "jsonb")
    private String eventData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb")
    private String metadata;

    @Column(name = "version", nullable = false)
    private Integer version;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;
}

