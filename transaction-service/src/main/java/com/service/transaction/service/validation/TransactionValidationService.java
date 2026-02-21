package com.service.transaction.service.validation;

import com.service.transaction.model.entity.Transaction;
import com.service.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionValidationService<br/>
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
@Service
@RequiredArgsConstructor
public class TransactionValidationService {

  private final TransactionRepository transactionRepository;

  public Mono<Transaction> checkIfExists(UUID transactionExternalId) {
    return transactionRepository.findByTransactionExternalId(transactionExternalId)
        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Transaction not found")));
  }

}