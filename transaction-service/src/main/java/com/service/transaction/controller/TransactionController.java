package com.service.transaction.controller;

import com.service.transaction.model.request.TransactionCreateRequest;
import com.service.transaction.model.response.TransactionCreateResponse;
import com.service.transaction.model.response.TransactionListResponse;
import com.service.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionController<br/>
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
@RestController
@RequestMapping("/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

  private final TransactionService transactionService;

  @PostMapping
  public Mono<ResponseEntity<TransactionCreateResponse>> create(
      @Valid @RequestBody TransactionCreateRequest request
  ) {
    return transactionService.create(request);
  }

  @GetMapping("/{transactionExternalId}")
  public Mono<TransactionListResponse> findByTransactionExternalId(
      @PathVariable("transactionExternalId") UUID transactionExternalId
  ) {
    return transactionService.findByTransactionExternalId(transactionExternalId);
  }

}