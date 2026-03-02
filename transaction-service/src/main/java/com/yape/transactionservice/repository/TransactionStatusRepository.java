package com.yape.transactionservice.repository;

import com.yape.transactionservice.entity.Transaction;
import com.yape.transactionservice.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionStatusRepository extends JpaRepository<TransactionStatus, Long> {
}
