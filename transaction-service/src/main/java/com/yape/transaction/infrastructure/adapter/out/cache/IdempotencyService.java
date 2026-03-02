package com.yape.transaction.infrastructure.adapter.out.cache;

import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.time.Duration;

@ApplicationScoped
public class IdempotencyService {

    private static final Logger LOG = Logger.getLogger(IdempotencyService.class);
    private static final String IDEMPOTENCY_PREFIX = "idempotent:";
    private static final Duration IDEMPOTENCY_TTL = Duration.ofHours(24);

    private final RedisDataSource redisDataSource;
    private ValueCommands<String, String> valueCommands;

    @Inject
    public IdempotencyService(RedisDataSource redisDataSource) {
        this.redisDataSource = redisDataSource;
    }

    @PostConstruct
    void init() {
        this.valueCommands = redisDataSource.value(String.class, String.class);
    }

    public boolean isProcessed(String eventKey) {
        String key = IDEMPOTENCY_PREFIX + eventKey;
        String value = valueCommands.get(key);
        return value != null;
    }

    public void markAsProcessed(String eventKey) {
        String key = IDEMPOTENCY_PREFIX + eventKey;
        valueCommands.setex(key, IDEMPOTENCY_TTL.toSeconds(), "1");
        LOG.debugf("Event marked as processed: %s", key);
    }

    public boolean tryAcquireLock(String eventKey) {
        String key = IDEMPOTENCY_PREFIX + eventKey;
        boolean acquired = valueCommands.setnx(key, "processing");
        if(acquired){
            redisDataSource.key().expire(key, IDEMPOTENCY_TTL.toSeconds());
        }

        LOG.debugf("Lock acquisition for %s: %s", key, acquired);
        return acquired;
    }
}
