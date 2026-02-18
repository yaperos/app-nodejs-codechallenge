package com.jotace.antifraud.application.service;

import com.jotace.antifraud.application.port.in.ValidateTransactionUseCase;
import com.jotace.antifraud.application.port.out.AntiFraudRulePort;
import com.jotace.antifraud.application.port.out.TransactionStatusPublisherPort;
import com.jotace.antifraud.domain.command.TransactionValidationCommand;
import org.springframework.stereotype.Service;

@Service
public class ValidateTransactionService implements ValidateTransactionUseCase {

    private final AntiFraudRulePort antiFraudRulePort;

    private final TransactionStatusPublisherPort statusPublisherPort;

    public ValidateTransactionService(
            AntiFraudRulePort antiFraudRulePort,
            TransactionStatusPublisherPort statusPublisherPort) {
        this.antiFraudRulePort = antiFraudRulePort;
        this.statusPublisherPort = statusPublisherPort;
    }

    @Override
    public void execute(TransactionValidationCommand command) {
        String newStatus = antiFraudRulePort.applyRule(command);
        statusPublisherPort.publishStatusUpdate(command.transactionExternalId(), newStatus);
    }

}
