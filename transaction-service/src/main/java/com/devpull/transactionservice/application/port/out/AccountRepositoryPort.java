package com.devpull.transactionservice.application.port.out;

import com.devpull.transactionservice.domain.model.Account;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface AccountRepositoryPort {

    Mono<Account> save(Account account);

    Mono<Account> findById(UUID id);

}
