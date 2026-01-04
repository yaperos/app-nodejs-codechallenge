package com.yape.challenge.transaction.application.handler.query;

import com.yape.challenge.transaction.application.dto.response.TransactionResponse;
import com.yape.challenge.transaction.application.handler.QueryHandler;
import com.yape.challenge.transaction.application.mapper.TransactionMapper;
import com.yape.challenge.transaction.application.query.GetTransactionQuery;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.entity.TransactionType;
import com.yape.challenge.transaction.infrastructure.repository.TransactionRepository;
import com.yape.challenge.transaction.infrastructure.repository.TransactionTypeRepository;
import com.yape.challenge.transaction.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for GetTransactionQuery
 * Implements caching for high volume read optimization
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class GetTransactionQueryHandler implements QueryHandler<GetTransactionQuery, TransactionResponse> {

    private final TransactionRepository transactionRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "transactions", key = "#query.externalId.toString()", unless = "#result == null")
    public TransactionResponse handle(GetTransactionQuery query) {
        log.info("Handling GetTransactionQuery: {} (cache miss)", query);

        Transaction transaction = transactionRepository.findByExternalId(query.getExternalId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        TransactionType transactionType = transactionTypeRepository.findById(transaction.getTransferTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction type not found"));

        return transactionMapper.toResponse(transaction, transactionType);
    }
}

