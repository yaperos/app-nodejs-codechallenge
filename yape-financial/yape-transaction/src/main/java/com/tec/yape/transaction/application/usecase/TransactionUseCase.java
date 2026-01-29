package com.tec.yape.transaction.application.usecase;


import com.tec.yape.transaction.application.mapper.TransactionUseCaseMapper;
import com.tec.yape.transaction.domain.enums.TransactionStatus;
import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionCreatedEvent;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import com.tec.yape.transaction.domain.port.output.TransactionEventPublisherOutPort;
import com.tec.yape.transaction.infrastructure.rest.dto.request.TransactionRequestDto;
import com.tec.yape.transaction.infrastructure.rest.dto.response.TransactionResponseDto;
import com.tec.yape.transaction.domain.port.input.TransactionInPort;
import com.tec.yape.transaction.domain.port.output.TransactionOutPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionUseCase implements TransactionInPort {

    private final TransactionOutPort transactionOutPort;
    private final TransactionEventPublisherOutPort eventPublisherOutPort;

    @Override
    public TransactionResponseDto registerTransaction(TransactionRequestDto request) {
        log.info("[TransactionUseCase] start register transaction");

        TransactionRequest transactionRequest = TransactionUseCaseMapper.MAPPER.toTransactionRequest(request);
        transactionRequest.setTransactionExternalId(UUID.randomUUID());
        transactionRequest.setCreatedAt(LocalDateTime.now());
        transactionRequest.setTransactionStatus(TransactionStatus.PENDIENTE);

        TransactionResponse transactionResponse = transactionOutPort.create(transactionRequest);

        TransactionResponseDto response = TransactionUseCaseMapper.MAPPER.toTransactionResponseDto(transactionResponse);

        TransactionCreatedEvent event = new TransactionCreatedEvent(
                transactionResponse.getTransactionExternalId(),
                transactionResponse.getValue()
        );

        eventPublisherOutPort.publish(event);
        log.info("[TransactionUseCase] end register transaction");
        return response;
    }

    @Override
    public Page<TransactionResponseDto> findAllPageable(Pageable pageable) {
        Page<TransactionResponse> page = transactionOutPort.findAllPageable(pageable);
        return page.map(TransactionUseCaseMapper.MAPPER::toTransactionResponseDto);
    }

    @Override
    public List<TransactionResponseDto> findAll() {
        List<TransactionResponse> transactionResponse = transactionOutPort.findAll();
        return transactionResponse.stream().map(TransactionUseCaseMapper.MAPPER::toTransactionResponseDto).toList();
    }

    @Override
    public TransactionResponseDto findByExternalId(UUID transactionExternalId) {
        TransactionResponse transactionResponse = transactionOutPort.findByExternalId(transactionExternalId);
        return TransactionUseCaseMapper.MAPPER.toTransactionResponseDto(transactionResponse);
    }

}
