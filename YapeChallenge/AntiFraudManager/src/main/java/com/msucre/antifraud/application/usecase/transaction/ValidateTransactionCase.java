package com.msucre.antifraud.application.usecase.transaction;

import com.msucre.antifraud.domain.service.EventService;
import com.msucre.antifraud.domain.service.ValidateTransactionService;
import com.msucre.shared.model.dto.event.TransactionEventResponseDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class ValidateTransactionCase {

  private final ValidateTransactionService validateTransactionService;

  private final EventService eventService;

  public ValidateTransactionCase(ValidateTransactionService validateTransactionService, EventService eventService) {
    this.validateTransactionService = validateTransactionService;
    this.eventService = eventService;
  }

  @PostConstruct
  private void init() {
    execute().subscribe();
  }

  private Flux<Void> execute() {
    return eventService.consumeTransactionEvents()
        .map(transactionEvent -> {
          boolean isValid = validateTransactionService.isValid(transactionEvent);
          return new TransactionEventResponseDto(transactionEvent.transactionId(),
              isValid);
        })
        .flatMap(eventService::sendTransactionEventResponse);
  }
}