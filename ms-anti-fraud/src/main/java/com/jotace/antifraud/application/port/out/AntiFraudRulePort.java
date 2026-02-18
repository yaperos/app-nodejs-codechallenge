package com.jotace.antifraud.application.port.out;

import com.jotace.antifraud.domain.command.TransactionValidationCommand;

public interface AntiFraudRulePort {

    String applyRule(TransactionValidationCommand command);

}
