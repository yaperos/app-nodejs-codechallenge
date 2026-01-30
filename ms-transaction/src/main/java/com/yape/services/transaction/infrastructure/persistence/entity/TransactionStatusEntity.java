package com.yape.services.transaction.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity class representing a transaction status in the transaction service.
 */
@Entity
@Table(name = "transaction_status")
@Getter
@Setter
public class TransactionStatusEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "transaction_status_id")
  private Integer transactionStatusId;

  @Column(name = "code", unique = true, nullable = false, length = 20)
  private String code;

  @Column(name = "name", nullable = false, length = 50)
  private String name;

}
