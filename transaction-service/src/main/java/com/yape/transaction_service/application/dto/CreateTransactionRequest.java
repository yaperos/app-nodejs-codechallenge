package com.yape.transaction_service.application.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private BigDecimal value;

}
