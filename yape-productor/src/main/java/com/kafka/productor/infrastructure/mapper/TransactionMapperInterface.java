package com.kafka.productor.infrastructure.mapper;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.infrastructure.persistence.entity.TransactionEntity;

public interface TransactionMapperInterface {
    TransactionEntity toEntity(Transaction transaction);

    Transaction toDomain(TransactionEntity entity);
}
