package com.jotace.antifraud.application.port.in;

import com.jotace.antifraud.domain.command.TransactionValidationCommand;

public interface ValidateTransactionUseCase {

    void execute(TransactionValidationCommand command);

}
