package com.msucre.antifraud.domain.service;

import com.msucre.shared.model.dto.event.TransactionEventDto;

public interface ValidateTransactionService {

  boolean isValid(TransactionEventDto transactionEventDto);
}