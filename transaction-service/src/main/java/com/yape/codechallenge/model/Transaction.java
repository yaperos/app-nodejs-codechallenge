package com.yape.codechallenge.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import java.math.BigDecimal;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@jakarta.persistence.Table(name = "transactions")
public class Transaction extends PanacheEntityBase {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    public UUID transactionExternalId;

    public UUID accountExternalIdDebit;
    public UUID accountExternalIdCredit;
    public Integer transferTypeId;
    @Column(precision = 12, scale = 2)
    public BigDecimal value;
    public String status;
    public LocalDateTime createdAt;

    public Transaction() {
    }

    public Transaction(UUID accountDebit, UUID accountCredit, Integer typeId, BigDecimal val) {
        this.accountExternalIdDebit = accountDebit;
        this.accountExternalIdCredit = accountCredit;
        this.transferTypeId = typeId;
        this.value = val;
        this.status = "pending";
        this.createdAt = LocalDateTime.now();
    }
}
