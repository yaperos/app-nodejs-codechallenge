package com.devpull.transactionservice.adapter.out.persistence.repository;

import com.devpull.transactionservice.adapter.out.persistence.entity.AccountEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface R2dbcAccountRepository extends ReactiveCrudRepository<AccountEntity, UUID> {
}
