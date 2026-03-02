package com.yape.transaction_service.repository;

import com.yape.transaction_service.model.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Override
    @EntityGraph(attributePaths = {"transferType", "status"})
    Optional<Transaction> findById(UUID id);

}
