package com.yape.transactionservice.Infrastructure.persistence.mappers;

import com.yape.transactionservice.Infrastructure.persistence.entities.TransactionEntity;
import com.yape.transactionservice.domain.models.Transaction;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionEntityMapper {

    TransactionEntity toEntity(Transaction transaction);

    Transaction toModel(TransactionEntity entity);

    List<Transaction> toModels(List<TransactionEntity> transactionEntities);
}
