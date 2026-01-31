package com.devpull.transactionservice.adapter.out.persistence.mapper;

import com.devpull.transactionservice.adapter.out.persistence.entity.AccountEntity;
import com.devpull.transactionservice.domain.model.Account;

import java.time.Instant;

public final class AccountPersistenceMapper {

    private AccountPersistenceMapper() {}

    public static AccountEntity toEntity(Account domain) {
        return AccountEntity.newAccount(domain.getId(),
                                        domain.getAccountStatus(),
                                        domain.getAccountType(),
                                        Instant.now());
    }

    public static Account toDomain(AccountEntity entity) {
        return Account.rehydrate(
                entity.getId(),
                entity.getStatus(),
                entity.getType(),
                entity.getCreatedAt()
        );
    }
}
