package com.yape.antifraud.domain.port.in;

public interface EvaluateFraudUseCase {

    void execute(EvaluateFraudCommand command);
}
