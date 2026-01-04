package com.yape.challenge.transaction.infrastructure.repository;

import com.yape.challenge.transaction.domain.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionType, Integer> {

}

