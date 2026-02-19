package com.yape.yape.infrastructure.adapter.out.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEntity {

    @Id
    @Column(name = "transaction_external_id", nullable = false)
    private UUID transactionExternalId;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    @Column(name = "transfer_type_id", nullable = false)
    private Integer transferTypeId;

    @Column(name = "value", nullable = false, precision = 18, scale = 2)
    private BigDecimal value;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}
