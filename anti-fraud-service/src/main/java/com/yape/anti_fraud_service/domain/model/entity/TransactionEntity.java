package com.yape.anti_fraud_service.domain.model.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("transactions_yape")
public class TransactionEntity {

    @Id
    private UUID id;

    @Column("transaction_external_id")
    private UUID transactionExternalId;

    @Column("account_external_id_debit")
    private UUID accountExternalIdDebit;

    @Column("account_external_id_credit")
    private UUID accountExternalIdCredit;

    @Column("transfer_type_id")
    private Integer transferTypeId;

    @Column("status")
    private String status;

    @Column("value")
    private BigDecimal value;

    @Column("created_at")
    private LocalDateTime createdAt;

}
