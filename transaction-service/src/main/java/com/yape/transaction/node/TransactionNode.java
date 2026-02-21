package com.yape.transaction.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.Instant;

import static org.springframework.data.neo4j.core.schema.Relationship.Direction.OUTGOING;

@Node("Transaction")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionNode {

    @Id
    private String transactionId;
    private String accountExternalIdDebit;
    private String accountExternalIdCredit;
    private Integer transferTypeId;
    private Float value;
    private String status;          // PENDING | APPROVED | REJECTED
    private Instant createdAt;
    private Instant updatedAt;

    // Relación saliente hacia el resultado de fraude
    @Relationship(type = "HAS_RESULT", direction = OUTGOING)
    private FraudResultNode fraudResult;
}
