package com.yape.transaction_service.repository;

import com.yape.transaction_service.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionTypeRepository extends JpaRepository<TransactionType, Integer>  {
}
