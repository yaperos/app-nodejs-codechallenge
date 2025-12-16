package com.yape.challenge.adapter.out.persistence.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
public class TransactionRepositoryResponse {
    private UUID transactionId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private String status;
    private BigDecimal value;
    private OffsetDateTime createAt;
}
