package com.yape.business.financial.infrastructure.datastore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class TransactionEntity {
    @Id
    private Long id;
    @Column("transaction_id")
    private UUID transactionId;
    @Column("account_external_id_debit")
    private String accountExternalIdDebit;
    @Column("account_external_id_credit")
    private String accountExternalIdCredit;
    @Column("transfer_type_id")
    private Integer transferTypeId;
    @Column("value")
    private BigDecimal value;
    @Column("status")
    private String status;
    @Column("created_at")
    private Instant createdAt;

}
