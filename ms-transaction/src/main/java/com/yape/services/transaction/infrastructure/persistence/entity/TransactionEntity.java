package com.yape.services.transaction.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Entity class representing a transaction in the database.
 */
@Entity
@Table(name = "transaction")
@Getter
@Setter
public class TransactionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "transaction_id")
  private Integer transactionId;

  @Column(name = "transaction_external_id", nullable = false, unique = true)
  private UUID transactionExternalId;

  @Column(name = "account_external_id_debit", nullable = false)
  private UUID accountExternalIdDebit;

  @Column(name = "account_external_id_credit", nullable = false)
  private UUID accountExternalIdCredit;

  @Column(name = "transfer_type_id", nullable = false)
  private Integer transferTypeId;

  @Column(name = "transaction_status_id", nullable = false)
  private Integer transactionStatusId;

  @Column(nullable = false, precision = 19, scale = 4)
  private BigDecimal value;

  //  @Column(name = "created_at", insertable = false, updatable = false)

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

}
