package com.yape.challenge.adapter.out.persistence.mapper;

import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryRequest;
import com.yape.challenge.adapter.out.persistence.model.TransactionRepositoryResponse;
import com.yape.challenge.adapter.out.persistence.model.entity.Transaction;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface TransactionRepositoryMapper {

    Transaction toMapRepository(TransactionModelRepositoryRequest transaction);

    TransactionRepositoryResponse toMapGetTransactionRepository(Transaction transaction);
}
