package com.pe.yape.service.challenge.transactions.service.impl;

import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import com.pe.yape.service.challenge.transactions.exception.handler.ApiException;
import com.pe.yape.service.challenge.transactions.mapper.TransactionMapper;
import com.pe.yape.service.challenge.transactions.repository.TransactionRepository;
import com.pe.yape.service.challenge.transactions.service.SearchTransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
public class SearchTransactionServiceImpl implements SearchTransactionService {

    private final TransactionRepository transactionRepository;

    private final TransactionMapper transactionMapper;

    public SearchTransactionServiceImpl(TransactionRepository transactionRepository,
                                        TransactionMapper transactionMapper) {
        this.transactionRepository = transactionRepository;
        this.transactionMapper = transactionMapper;
    }

    @Override
    public Mono<TransactionResponse> search(String transactionId) {
        return transactionRepository.findById(UUID.fromString(transactionId))
                .switchIfEmpty(Mono.error(new ApiException(404,String.format("Recurso %s no existe", transactionId))))
                .map(transactionMapper::toResponse);
    }
}
