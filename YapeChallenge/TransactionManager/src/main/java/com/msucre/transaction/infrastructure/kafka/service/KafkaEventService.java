package com.msucre.transaction.infrastructure.kafka.service;


import com.msucre.transaction.domain.service.EventService;
import com.msucre.shared.model.dto.event.TransactionEventDto;
import com.msucre.shared.model.dto.event.TransactionEventResponseDto;
import com.msucre.shared.model.kafka.KafkaSharedConstants;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class KafkaEventService implements EventService {

  private static final Logger logger = LoggerFactory.getLogger(KafkaEventService.class);

  private final ReactiveKafkaProducerTemplate<String, TransactionEventDto> kafkaProducerTemplate;

  private final ReactiveKafkaConsumerTemplate<String, TransactionEventResponseDto> kafkaConsumerTemplate;

  public KafkaEventService(ReactiveKafkaProducerTemplate<String, TransactionEventDto> kafkaProducerTemplate,
                           ReactiveKafkaConsumerTemplate<String, TransactionEventResponseDto> kafkaConsumerTemplate) {
    this.kafkaProducerTemplate = kafkaProducerTemplate;
    this.kafkaConsumerTemplate = kafkaConsumerTemplate;
  }

  @Override
  public Mono<Void> sendTransactionEvent(final TransactionEventDto transactionEventDto) {
    return kafkaProducerTemplate.send(KafkaSharedConstants.EVENT_TOPIC, transactionEventDto).doOnSuccess(
        unused -> logger.debug("Sending event: [{} - {}]", transactionEventDto.transactionId(),
            transactionEventDto.amount())).then();
  }

  @Override
  public Flux<TransactionEventResponseDto> consumeTransactionEventResponses() {
    return kafkaConsumerTemplate.receiveAutoAck().map(ConsumerRecord::value).doOnNext(
            transactionEventResponse -> logger.debug("Transaction validated: {} - {}",
                transactionEventResponse.transactionId(),
                transactionEventResponse.isValid()))
        .onErrorContinue((throwable, o) -> logger.error("Error while consuming transaction event", throwable));
  }
}