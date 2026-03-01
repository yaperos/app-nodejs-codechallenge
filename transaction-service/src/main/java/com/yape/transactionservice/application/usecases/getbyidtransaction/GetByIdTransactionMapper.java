package com.yape.transactionservice.application.usecases.getbyidtransaction;

import com.yape.transactionservice.domain.enums.TransferType;
import com.yape.transactionservice.domain.models.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = {TransferType.class})
public interface GetByIdTransactionMapper {
    @Mapping(target = "transactionType", expression = "java(new GetByIdTransactionResponse.TransactionTypeDto(TransferType.getNameById(transaction.getTransferTypeId())))")
    @Mapping(target = "transactionStatus", expression = "java(new GetByIdTransactionResponse.TransactionStatusDto(transaction.getStatus().name()))")
    GetByIdTransactionResponse toDTO(Transaction transaction);

}
