package com.yape.antifraud.domain.port.out;

import com.yape.antifraud.domain.model.ValidationResult;

public interface ValidationResultPublisher {

    /**
     * Publishes the validation result.
     *
     * @param result the validation result to publish
     */
    void publishValidationResult(ValidationResult result);
}
