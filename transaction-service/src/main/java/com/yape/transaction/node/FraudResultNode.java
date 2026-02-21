package com.yape.transaction.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.time.Instant;

@Node("FraudResult")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudResultNode {
    @Id
    private String transactionId;
    private String transactionExternalId;
    private String transactionType;
    private String transactionStatus; // APPROVED | REJECTED | FLAGGED
    private Float value;
    private Instant createdAt;
}
