package com.yape.antifraud_service.client;

import com.yape.antifraud_service.dto.TransactionUpdateDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
@Slf4j
public class TransactionClient {

    private final RestTemplate restTemplate;
    private final String transactionServiceUrl;

    public TransactionClient(RestTemplate restTemplate,
                             @Value("${transaction.service.url}") String transactionServiceUrl) {
        this.restTemplate = restTemplate;
        this.transactionServiceUrl = transactionServiceUrl;
    }

    public void updateTransactionStatus(UUID transactionId, String status) {
        String url = transactionServiceUrl + "/api/v1/transactions/" + transactionId;
        TransactionUpdateDto body = new TransactionUpdateDto(status);
        log.info("Llamando a transaction-service PUT {} con status {}", url, status);
        restTemplate.put(url, body);
    }
}