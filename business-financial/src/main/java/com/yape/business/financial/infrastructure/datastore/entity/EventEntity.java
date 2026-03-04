package com.yape.business.financial.infrastructure.datastore.entity;

import io.r2dbc.postgresql.codec.Json;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("event_store")
public class EventEntity {
    @Id
    private Long id;
    @Column("transaction_id")
    private UUID transactionId;
    @Column("event_type")
    private String eventType;
    @Column("payload")
    private Json payload;
    @Column("created_at")
    private Instant createdAt;
}
