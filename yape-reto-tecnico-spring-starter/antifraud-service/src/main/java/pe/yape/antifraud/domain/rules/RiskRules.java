package pe.yape.antifraud.domain.rules;

import java.math.BigDecimal;
import org.springframework.stereotype.Component;
import pe.yape.antifraud.domain.model.AntifraudDecision;
import pe.yape.antifraud.domain.model.DecisionStatus;

@Component
public class RiskRules {

    public AntifraudDecision evaluate(BigDecimal amount, String payerDocument, String payeeDocument) {
        if (amount != null && amount.compareTo(new BigDecimal("1000.00")) > 0) {
            return new AntifraudDecision(DecisionStatus.REJECTED, 900);
        }

        if (payerDocument != null && payerDocument.equals(payeeDocument)) {
            return new AntifraudDecision(DecisionStatus.REJECTED, 850);
        }

        return new AntifraudDecision(DecisionStatus.APPROVED, 100);
    }
}