package com.yape.transaction.repository;

import com.yape.transaction.node.AccountNode;
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Repository
public interface AccountNodeRepository
        extends ReactiveNeo4jRepository<AccountNode, String> {

    // MERGE: crea la cuenta si no existe, la devuelve si ya existe
    @Query("""
        MERGE (a:Account {accountId: $accountId})
        ON CREATE SET a.createdAt = $createdAt
        RETURN a
        """)
    Mono<AccountNode> mergeAccount(String accountId, Instant createdAt);

}
