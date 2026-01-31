package com.devpull.transactionservice.adapter.out.persistence.adapter;

import com.devpull.transactionservice.adapter.out.persistence.mapper.AccountPersistenceMapper;
import com.devpull.transactionservice.adapter.out.persistence.repository.R2dbcAccountRepository;
import com.devpull.transactionservice.application.port.out.AccountRepositoryPort;
import com.devpull.transactionservice.domain.model.Account;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class AccountRepositoryAdapter implements AccountRepositoryPort {

    private final R2dbcAccountRepository repository;

    public AccountRepositoryAdapter(R2dbcAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public Mono<Account> save(Account account) {
        return repository
                .save(AccountPersistenceMapper.toEntity(account))
                .map(AccountPersistenceMapper::toDomain);
    }

    @Override
    public Mono<Account> findById(UUID id) {
        return repository
                .findById(id)
                .map(AccountPersistenceMapper::toDomain);
    }
}
