package com.yape.transactionservice.repository;

import com.yape.transactionservice.entity.Transaction;
import com.yape.transactionservice.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionTypeRepository extends JpaRepository<TransactionType, Long> {
}
