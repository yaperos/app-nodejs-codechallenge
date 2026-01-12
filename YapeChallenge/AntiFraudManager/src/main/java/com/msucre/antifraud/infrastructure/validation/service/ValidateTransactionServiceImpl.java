package com.msucre.antifraud.infrastructure.validation.service;

import com.msucre.antifraud.domain.service.ValidateTransactionService;
import com.msucre.shared.model.dto.event.TransactionEventDto;
import org.springframework.stereotype.Service;

@Service
public class ValidateTransactionServiceImpl implements ValidateTransactionService {

  private static final float MAX_ALLOWED_AMOUNT = 1000;

  @Override
  public boolean isValid(final TransactionEventDto transactionEventDto) {
    return transactionEventDto.amount() <= MAX_ALLOWED_AMOUNT;
  }
}