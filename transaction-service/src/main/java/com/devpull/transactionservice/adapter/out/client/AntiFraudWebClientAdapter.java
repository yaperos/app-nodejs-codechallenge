package com.devpull.transactionservice.adapter.out.client;

import com.devpull.transactionservice.adapter.out.client.dto.TransactionCreatedEvent;
import com.devpull.transactionservice.adapter.out.client.mapper.AntiFraudEventMapper;
import com.devpull.transactionservice.application.port.out.AntiFraudPort;
import com.devpull.transactionservice.domain.model.Transaction;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class AntiFraudWebClientAdapter implements AntiFraudPort {

    private final WebClient webClient;

    public AntiFraudWebClientAdapter(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public Mono<String> send(Transaction tx) {
        TransactionCreatedEvent event = AntiFraudEventMapper.toCreatedEvent(tx);

        return webClient.post()
                .uri("http://localhost:8081/api/v1/antifraud")
                .bodyValue(event)
                .retrieve()
                .bodyToMono(String.class);
    }
}
