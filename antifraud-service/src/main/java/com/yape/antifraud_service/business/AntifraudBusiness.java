package com.yape.antifraud_service.business;

import com.yape.antifraud_service.client.TransactionClient;
import com.yape.antifraud_service.dto.TransactionEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class AntifraudBusiness {

    private static final BigDecimal MONTO_MAXIMO = new BigDecimal("1000");

    private final TransactionClient transactionClient;

    public void evaluate(TransactionEventDto event) {
        String status = event.getTransactionAmount().compareTo(MONTO_MAXIMO) >= 0
                ? "REJECTED"
                : "APPROVED";

        log.info("Transacción {} con monto {} evaluada como: {}",
                event.getTransactionId(), event.getTransactionAmount(), status);

        transactionClient.updateTransactionStatus(event.getTransactionId(), status);
    }
}