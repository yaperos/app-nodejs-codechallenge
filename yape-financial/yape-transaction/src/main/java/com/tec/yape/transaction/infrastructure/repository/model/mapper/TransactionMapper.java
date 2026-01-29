package com.tec.yape.transaction.infrastructure.repository.model.mapper;

import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import com.tec.yape.transaction.domain.model.TransactionStatus;
import com.tec.yape.transaction.domain.model.TransactionType;
import com.tec.yape.transaction.infrastructure.repository.model.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE,
        imports = {TransactionStatus.class, TransactionType.class})
public interface TransactionMapper {

    TransactionMapper MAPPER = Mappers.getMapper(TransactionMapper.class);

    TransactionEntity toTransaction(TransactionRequest transactionRequest);

    TransactionResponse toTransactionResponse(TransactionEntity transactionEntity);

}
