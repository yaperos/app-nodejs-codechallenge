package com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.entity;

import com.yaperos.codechallenge.transaction.domain.model.TransactionStatus;
import com.yaperos.codechallenge.transaction.domain.model.TransferType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionJpaEntity {

    @Id
    private UUID transactionExternalId;

    @Column(nullable = false)
    private UUID accountExternalIdDebit;

    @Column(nullable = false)
    private UUID accountExternalIdCredit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferType transferType;

    @Column(name = "\"value\"", nullable = false)
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

}
