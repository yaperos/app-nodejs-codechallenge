package com.yape.transactionservice.application.usecases.gettransaction;

import com.yape.transactionservice.domain.enums.TransferType;
import com.yape.transactionservice.domain.models.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", imports = {TransferType.class})
public interface GetTransactionMapper {

    @Mapping(target = "transactionType", expression = "java(new GetTransactionResponse.TransactionTypeDto(TransferType.getNameById(transaction.getTransferTypeId())))")
    @Mapping(target = "transactionStatus", expression = "java(new GetTransactionResponse.TransactionStatusDto(transaction.getStatus().name()))")
    GetTransactionResponse ToDTO(Transaction transaction);


    List<GetTransactionResponse> ToDTOs(List<Transaction> transactions);
}
