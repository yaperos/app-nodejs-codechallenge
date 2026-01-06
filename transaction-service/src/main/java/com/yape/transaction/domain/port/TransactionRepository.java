package com.yape.transaction.domain.port;

import com.yape.transaction.domain.model.Transaction;

import java.util.Optional;
import java.util.UUID;

/**
 * Port de salida para persistencia de transacciones (Hexagonal Architecture)
 */
public interface TransactionRepository {

    /**
     * Guarda una transacción
     */
    Transaction save(Transaction transaction);

    /**
     * Busca una transacción por su ID externo
     */
    Optional<Transaction> findByExternalId(UUID transactionExternalId);

    /**
     * Actualiza una transacción existente
     */
    Transaction update(Transaction transaction);
}

