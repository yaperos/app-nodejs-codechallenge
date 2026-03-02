package com.yape.infra.adapter.out.database.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import com.yape.domain.model.TransactionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEntity implements Persistable<UUID> {

    @Id
    private UUID transactionExternalId;

    @Column("account_external_id_debit")
    private UUID accountExternalIdDebit;

    @Column("account_external_id_credit")
    private UUID accountExternalIdCredit;

    @Column("transfer_type_id")
    private Integer transferTypeId;

    @Column("value")
    private BigDecimal value;

    @Column("status")
    private TransactionStatus status;

    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Override
    public UUID getId() { return transactionExternalId; }

    @Override
    public boolean isNew() { return isNew; }

    public TransactionEntity markNotNew() {
        this.isNew = false;
        return this;
    }
}
