package com.yape.transaction.repository;

import com.yape.transaction.node.TransactionNode;
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Repository
public interface TransactionNodeRepository
        extends ReactiveNeo4jRepository<TransactionNode, String> {

    // Todas las transacciones de una cuenta con su resultado de fraude
    @Query("""
        MATCH (a:Account {accountId: $accountId})-[:INITIATED]->(t:Transaction)
        OPTIONAL MATCH (t)-[:HAS_RESULT]->(f:FraudResult)
        RETURN t, collect(f) as fraudResult
        ORDER BY t.createdAt DESC
        LIMIT $limit
        """)
    Flux<TransactionNode> findByAccountId(String accountId, int limit);

    // Transacciones por estado (ej: todas las REJECTED de las últimas 24h)
    @Query("""
        MATCH (t:Transaction {status: $status})
        WHERE t.createdAt >= $since
        RETURN t
        ORDER BY t.createdAt DESC
        """)
    Flux<TransactionNode> findByStatusSince(String status, Instant since);

    // Actualiza solo el status y updatedAt sin cargar el nodo completo
    @Query("""
        MATCH (t:Transaction {transactionId: $transactionId})
        SET t.status = $status, t.updatedAt = $updatedAt
        RETURN t
        """)
    Mono<TransactionNode> updateStatus(
            String transactionId, String status, Instant updatedAt);
}
