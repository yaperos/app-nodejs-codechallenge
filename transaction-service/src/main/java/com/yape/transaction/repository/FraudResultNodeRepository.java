package com.yape.transaction.repository;

import com.yape.transaction.node.FraudResultNode;
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface FraudResultNodeRepository
        extends ReactiveNeo4jRepository<FraudResultNode, String> {

    @Query("""
        MATCH (t:Transaction {transactionId: $transactionId})-[:HAS_RESULT]->(f:FraudResult)
        RETURN f
        """)
    Mono<FraudResultNode> findByTransactionId(String transactionId);
}