package pe.com.yape.antifraud.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionEvaluation(UUID transactionExternalId, BigDecimal amount) {
}
