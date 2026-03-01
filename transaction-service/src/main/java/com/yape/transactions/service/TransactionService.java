package com.yape.transactions.service;

import com.yape.transactions.dto.kafka.TransactionCreated;
import com.yape.transactions.dto.request.TransactionRequest;
import com.yape.transactions.dto.response.TransactionResponse;
import com.yape.transactions.kafka.TransactionProducer;
import com.yape.transactions.mapper.TransactionMapper;
import com.yape.transactions.model.Transaction;
import com.yape.transactions.model.TransactionStatus;

import com.yape.transactions.repository.transaction.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {
    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);
    private final TransactionRepository transactionRepository;
    private final TransactionProducer transactionProducer;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional
    public TransactionResponse create(TransactionRequest request) {
        Transaction transaction = transactionMapper.toEntity(request);
        transaction.setStatus(TransactionStatus.PENDING);
        Transaction saved = transactionRepository.saveAndFlush(transaction);
        transactionProducer.sendToValidation(
                new TransactionCreated(saved.getId(), saved.getValue())
        );
        return transactionMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TransactionResponse getById(UUID id) {
        return transactionRepository.findById(id)
                .map(transactionMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Transaction with id %s not found", id)));
    }

    @Override
    @Transactional
    public void updateStatus(UUID id, TransactionStatus status) {
        Transaction transaction = transactionRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Transaction with id %s not found", id)));
        transaction.setStatus(status);
        transactionRepository.save(transaction);
    }
}
