package com.yape.transaction_service.repository;

import com.yape.transaction_service.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionStatusRepository  extends JpaRepository<TransactionStatus, Integer> {

    Optional<TransactionStatus> findFirstByName(String name);

}
