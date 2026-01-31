package com.devpull.transactionservice.application.port.in;

import com.devpull.transactionservice.application.dto.command.CreateTransactionCommand;
import com.devpull.transactionservice.application.dto.result.TransactionResult;
import reactor.core.publisher.Mono;

public interface CreateTransactionUseCase {

    Mono<TransactionResult> create(CreateTransactionCommand command);

}
