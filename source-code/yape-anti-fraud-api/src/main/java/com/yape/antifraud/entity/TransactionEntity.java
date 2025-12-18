package com.yape.antifraud.entity;

import com.yape.antifraud.domain.TransactionStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions", schema = "dbo")
@Data
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_external_id", nullable = false, unique = true)
    private UUID transactionExternalId;

    @Column(name = "account_external_id_debit", nullable = false, length = 36)
    private String accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false, length = 36)
    private String accountExternalIdCredit;

    @Column(name = "transaction_type_id", nullable = false)
    private Integer transactionTypeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false, length = 20)
    private TransactionStatus transactionStatus;

    @Column(name = "value", nullable = false, precision = 18, scale = 2)
    private BigDecimal value;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
