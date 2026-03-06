package com.joma.antifraud.adapter;

import com.joma.antifraud.entity.Transaction;
import com.joma.antifraud.service.AFraudService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class AntiFraudConsumer {
    private static final Logger log = LoggerFactory.getLogger(AntiFraudConsumer.class);

    private final ObjectMapper objectMapper;
    private final AFraudService fraudService;

    public AntiFraudConsumer(ObjectMapper objectMapper, AFraudService fraudService) {
        this.objectMapper = objectMapper;
        this.fraudService = fraudService;
    }


    @KafkaListener(topics = "transaction-topic", groupId = "antifraud-group", autoStartup = "true")
    public void consume(String message) {
        try {
            Transaction eventMessage = objectMapper.readValue(message, Transaction.class);
            fraudService.processTransaction(eventMessage).subscribe();

        } catch (Exception e) {
            log.error("Error en lectura de mensajes: {}", e.toString());
        }
    }
}
