package com.yape.transaction.graph;

import com.yape.transaction.domain.Transaction;
import com.yape.transaction.event.FraudResultEvent;
import com.yape.transaction.node.FraudResultNode;
import com.yape.transaction.node.TransactionNode;
import com.yape.transaction.repository.TransactionNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.neo4j.core.ReactiveNeo4jClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GraphService {

    private final ReactiveNeo4jClient neo4jClient;
    private final TransactionNodeRepository txRepository;

    public Mono<TransactionNode> saveTransaction(Transaction domain) {
        return neo4jClient.query("""
                    MERGE (a:Account {accountId: $accountId})
                    ON CREATE SET a.createdAt = $now
                    MERGE (t:Transaction {transactionId: $transactionId})
                    ON CREATE SET
                        t.accountExternalIdDebit = $accountExternalIdDebit,
                        t.accountExternalIdCredit = $accountExternalIdCredit,
                        t.transferTypeId = $transferTypeId,
                        t.value       = $value,
                        t.status      = $status,
                        t.createdAt   = $createdAt,
                        t.updatedAt   = $updatedAt
                    MERGE (a)-[:INITIATED]->(t)
                    RETURN t
                    """)
                .bindAll(Map.of(
                        "accountId",                domain.getAccountExternalIdDebit(),
                        "transactionId",            domain.getId(),
                        "accountExternalIdDebit",   domain.getAccountExternalIdDebit(),
                        "accountExternalIdCredit",  domain.getAccountExternalIdCredit(),
                        "transferTypeId",           domain.getTransferTypeId(),
                        "value",                    domain.getValue().toString(),
                        "status",                   domain.getStatus(),
                        "createdAt",                domain.getCreatedAt().toString(),
                        "updatedAt",                domain.getUpdatedAt().toString(),
                        "now",                      Instant.now().toString()
                ))
                .fetchAs(TransactionNode.class)
                .mappedBy((typeSystem, record) -> mapToTransactionNode(record.get("t")))
                .one()
                .doOnSuccess(t -> log.info("[Neo4j] Transaction node saved: {}", t.getTransactionId()))
                .doOnError(e -> log.error("[Neo4j] Error saving transaction node", e));
    }

    public Mono<TransactionNode> applyFraudResult(FraudResultEvent event) {
        return neo4jClient.query("""
                    MATCH (t:Transaction {transactionId: $transactionId})
                    SET t.status    = $transactionStatus,
                        t.updatedAt = $updatedAt
                    MERGE (f:FraudResult {transactionId: $transactionId})
                    ON CREATE SET
                        f.transactionExternalId     = $transactionExternalId,
                        f.transactionType           = $transactionType,
                        f.transactionStatus         = $transactionStatus,
                        f.value                     = $value,
                        f.createdAt                 = $createdAt
                    ON MATCH SET
                        f.transactionExternalId     = $transactionExternalId,
                        f.transactionType           = $transactionType,
                        f.transactionStatus         = $transactionStatus,
                        f.value                     = $value,
                        f.createdAt                 = $createdAt
                    MERGE (t)-[:HAS_RESULT]->(f)
                    RETURN t
                    """)
                .bindAll(Map.of(
                        "transactionId",            event.getTransactionId(),
                        "transactionExternalId",    event.getTransactionExternalId(),
                        "transactionType",          event.getTransactionType().getName(),
                        "transactionStatus",        event.getTransactionStatus().getName(),
                        "value",                    event.getValue(),
                        "createdAt",                Instant.now().toString(),
                        "updatedAt",                Instant.now().toString()
                ))
                .fetchAs(TransactionNode.class)
                .mappedBy((typeSystem, record) -> mapToTransactionNode(record.get("t")))
                .one()
                .doOnSuccess(t -> log.info(
                        "[Neo4j] FraudResult applied: transactionId={} status={}",
                        event.getTransactionId(), event.getTransactionStatus().getName()
                ))
                .doOnError(e -> log.error("[Neo4j] Error applying fraud result", e));
    }

    public Mono<TransactionNode> findTransactionById(String transactionId) {
        return neo4jClient.query("""
                MATCH (t:Transaction {transactionId: $transactionId})
                OPTIONAL MATCH (t)-[:HAS_RESULT]->(f:FraudResult)
                RETURN t, f
                """)
                .bindAll(Map.of("transactionId", transactionId))
                .fetchAs(TransactionNode.class)
                .mappedBy((typeSystem, record) -> {
                    TransactionNode node = mapToTransactionNode(record.get("t"));
                    if (!record.get("f").isNull()) {
                        node.setFraudResult(mapToFraudResultNode(record.get("f")));
                    }
                    return node;
                })
                .one();
    }

    private FraudResultNode mapToFraudResultNode(org.neo4j.driver.Value node) {
        return FraudResultNode.builder()
                .transactionId(node.get("transactionId").asString())
                .transactionExternalId(node.get("transactionExternalId").asString())
                .transactionType(node.get("transactionType").asString())
                .transactionStatus(node.get("transactionStatus").asString())
                .value(node.get("value").asFloat())
                .createdAt(Instant.parse(node.get("createdAt").asString()))
                .build();
    }

    public Flux<TransactionNode> getAccountTransactions(String accountId, int limit) {
        return txRepository.findByAccountId(accountId, limit);
    }

    private TransactionNode mapToTransactionNode(org.neo4j.driver.Value node) {
        return TransactionNode.builder()
                .transactionId(node.get("transactionId").asString())
                .accountExternalIdDebit(node.get("accountExternalIdDebit").asString())
                .accountExternalIdCredit(node.get("accountExternalIdCredit").asString())
                .transferTypeId(node.get("transferTypeId").asInt())
                .value(Float.parseFloat(node.get("value").asString()))
                .status(node.get("status").asString())
                .createdAt(Instant.parse(node.get("createdAt").asString()))
                .updatedAt(Instant.parse(node.get("updatedAt").asString()))
                .build();
    }
}
