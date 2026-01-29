package com.jaragon.solution.repository;

import com.jaragon.solution.model.entity.TransactionEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

  Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}
