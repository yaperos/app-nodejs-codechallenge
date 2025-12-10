package com.pe.yape.service.challenge.transactions.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.OffsetDateTime;
import java.util.UUID;


@Table(value = "transaction" , schema = "anti_fraud")
@Getter
@Setter
@Builder
public class Transaction {

    @Id
    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private Double value;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;




}
