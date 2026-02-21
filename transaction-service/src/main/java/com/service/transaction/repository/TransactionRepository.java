package com.service.transaction.repository;

import com.service.transaction.model.entity.Transaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionRepository<br/>
 * Copyright: &copy; 2026.<br/>
 * Company: Yape.<br/>
 *
 * <u>Developed by</u>: <br/>
 * <ul>
 *     <li>Felipe Rosado</li>
 *     <li>February 21, 2026 Creaci&oacute;n de Clase.</li>
 * </ul>
 * @version 1.0
 */
@Repository
public interface TransactionRepository extends ReactiveCrudRepository<Transaction, UUID> {

  Mono<Transaction> findByTransactionExternalId(UUID transactionExternalId);

}