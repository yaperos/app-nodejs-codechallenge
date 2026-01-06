package com.desafio.yape.repository;

import com.desafio.yape.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionStatusRepository extends JpaRepository<TransactionStatus, Long> {
    Optional<TransactionStatus> findByName(String name);
}
