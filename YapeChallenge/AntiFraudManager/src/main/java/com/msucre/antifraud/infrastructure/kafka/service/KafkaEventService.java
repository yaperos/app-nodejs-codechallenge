package com.msucre.antifraud.infrastructure.kafka.service;


import com.msucre.antifraud.domain.service.EventService;
import com.msucre.shared.model.kafka.KafkaSharedConstants;
import com.msucre.shared.model.dto.event.TransactionEventDto;
import com.msucre.shared.model.dto.event.TransactionEventResponseDto;
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

  private final ReactiveKafkaProducerTemplate<String, TransactionEventResponseDto> kafkaProducerTemplate;

  private final ReactiveKafkaConsumerTemplate<String, TransactionEventDto> kafkaConsumerTemplate;

  public KafkaEventService(ReactiveKafkaProducerTemplate<String, TransactionEventResponseDto> kafkaProducerTemplate,
                           ReactiveKafkaConsumerTemplate<String, TransactionEventDto> kafkaConsumerTemplate) {
    this.kafkaProducerTemplate = kafkaProducerTemplate;
    this.kafkaConsumerTemplate = kafkaConsumerTemplate;
  }

  @Override
  public Mono<Void> sendTransactionEventResponse(final TransactionEventResponseDto transactionEventResponseDto) {
    return kafkaProducerTemplate.send(KafkaSharedConstants.EVENT_RESPONSE_TOPIC, transactionEventResponseDto).doOnSuccess(
        unused -> logger.debug("Sending response: [{} - {}]", transactionEventResponseDto.transactionId(),
            transactionEventResponseDto.isValid())).then();
  }

  @Override
  public Flux<TransactionEventDto> consumeTransactionEvents() {
    return kafkaConsumerTemplate.receiveAutoAck().map(ConsumerRecord::value).doOnNext(
            transactionEvent -> logger.debug("Transaction received: {} - {}", transactionEvent.transactionId(),
                transactionEvent.amount()))
        .onErrorContinue((throwable, o) -> logger.error("Error while consuming transaction event", throwable));
  }
}