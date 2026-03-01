package com.retotecnico.antifraud.application.service;

import com.retotecnico.antifraud.domain.model.FraudValidation;
import com.retotecnico.antifraud.domain.port.in.ValidateTransactionUseCase;
import com.retotecnico.antifraud.domain.port.out.FraudResultPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FraudValidationService implements ValidateTransactionUseCase {

    private final FraudResultPublisher fraudResultPublisher;

    @Override
    public String execute(UUID transactionExternalId, BigDecimal value) {
        // Apply domain business rule
        FraudValidation validation = FraudValidation.validate(transactionExternalId, value);

        log.info("Fraud validation for transaction {}: value={}, result={}",
                transactionExternalId, value, validation.getResultStatus());

        // Publish result back via Kafka
        fraudResultPublisher.publishResult(
                validation.getTransactionExternalId(),
                validation.getResultStatus()
        );

        return validation.getResultStatus();
    }
}
