package com.msucre.transaction.infrastructure.postgresql.repository;

import com.msucre.transaction.infrastructure.postgresql.entity.TransactionEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionEntityRepository extends ReactiveCrudRepository<TransactionEntity, UUID> {

}
