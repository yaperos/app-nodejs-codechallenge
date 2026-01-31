package com.devpull.transactionservice.application.port.in;

import com.devpull.transactionservice.application.dto.command.CreateAccountCommand;
import com.devpull.transactionservice.application.dto.result.AccountResult;
import reactor.core.publisher.Mono;

public interface CreateAccountUseCase {
    Mono<AccountResult> createAccount(CreateAccountCommand command);
}
