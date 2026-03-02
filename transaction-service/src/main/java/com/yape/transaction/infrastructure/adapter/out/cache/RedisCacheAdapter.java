package com.yape.transaction.infrastructure.adapter.out.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

/**
 * Redis adapter for caching transactions.
 */
@ApplicationScoped
public class RedisCacheAdapter implements TransactionCachePort {

    private static final Logger LOG = Logger.getLogger(RedisCacheAdapter.class);
    private static final String CACHE_PREFIX = "transaction:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    private final RedisDataSource redisDataSource;
    private ValueCommands<String, String> valueCommands;
    private ObjectMapper objectMapper;

    @Inject
    public RedisCacheAdapter(RedisDataSource redisDataSource) {
        this.redisDataSource = redisDataSource;
    }

    @PostConstruct
    void init() {
        this.valueCommands = redisDataSource.value(String.class, String.class);
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void put(Transaction transaction) {
        String key = CACHE_PREFIX + transaction.getTransactionExternalId();
        try {
            String json = objectMapper.writeValueAsString(transaction);
            valueCommands.setex(key, CACHE_TTL.toSeconds(), json);
            LOG.debugf("Transaction cached: %s", key);
        } catch (JsonProcessingException e) {
            LOG.errorf(e, "Error serializing transaction for cache: %s", key);
        }
    }

    @Override
    public Optional<Transaction> get(UUID transactionExternalId) {
        String key = CACHE_PREFIX + transactionExternalId;
        try {
            String json = valueCommands.get(key);
            if (json == null) {
                LOG.debugf("Cache miss: %s", key);
                return Optional.empty();
            }
            Transaction transaction = objectMapper.readValue(json, Transaction.class);
            LOG.debugf("Cache hit: %s", key);
            return Optional.of(transaction);
        } catch (JsonProcessingException e) {
            LOG.errorf(e, "Error deserializing transaction from cache: %s", key);
            return Optional.empty();
        }
    }

    @Override
    public void invalidate(UUID transactionExternalId) {
        String key = CACHE_PREFIX + transactionExternalId;
        redisDataSource.key().del(key);
        LOG.debugf("Cache invalidated: %s", key);
    }
}
