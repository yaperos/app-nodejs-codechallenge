package com.yape.antifraud.application.service;

import com.yape.antifraud.domain.model.FraudEvaluation;
import com.yape.antifraud.domain.port.in.EvaluateFraudCommand;
import com.yape.antifraud.domain.port.in.EvaluateFraudUseCase;
import com.yape.antifraud.domain.port.out.FraudResultPublisher;
import com.yape.antifraud.domain.service.FraudEvaluationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EvaluateFraudApplicationService implements EvaluateFraudUseCase {

    private static final Logger log = LoggerFactory.getLogger(EvaluateFraudApplicationService.class);

    private final FraudEvaluationService fraudEvaluationService;
    private final FraudResultPublisher resultPublisher;

    public EvaluateFraudApplicationService(FraudEvaluationService fraudEvaluationService,
                                           FraudResultPublisher resultPublisher) {
        this.fraudEvaluationService = fraudEvaluationService;
        this.resultPublisher = resultPublisher;
    }

    @Override
    public void execute(EvaluateFraudCommand command) {
        FraudEvaluation evaluation = fraudEvaluationService.evaluate(
                command.transactionId(),
                command.value()
        );

        log.info("event=fraud.evaluated, transactionId={}, value={}, result={}, outcome=success",
                command.transactionId(), command.value(), evaluation.status());

        resultPublisher.publishResult(evaluation);
    }
}
