package com.yape.challenge.adapter.out.persistence.model.entity;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Table("transactions")
@Getter
@Setter
@Builder
public class Transaction {
    @Id
    private UUID transactionId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private String status;
    private BigDecimal value;
    @Column("created_at")
    private OffsetDateTime createAt;
    @Column("updated_at")
    private OffsetDateTime updateAt;

}
