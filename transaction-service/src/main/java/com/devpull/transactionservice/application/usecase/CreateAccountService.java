package com.devpull.transactionservice.application.usecase;

import com.devpull.transactionservice.application.dto.command.CreateAccountCommand;
import com.devpull.transactionservice.application.dto.result.AccountResult;
import com.devpull.transactionservice.application.mapper.AccountApplicationMapper;
import com.devpull.transactionservice.application.port.in.CreateAccountUseCase;
import com.devpull.transactionservice.application.port.out.AccountRepositoryPort;
import com.devpull.transactionservice.domain.exception.BadRequestException;
import com.devpull.transactionservice.domain.model.Account;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CreateAccountService implements CreateAccountUseCase {

    private final AccountRepositoryPort accountRepositoryPort;

    public CreateAccountService(AccountRepositoryPort accountRepositoryPort) {
        this.accountRepositoryPort = accountRepositoryPort;
    }

    @Override
    public Mono<AccountResult> createAccount(CreateAccountCommand command) {

        if (command == null) {
            return Mono.error(new BadRequestException("Request body is required"));
        }
        if (command.accountStatus() == null) {
            return Mono.error(new BadRequestException("accountStatus is required"));
        }
        if (command.accountType() == null) {
            return Mono.error(new BadRequestException("accountType is required"));
        }

            // Domain object creation
            Account account = Account.createNew(command.accountStatus(), command.accountType());

        // Persistence and mapping to result
        return accountRepositoryPort.save(account)
                .map(AccountApplicationMapper::toResult);
    }
}
