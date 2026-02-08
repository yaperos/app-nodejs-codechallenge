package com.yaperos.codechallenge.antifraud.application.service;

import com.yaperos.codechallenge.antifraud.domain.model.FraudCheckResult;
import com.yaperos.codechallenge.antifraud.domain.port.input.ValidateTransactionUseCase;
import com.yaperos.codechallenge.antifraud.domain.port.output.FraudResultPublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AntiFraudService implements ValidateTransactionUseCase {

    private final FraudResultPublisherPort fraudResultPublisher;

    @Override
    public void validate(UUID transactionExternalId, BigDecimal value) {
        log.info("Validating transaction: id={}, value={}", transactionExternalId, value);
        FraudCheckResult result = FraudCheckResult.evaluate(transactionExternalId, value);
        log.info("Fraud check result: id={}, status={}", transactionExternalId, result.getStatus());
        fraudResultPublisher.publishResult(result);
    }

}
