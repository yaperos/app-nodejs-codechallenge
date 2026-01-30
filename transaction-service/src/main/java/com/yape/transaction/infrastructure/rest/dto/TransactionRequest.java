package com.yape.transaction.infrastructure.rest.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

@Setter
@Getter
public class TransactionRequest {

  @NotNull(message = "Amount no puede ser null")
  @DecimalMin(value = "0.01", message = "Amount debe ser mayor a 0")
  @DecimalMax(value = "1000000", message = "Amount no puede ser mayor a 1,000,000")
  @Digits(integer = 6, fraction = 2, message = "Amount debe tener como máximo 2 decimales")
  private Double amount;

  public TransactionRequest() {
  }
}
