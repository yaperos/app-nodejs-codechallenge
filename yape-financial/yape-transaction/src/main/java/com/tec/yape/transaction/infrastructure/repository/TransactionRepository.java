package com.tec.yape.transaction.infrastructure.repository;

import com.tec.yape.transaction.infrastructure.repository.model.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    @Query("select t from TransactionEntity t where t.transactionExternalId=:transactionExternalId")
    TransactionEntity findByTransactionExternalId(UUID transactionExternalId);
}

