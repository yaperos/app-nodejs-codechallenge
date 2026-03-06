package com.joma.antifraud.repository;

import com.joma.antifraud.entity.Transaction;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface TransactionRepo extends ReactiveCrudRepository<Transaction, String> {

    @Query("INSERT INTO transactions (" +
            "transaction_external_id, " +
            "account_external_id_debit, " +
            "account_external_id_credit, " +
            "transaction_name, " +
            "amount, " +
            "transaction_status, " +
            "created_at) " +
            "VALUES (:#{#t.transactionExternalId}, " +
            ":#{#t.accountExternalIdDebit}, " +
            ":#{#t.accountExternalIdCredit}, " +
            ":#{#t.transactionName}, " +
            ":#{#t.amount}, " +
            ":#{#t.transactionStatus}, " +
            ":#{#t.createdAt})")
    Mono<Void> insertTransaction(Transaction t);
}
