package com.tec.yape.transaction.domain.port.input;

import com.tec.yape.transaction.infrastructure.rest.dto.request.TransactionRequestDto;
import com.tec.yape.transaction.infrastructure.rest.dto.response.TransactionResponseDto;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TransactionInPort {

    TransactionResponseDto registerTransaction(TransactionRequestDto transactionRequestDto);

    Page<TransactionResponseDto> findAllPageable(
            @ParameterObject Pageable pageable);

    List<TransactionResponseDto> findAll();


    TransactionResponseDto findByExternalId(UUID transactionExternalId);

}
