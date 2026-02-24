package pe.yape.transactions.infrastructure.antifraud;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import pe.yape.transactions.domain.event.TransactionCreatedEvent;
import pe.yape.transactions.infrastructure.antifraud.dto.AntifraudDecision;

@Component
public class AntifraudClient {

    private final RestClient restClient;

    public AntifraudClient(@Value("${antifraud.base-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public AntifraudDecision validate(TransactionCreatedEvent event) {
        return restClient.post()
                .uri("/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(event)
                .retrieve()
                .body(AntifraudDecision.class);
    }
}