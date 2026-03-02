package com.yape.infra.adapter.out.database.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import com.yape.infra.adapter.out.database.entity.TransactionEntity;

@Repository
public interface TransactionRepository extends R2dbcRepository<TransactionEntity, UUID> {
    
}
