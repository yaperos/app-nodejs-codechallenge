package com.yape.transaction_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transaction")
@Getter @Setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "account_external_id_debit", nullable = false, columnDefinition = "uuid")
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false, columnDefinition = "uuid")
    private UUID accountExternalIdCredit;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal transactionAmount;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    // Relación con transaction_type
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfer_type_id")
    private TransactionType transferType;

    // Relación con transaction_status
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private TransactionStatus status;
}