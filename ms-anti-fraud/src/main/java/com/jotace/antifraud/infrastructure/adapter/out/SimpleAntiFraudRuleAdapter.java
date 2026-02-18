package com.jotace.antifraud.infrastructure.adapter.out;

import com.jotace.antifraud.application.port.out.AntiFraudRulePort;
import com.jotace.antifraud.domain.command.TransactionValidationCommand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SimpleAntiFraudRuleAdapter implements AntiFraudRulePort {

    private static final Logger log = LoggerFactory.getLogger(SimpleAntiFraudRuleAdapter.class);

    private static final double MAX_ALLOWED_VALUE = 1000.0;

    @Override
    public String applyRule(TransactionValidationCommand command) {
        String status;

        if (command.value() > MAX_ALLOWED_VALUE) {
            status = "rejected";
            log.warn("Anti-Fraud Rule triggered: Transaction {} REJECTED. Value: {}",
                    command.transactionExternalId(), command.value());
        } else {
            status = "approved";
            log.info("Transaction {} APPROVED by Anti-Fraud Rule. Value: {}",
                    command.transactionExternalId(), command.value());
        }

        return status;
    }
}
