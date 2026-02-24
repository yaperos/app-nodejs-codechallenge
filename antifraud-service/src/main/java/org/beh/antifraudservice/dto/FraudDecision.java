package org.beh.antifraudservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FraudDecision {

    private String transactionId;
    private String status;   // "APPROVED" | "REJECTED"
    private String reason;

    public static FraudDecision approved(String transactionId) {
        return FraudDecision.builder()
                .transactionId(transactionId)
                .status("APPROVED")
                .build();
    }

    public static FraudDecision rejected(String transactionId, String reason) {
        return FraudDecision.builder()
                .transactionId(transactionId)
                .status("REJECTED")
                .reason(reason)
                .build();
    }
}
