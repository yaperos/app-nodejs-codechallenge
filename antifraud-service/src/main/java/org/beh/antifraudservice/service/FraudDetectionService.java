package org.beh.antifraudservice.service;

import lombok.extern.slf4j.Slf4j;
import org.beh.antifraudservice.dto.FraudDecision;
import org.beh.antifraudservice.dto.TransactionEvent;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Fraud Detection Engine — chain-of-responsibility rule list.
 *
 * Adding a new rule: implement FraudRule and register it in the constructor.
 * No existing code needs to change (Open/Closed Principle).
 *
 * Current rules:
 *  1. ValueThresholdRule — reject if value > 1000
 *
 * Pluggable future rules:
 *  2. VelocityRule        — reject if same account sends > N transactions in M minutes
 *  3. BlacklistRule       — reject if account is flagged
 *  4. MLScoringRule       — delegate to an ML model endpoint
 */
@Service
@Slf4j
public class FraudDetectionService {

    private static final BigDecimal MAX_VALUE = new BigDecimal("1000");

    private final List<FraudRule> rules;

    public FraudDetectionService() {
        this.rules = new ArrayList<>();
        this.rules.add(new ValueThresholdRule());
        // Future: this.rules.add(new VelocityRule(velocityRepository));
        // Future: this.rules.add(new BlacklistRule(blacklistRepository));
    }

    public FraudDecision evaluate(TransactionEvent event) {
        log.info("Evaluating transaction [{}] value [{}]", event.getTransactionId(), event.getValue());

        for (FraudRule rule : rules) {
            FraudDecision decision = rule.evaluate(event);
            if (decision != null) {
                log.info("Transaction [{}] REJECTED by rule [{}]: {}",
                    event.getTransactionId(), rule.name(), decision.getReason());
                return decision;
            }
        }

        log.info("Transaction [{}] APPROVED — all rules passed", event.getTransactionId());
        return FraudDecision.approved(event.getTransactionId());
    }

    // ─── Rule Interface ────────────────────────────────────────────────────

    interface FraudRule {
        /**
         * @return a rejected FraudDecision if the rule is violated, null to pass to the next rule
         */
        FraudDecision evaluate(TransactionEvent event);
        String name();
    }

    // ─── Concrete Rules ────────────────────────────────────────────────────

    static class ValueThresholdRule implements FraudRule {

        @Override
        public FraudDecision evaluate(TransactionEvent event) {
            if (event.getValue() != null && event.getValue().compareTo(MAX_VALUE) > 0) {
                return FraudDecision.rejected(
                    event.getTransactionId(),
                    "Value %s exceeds the maximum allowed threshold of %s"
                        .formatted(event.getValue(), MAX_VALUE)
                );
            }
            return null; // Pass — let next rule evaluate
        }

        @Override
        public String name() { return "ValueThresholdRule"; }
    }
}
