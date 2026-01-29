package com.tec.yape.transaction.application.mapper;

import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import com.tec.yape.transaction.domain.model.TransactionStatus;
import com.tec.yape.transaction.domain.model.TransactionType;
import com.tec.yape.transaction.infrastructure.rest.dto.request.TransactionRequestDto;
import com.tec.yape.transaction.infrastructure.rest.dto.response.TransactionResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE,
        imports = {TransactionStatus.class, TransactionType.class})
public interface TransactionUseCaseMapper {

    TransactionUseCaseMapper MAPPER = Mappers.getMapper(TransactionUseCaseMapper.class);

    TransactionRequest toTransactionRequest(TransactionRequestDto requestDto);


    TransactionRequest toTransactionResponse(TransactionResponse transactionResponse);


    @Mapping(
            target = "transactionStatus",
            expression = "java(new TransactionStatus(transaction.getTransactionStatus().name()))"
    )
    @Mapping(
            target = "transactionType",
            expression = "java(new TransactionType(\"TRANSFER\"))"
    )
    TransactionResponseDto toTransactionResponseDto(TransactionResponse transaction);
}
