package com.joma.antifraud.service;

import com.joma.antifraud.commons.TransactionStatus;
import com.joma.antifraud.entity.Transaction;
import com.joma.antifraud.entity.TransactionEventSource;
import com.joma.antifraud.repository.TransactionEventRepo;
import com.joma.antifraud.repository.TransactionRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.reactive.TransactionalOperator;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class AFraudService {

    final private TransactionRepo transRepo;
    final private TransactionEventRepo transRepoEvent;
    private final TransactionalOperator transactionalOperator;

    public AFraudService(TransactionRepo transRepo, TransactionEventRepo transRepoEvent, TransactionalOperator transactionalOperator) {
        this.transRepo = transRepo;
        this.transRepoEvent = transRepoEvent;
        this.transactionalOperator = transactionalOperator;
    }

    /**
     * operacion principal que opera la transaccion, primero insert en tabla read y write, luego evalua y finalmente actualiza estados (aprobado, rechazado)
     * @param message
     * @return
     */
    public Mono<Void> processTransaction(Transaction message) {
        return transactionalOperator.execute(tx ->
                        transRepo.insertTransaction(message)
                                .then(insertEvent(message, 1))
                                .then(evaluateAndUpdate(message)))
                .then();
    }

    /**
     * guarda los eventos en la tabla write, esta tabla sera un repositorio de eventos
     * @param msg
     * @param version
     * @return
     */
    private Mono<Void> insertEvent(Transaction msg, int version) {
        TransactionEventSource event = new TransactionEventSource(
                null,
                msg.transactionExternalId(),
                msg.accountExternalIdDebit(),
                msg.accountExternalIdCredit(),
                msg.transactionName(),
                msg.amount(),
                msg.transactionStatus(),
                version,
                Instant.now()
        );
        return transRepoEvent.save(event).then();
    }

    /**
     * evalua la transaccion y actualiza los estados en la tabla read y write (event sourcing)
     * @param message
     * @return
     */
    private Mono<Void> evaluateAndUpdate(Transaction message) {

        TransactionStatus finalStatus =
                message.amount().compareTo(BigDecimal.valueOf(1000)) > 0
                        ? TransactionStatus.RECHAZADO
                        : TransactionStatus.APROBADO;

        Transaction updated = new Transaction(
                message.transactionExternalId(),
                message.accountExternalIdDebit(),
                message.accountExternalIdCredit(),
                message.transactionName(),
                message.amount(),
                finalStatus.name(),
                message.createdAt()
        );

        return transRepo.save(updated)
                .then(insertEvent(updated, 2));
    }
}
