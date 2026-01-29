package com.tec.yape.transaction.infrastructure.repository.model.entity;


import com.tec.yape.transaction.domain.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Data
@Table(name = "transacciones")
public class TransactionEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID transactionExternalId;

    private UUID accountExternalIdDebit;

    private UUID accountExternalIdCredit;

    private Integer transferTypeId;

    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;

    private LocalDateTime createdAt;
}
