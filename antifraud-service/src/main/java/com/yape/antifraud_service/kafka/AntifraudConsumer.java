package com.yape.antifraud_service.kafka;

import com.yape.antifraud_service.business.AntifraudBusiness;
import com.yape.antifraud_service.dto.TransactionEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AntifraudConsumer {

    private final AntifraudBusiness antifraudBusiness;

    @KafkaListener(topics = "transaction.created", groupId = "antifraud-group")
    public void onTransactionCreated(TransactionEventDto event) {
        log.info("Evento recibido de transaction.created: {}", event);
        antifraudBusiness.evaluate(event);
    }
}