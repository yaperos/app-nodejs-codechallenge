package com.transaction.app.application.service;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.domain.port.in.CreateTransactionUseCase;
import com.transaction.app.domain.port.in.GetTransactionUseCase;
import com.transaction.app.infrastructure.controller.dto.TransactionResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class TransactionService {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;


    public TransactionModel create(TransactionModel model) {
       return createTransactionUseCase.create(model);
    }

    public TransactionResponse getByExternalId(UUID externalId){
      return getTransactionUseCase.getByExternalId(externalId);
    }
}
