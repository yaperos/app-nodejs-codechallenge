package org.beh.transactionservice.infrastructure.persistence;

import org.beh.transactionservice.domain.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionTypeJpaRepository extends JpaRepository<TransactionType, Integer> {
}
