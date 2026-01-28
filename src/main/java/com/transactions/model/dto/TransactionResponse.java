package com.transactions.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransactionResponse {

  @JsonProperty("transactionExternalId")
  private UUID transactionExternalId;

  @JsonProperty("transactionType")
  private TransactionTypeDTO transactionType;

  @JsonProperty("transactionStatus")
  private TransactionStatusDTO transactionStatus;

  @JsonProperty("value")
  private BigDecimal value;

  @JsonProperty("createdAt")
  private LocalDateTime createdAt;

  @Data
  public static class TransactionTypeDTO {
    private String name;

    public TransactionTypeDTO(Integer typeId) {
      this.name = switch (typeId) {
        case 1 -> "Deposit";
        case 2 -> "Withdrawal";
        case 3 -> "Transfer";
        default -> "Unknown";
      };
    }
  }

  @Data
  public static class TransactionStatusDTO {
    private String name;

    public TransactionStatusDTO(String status) {
      this.name = status;
    }
  }
}