package com.yape.transaction.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.neo4j.core.schema.Relationship.Direction.OUTGOING;

@Node("Account")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountNode {

    @Id
    private String accountId;

    private String ownerName;
    private Instant createdAt;

    // Relaciones salientes: una cuenta puede tener muchas transacciones
    @Relationship(type = "INITIATED", direction = OUTGOING)
    private List<TransactionNode> transactions = new ArrayList<>();
}