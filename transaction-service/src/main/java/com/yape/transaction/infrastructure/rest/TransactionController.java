package com.yape.transaction.infrastructure.rest;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yape.transaction.application.port.in.TransactionUseCase;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.infrastructure.rest.dto.TransactionRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

  private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

  private final TransactionUseCase useCase;

  public TransactionController(TransactionUseCase useCase) {
    this.useCase = useCase;
  }

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public Transaction create(@RequestBody @Valid TransactionRequest request) {
    log.info("Creando transacción para usuario: {}", request.getAmount());
    return useCase.create(request);
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<Transaction> getAll() {
    log.info("Obteniendo todas las transacciones");
    return useCase.getAllTransactions();
  }

  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public Transaction getById(@PathVariable("id") UUID transactionId) {
    log.info("Buscando transacción con ID: {}", transactionId);
    return useCase.getById(transactionId);
  }
}
