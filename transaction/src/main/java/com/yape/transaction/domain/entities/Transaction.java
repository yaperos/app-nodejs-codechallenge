package com.yape.transaction.domain.entities;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "transactions")
public class Transaction {
    @Id
    private Long id;

    @Version
    @Column("version")
    private Long version;

    @Column("transaction_external_id")
    private String transactionExternalId;

    @Column("account_external_id_debit")
    private String accountExternalIdDebit;

    @Column("account_external_id_credit")
    private String accountExternalIdCredit;

    @Column("type")
    private String type;

    @Column("status")
    private String status;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Column("value")
    private BigDecimal value;
}
