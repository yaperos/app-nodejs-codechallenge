package com.yape.transaction.service;

import com.yape.transaction.cosntant.TransactStatus;
import com.yape.transaction.domain.Transaction;
import com.yape.transaction.dto.TransactionInput;
import com.yape.transaction.event.FraudResultEvent;
import com.yape.transaction.event.TransactionEvent;
import com.yape.transaction.graph.GraphService;
import com.yape.transaction.messaging.TransactionPublisher;
import com.yape.transaction.node.TransactionNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionPublisher transactionPublisher;
    private final GraphService graphService;

    public Mono<Transaction> createTransaction(TransactionInput input) {
        Transaction tx = Transaction.builder()
                .id(UUID.randomUUID().toString())
                .accountExternalIdDebit(input.getAccountExternalIdDebit())
                .accountExternalIdCredit(input.getAccountExternalIdCredit())
                .transferTypeId(input.getTransferTypeId())
                .value(input.getValue())
                .status(TransactStatus.PENDING.name())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return graphService.saveTransaction(tx)
                .flatMap(saved -> {
                    TransactionEvent event = TransactionEvent.builder()
                            .transactionId(tx.getId())
                            .accountExternalIdDebit(tx.getAccountExternalIdDebit())
                            .accountExternalIdCredit(tx.getAccountExternalIdCredit())
                            .transferTypeId(tx.getTransferTypeId())
                            .value(tx.getValue())
                            .createdAt(LocalDateTime.now())
                            .build();
                    return transactionPublisher.publish(event).thenReturn(tx);
                });
    }

    public Mono<Transaction> findById(String id) {
        return graphService.findTransactionById(id)
                .map(node -> Transaction.builder()
                        .id(node.getTransactionId())
                        .accountExternalIdDebit(node.getAccountExternalIdDebit())
                        .accountExternalIdCredit(node.getAccountExternalIdCredit())
                        .transferTypeId(node.getTransferTypeId())
                        .value(node.getValue())
                        .status(node.getStatus())
                        .createdAt(node.getCreatedAt())
                        .updatedAt(node.getUpdatedAt())
                        .build()
                );
    }

    public Mono<Transaction> updateStatus(FraudResultEvent fraudResult) {
        return graphService.applyFraudResult(fraudResult)
                .map(node -> Transaction.builder()
                        .id(node.getTransactionId())
                        .status(node.getStatus())
                        .updatedAt(node.getUpdatedAt())
                        .build()
                );
    }

    public Flux<TransactionNode> getAccountTransactions(String accountId, int limit) {
        return graphService.getAccountTransactions(accountId, limit);
    }
}
