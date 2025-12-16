package com.yape.challenge.adapter.out;

import com.yape.challenge.adapter.out.kafka.AntiFraudProducer;
import com.yape.challenge.adapter.out.mapper.AntiFraudMessageMapper;
import com.yape.challenge.domain.model.ValidateTransactionEvent;
import com.yape.challenge.domain.port.out.AntiFraudProducerPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AntiFraudMessagingAdapter implements AntiFraudProducerPort {
    private final AntiFraudProducer kafkaProducerMessage;
    private final AntiFraudMessageMapper antiFraudMessageMapper;

    @Override
    public Mono<Void> sendValidationResult(ValidateTransactionEvent status) {
        return Mono.fromRunnable(() ->  kafkaProducerMessage
                .sendTransactionEvent(antiFraudMessageMapper.toValidate(status)));
    }
}
