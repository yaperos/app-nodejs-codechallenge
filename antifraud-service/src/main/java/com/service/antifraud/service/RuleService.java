package com.service.antifraud.service;

import com.service.antifraud.integration.KafkaProducer;
import com.service.antifraud.integration.event.TransactionCreatedEvent;
import com.service.antifraud.integration.event.TransactionStatusUpdatedEvent;
import com.service.antifraud.model.enums.TransactionStatusEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

/**
 * <b>Class</b>: RuleService<br/>
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
@Slf4j
@Service
@RequiredArgsConstructor
public class RuleService {

  private static final BigDecimal MAX_ALLOWED_VALUE = new BigDecimal("1000");
  private final KafkaProducer kafkaProducer;

  public Mono<Void> validate(TransactionCreatedEvent event) {
    TransactionStatusEnum status = isRejected(event.getValue())
        ? TransactionStatusEnum.REJECTED : TransactionStatusEnum.APPROVED;
    log.info("Validated rule, status is: {}", status);

    TransactionStatusUpdatedEvent response = TransactionStatusUpdatedEvent.builder()
        .transactionExternalId(event.getTransactionExternalId())
        .status(status)
        .build();
    return kafkaProducer.publishTransactionUpdated(response);
  }

  private boolean isRejected(BigDecimal value) {
    return value.compareTo(MAX_ALLOWED_VALUE) > 0;
  }

}