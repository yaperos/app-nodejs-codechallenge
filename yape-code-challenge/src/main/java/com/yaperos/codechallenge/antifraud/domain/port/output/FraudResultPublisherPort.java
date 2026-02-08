package com.yaperos.codechallenge.antifraud.domain.port.output;

import com.yaperos.codechallenge.antifraud.domain.model.FraudCheckResult;

public interface FraudResultPublisherPort {

    void publishResult(FraudCheckResult result);

}
