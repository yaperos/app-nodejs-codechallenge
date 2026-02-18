package com.jotace.transaction.infrastructure.config;

import com.jotace.transaction.application.port.out.EventProducerPort;
import com.jotace.transaction.application.port.out.TransactionRepositoryPort;
import com.jotace.transaction.application.service.TransactionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    @Bean
    public TransactionService transactionService(
            TransactionRepositoryPort transactionRepositoryPort,
            EventProducerPort eventProducer) {

        return new TransactionService(transactionRepositoryPort, eventProducer);

    }
}
