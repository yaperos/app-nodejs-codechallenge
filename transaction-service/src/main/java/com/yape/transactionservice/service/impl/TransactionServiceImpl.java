package com.yape.transactionservice.service.impl;

import com.yape.transactionservice.dto.request.CreateTransactionRequest;
import com.yape.transactionservice.dto.response.TransactionResponse;
import com.yape.transactionservice.dto.response.ValidateAntiFraudTransactionResponse;
import com.yape.transactionservice.entity.Transaction;
import com.yape.transactionservice.entity.TransactionStatus;
import com.yape.transactionservice.entity.TransactionType;
import com.yape.transactionservice.repository.TransactionRepository;
import com.yape.transactionservice.repository.TransactionStatusRepository;
import com.yape.transactionservice.repository.TransactionTypeRepository;
import com.yape.transactionservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final TransactionStatusRepository transactionStatusRepository;

    TransactionType transactionType;
    TransactionStatus transactionStatus;


    @Override
    public TransactionResponse getTransaction(BigInteger id) {
        Transaction transaction = new Transaction();
        transaction = transactionRepository
                .findById(id.longValue())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transactionType = transactionTypeRepository
                .findById(transaction.getTransactionType().getId())
                .orElseThrow(() -> new RuntimeException("TransactionType not found"));
        transactionStatus = transactionStatusRepository
                .findById(transaction.getTransactionStatus().getId())
                .orElseThrow(() -> new RuntimeException("TransactionType not found"));

        TransactionResponse response = new TransactionResponse();
        response.setTransactionExternalId(transaction.getTransactionExternalId());
        response.setTransactionType(transactionType);
        response.setTransactionStatus(transactionStatus);
        response.setAmount(transaction.getAmount());
        response.setCreatedAt(transaction.getCreatedAt());

        return response;
    }

    @Override
    public TransactionResponse saveTransaction(CreateTransactionRequest request) {

        Transaction transaction = new Transaction();
        transaction.setAccountExternalIdDebit(request.getAccountExternalIdDebit());
        transaction.setAccountExternalIdCredit(request.getAccountExternalIdCredit());

        transactionType = transactionTypeRepository
                .findById(request.getTranferTypeId())
                .orElseThrow(() -> new RuntimeException("TransactionType not found"));
        transaction.setTransactionType(transactionType);

        transactionStatus = transactionStatusRepository
                .findById(1L)
                .orElseThrow(() -> new RuntimeException("TransactionStatus not found"));
        transaction.setTransactionStatus(transactionStatus);

        transaction.setAmount(request.getAmount());
        transaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(transaction);


        TransactionResponse response = new TransactionResponse();
        response.setTransactionExternalId(transaction.getTransactionExternalId());
        response.setTransactionType(transactionType);
        response.setTransactionStatus(transactionStatus);
        response.setAmount(transaction.getAmount());
        response.setCreatedAt(transaction.getCreatedAt());

        return response;
    }

    @Override
    public ValidateAntiFraudTransactionResponse validateTransaction(BigInteger id) {

        Transaction transaction = transactionRepository
                .findById(id.longValue())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Permutación de estados (Aprobado o Rechazado)
        Long statusId = (long) ThreadLocalRandom.current().nextInt(2, 4);

        TransactionStatus status = transactionStatusRepository
                .findById(statusId)
                .orElseThrow();

        transaction.setTransactionStatus(status);

        transactionRepository.save(transaction);

        ValidateAntiFraudTransactionResponse response = new ValidateAntiFraudTransactionResponse();
        response.setSuccess(statusId == 2);
        response.setTransaction(transaction);

        return response;
    }
}
