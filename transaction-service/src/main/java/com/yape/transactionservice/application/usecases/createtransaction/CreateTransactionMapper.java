package com.yape.transactionservice.application.usecases.createtransaction;

import com.yape.transactionservice.domain.models.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CreateTransactionMapper {

    CreateTransactionResponse ToDto(Transaction model);
}
