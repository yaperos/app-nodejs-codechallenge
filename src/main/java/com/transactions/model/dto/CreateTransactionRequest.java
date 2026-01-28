package com.transactions.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateTransactionRequest {

  @NotNull(message = "accountExternalIdDebit is required")
  @JsonProperty("accountExternalIdDebit")
  private UUID accountExternalIdDebit;

  @NotNull(message = "accountExternalIdCredit is required")
  @JsonProperty("accountExternalIdCredit")
  private UUID accountExternalIdCredit;

  @NotNull(message = "transferTypeId is required")
  @Min(value = 1, message = "transferTypeId must be at least 1")
  @Max(value = 4, message = "transferTypeId must be at most 4")
  @JsonProperty("transferTypeId")
  private Integer transferTypeId;

  @NotNull(message = "value is required")
  @Positive(message = "value must be positive")
  @Digits(integer = 10, fraction = 2, message = "value must have max 10 integer digits and 2 decimal digits")
  @JsonProperty("value")
  private BigDecimal value;

  // Validación personalizada para el límite de 1000
  public boolean exceedsMaxAmount() {
    return value != null && value.compareTo(new BigDecimal("1000")) > 0;
  }
}