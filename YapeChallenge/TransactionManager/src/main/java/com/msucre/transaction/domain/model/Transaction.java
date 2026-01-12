package com.msucre.transaction.domain.model;

import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.model.type.TransactionType;

import java.util.UUID;

public class Transaction {

  public UUID id;

  public UUID sourceAccountId;

  public UUID destinationAccountId;

  public TransactionStatus status;

  public TransactionType type;

  public float amount;

  public Long createdAt;
}
