package com.service.transaction.service;

import com.service.transaction.integration.KafkaProducer;
import com.service.transaction.integration.event.TransactionCreatedEvent;
import com.service.transaction.model.enums.TransactionStatusEnum;
import com.service.transaction.model.mapper.TransactionMapper;
import com.service.transaction.model.request.TransactionCreateRequest;
import com.service.transaction.model.response.TransactionCreateResponse;
import com.service.transaction.model.response.TransactionListResponse;
import com.service.transaction.repository.TransactionRepository;
import com.service.transaction.service.validation.TransactionValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionService<br/>
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
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final KafkaProducer kafkaProducer;
  private final TransactionValidationService transactionValidationService;
  private final CacheService cacheService;
  private final TransactionMapper transactionMapper;

  public Mono<ResponseEntity<TransactionCreateResponse>> create(TransactionCreateRequest request) {
    return transactionRepository.save(transactionMapper.mapToEntity(request))
        .flatMap(created ->
            cacheService.save(created)
                .thenReturn(created)
        ).flatMap(created -> {
          TransactionCreateResponse response = transactionMapper.mapToCreateResponse(created);
          TransactionCreatedEvent event = TransactionCreatedEvent.builder()
              .transactionExternalId(response.getTransactionExternalId())
              .value(response.getTransactionAmount())
              .build();
          return kafkaProducer.publishTransactionCreated(event)
              .thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(response));
        });
  }

  public Mono<TransactionListResponse> findByTransactionExternalId(UUID transactionExternalId) {
    return cacheService.findById(transactionExternalId)
        .switchIfEmpty(
            transactionValidationService.checkIfExists(transactionExternalId)
                .flatMap(transaction ->
                    cacheService.save(transaction)
                        .thenReturn(transaction))
        ).map(transactionMapper::mapDetailResponse);
  }

  public Mono<Void> updateStatus(UUID transactionExternalId, TransactionStatusEnum status) {
    return transactionValidationService.checkIfExists(transactionExternalId)
        .flatMap(transaction -> {
          transaction.setStatus(status);
          return transactionRepository.save(transaction)
              .flatMap(saved -> cacheService.evict(transactionExternalId));
        });
  }

}