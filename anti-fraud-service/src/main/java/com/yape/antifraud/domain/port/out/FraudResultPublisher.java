package com.yape.antifraud.domain.port.out;

import com.yape.antifraud.domain.model.FraudEvaluation;

public interface FraudResultPublisher {

    void publishResult(FraudEvaluation evaluation);
}
