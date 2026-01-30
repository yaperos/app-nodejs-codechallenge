package com.yape.services.transaction.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Domain model representing a transaction.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
  private Long transactionId;
  private UUID transactionExternalId;
  private UUID accountExternalIdDebit;
  private UUID accountExternalIdCredit;
  private Integer transferTypeId;
  private Integer transactionStatusId;
  private BigDecimal value;
  private LocalDateTime createdAt;
}
