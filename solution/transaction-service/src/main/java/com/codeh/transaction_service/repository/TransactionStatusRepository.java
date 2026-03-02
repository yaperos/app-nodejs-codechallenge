package com.codeh.transaction_service.repository;

import com.codeh.transaction_service.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TransactionStatusRepository extends JpaRepository<TransactionStatus, Long> {

    Optional<TransactionStatus> findByName(String name);

}