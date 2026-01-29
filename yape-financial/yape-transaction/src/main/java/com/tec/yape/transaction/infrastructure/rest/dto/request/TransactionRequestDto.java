package com.tec.yape.transaction.infrastructure.rest.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class TransactionRequestDto {

    @NotNull(message = "accountExternalIdDebit is required")
    private UUID accountExternalIdDebit;

    @NotNull(message = "accountExternalIdCredit is required")
    private UUID accountExternalIdCredit;

    @NotNull(message = "transferTypeId is required")
    @Schema(description = "Transfer type identifier", example = "1", defaultValue = "1")
    @JsonProperty("tranferTypeId")
    private Integer transferTypeId;

    @NotNull(message = "value is required")
    private BigDecimal value;


}
