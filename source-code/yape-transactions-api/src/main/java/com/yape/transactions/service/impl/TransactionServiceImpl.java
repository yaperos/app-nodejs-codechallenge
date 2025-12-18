package com.yape.transactions.service.impl;

import com.yape.transactions.builder.TransactionBuilder;
import com.yape.transactions.dto.CreateTransactionRequest;
import com.yape.transactions.dto.TransactionResponse;
import com.yape.transactions.entity.TransactionEntity;
import com.yape.transactions.exception.TransactionException;
import com.yape.transactions.service.TransactionEventPublisher;
import com.yape.transactions.service.TransactionPersistence;
import com.yape.transactions.service.TransactionService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Log4j2
@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionBuilder transactionBuilder;
    private final TransactionPersistence transactionPersistence;
    private final TransactionEventPublisher transactionEventPublisher;

    public TransactionServiceImpl(
            TransactionBuilder transactionBuilder,
            TransactionPersistence transactionPersistence,
            TransactionEventPublisher transactionEventPublisher) {
        this.transactionBuilder = transactionBuilder;
        this.transactionPersistence = transactionPersistence;
        this.transactionEventPublisher = transactionEventPublisher;
    }

    @Override
    public TransactionResponse createTransactionEvent(
            CreateTransactionRequest createTransactionRequest) {
        try {
            TransactionEntity transactionEntity = transactionPersistence.saveTransaction(
                    transactionBuilder.transactionEntityBuilder(createTransactionRequest));

            transactionEventPublisher.createTransactionEvent(
                    transactionBuilder.transactionCreatedEventBuilder(transactionEntity, createTransactionRequest));

            return transactionBuilder.transactionResponseBuilder(transactionEntity);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            log.error(ex.getMessage());
            throw new TransactionException(HttpStatus.SERVICE_UNAVAILABLE, "Transaction service was interrupted");
        } catch (ExecutionException ex) {
            log.error(ex.getMessage());
            throw new TransactionException(HttpStatus.SERVICE_UNAVAILABLE, "Transaction service is unavailable");
        } catch (Exception ex) {
            log.error(ex.getMessage());
            throw ex;
        }
    }

    @Override
    public TransactionResponse readTransaction(UUID transactionExternalId) {
        TransactionEntity transactionEntity =
                transactionPersistence.findByTransactionExternalId(transactionExternalId);
        if (transactionEntity == null) {
            throw new TransactionException(HttpStatus.NOT_FOUND, "Transaction not found" );
        }
        return transactionBuilder.transactionResponseBuilder(transactionEntity);
    }
}
