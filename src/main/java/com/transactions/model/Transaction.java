package com.transactions.model;

import com.transactions.model.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "transaction_external_id", unique = true)
  private UUID transactionExternalId;

  @Column(name = "account_external_id_debit")
  private UUID accountExternalIdDebit;

  @Column(name = "account_external_id_credit")
  private UUID accountExternalIdCredit;

  @Column(name = "transfer_type_id")
  private Integer transferTypeId;

  @Column(name = "transaction_value", precision = 10, scale = 2)
  private BigDecimal transactionValue;

  @Enumerated(EnumType.STRING)
  private TransactionStatus status;

  @Column(name = "rejection_reason")
  private String rejectionReason;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    if (transactionExternalId == null) {
      transactionExternalId = UUID.randomUUID();
    }
    if (status == null) {
      status = TransactionStatus.PENDING;
    }
  }
}