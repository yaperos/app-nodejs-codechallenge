package com.kafka.anti_fraude.application.usecase;

import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;

public interface ValidateTransactionUseCase {
    void execute(TransactionValidationCommand command);
}
