package com.yape.antifraud.kafka.models;

import com.yape.antifraud.model.TransactionStatus;

import java.util.UUID;

public record TransactionRespEvent(
  UUID id,
  TransactionStatus status
) {}
