package pe.com.yape.antifraud.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.com.yape.antifraud.kafka.events.TransactionCreatedEvent;
import pe.com.yape.antifraud.models.AntiFraudDecision;
import pe.com.yape.antifraud.models.AntiFraudRule;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AntiFraudService {

    private final List<AntiFraudRule> rules;

    public AntiFraudDecision evaluate(TransactionCreatedEvent event) {

        boolean fraudDetected = rules.stream()
                .anyMatch(rule -> rule.isFraud(event));

        return fraudDetected
                ? AntiFraudDecision.rejected()
                : AntiFraudDecision.approved();
    }
}