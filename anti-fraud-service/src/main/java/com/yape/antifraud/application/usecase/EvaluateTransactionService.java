package com.yape.antifraud.application.usecase;

import com.yape.antifraud.domain.model.FraudEvaluation;
import com.yape.antifraud.domain.port.in.EvaluateTransactionUseCase;
import com.yape.antifraud.domain.port.out.FraudResultPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EvaluateTransactionService implements EvaluateTransactionUseCase {

    private static final Logger log = LoggerFactory.getLogger(EvaluateTransactionService.class);

    private final FraudResultPublisher fraudResultPublisher;

    public EvaluateTransactionService(FraudResultPublisher fraudResultPublisher) {
        this.fraudResultPublisher = fraudResultPublisher;
    }

    @Override
    public FraudEvaluation execute(Command command) {
        FraudEvaluation evaluation = new FraudEvaluation(
                command.transactionExternalId(),
                command.value()
        ).evaluate();

        log.info("Transaction {} evaluated as {} (value: {})",
                command.transactionExternalId(), evaluation.getResult(), command.value());

        fraudResultPublisher.publishResult(evaluation);

        return evaluation;
    }
}
