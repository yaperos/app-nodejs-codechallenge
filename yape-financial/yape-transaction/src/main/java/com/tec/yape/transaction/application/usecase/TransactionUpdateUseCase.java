package com.tec.yape.transaction.application.usecase;

import com.tec.yape.transaction.application.mapper.TransactionUseCaseMapper;
import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import com.tec.yape.transaction.domain.model.TransactionValidatedEvent;
import com.tec.yape.transaction.domain.port.input.TransactionUpdateInPort;
import com.tec.yape.transaction.domain.port.output.TransactionOutPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionUpdateUseCase implements TransactionUpdateInPort {

    private final TransactionOutPort transactionOutPort;

    @Override
    public void updateTransactionStatus(TransactionValidatedEvent event) {
        log.info("[TransactionUpdateUseCase] Updating transaction {}", event.transactionExternalId());

        TransactionResponse responseDto = transactionOutPort.findByExternalId(event.transactionExternalId());

        TransactionRequest transactionRequest = TransactionUseCaseMapper.MAPPER.toTransactionResponse(responseDto);

        transactionRequest.setTransactionStatus(event.status());

        transactionOutPort.update(transactionRequest);

        log.info("[TransactionUpdateUseCase] Transaction {} updated to {}", transactionRequest.getTransactionExternalId(), transactionRequest.getTransactionStatus());
    }
}