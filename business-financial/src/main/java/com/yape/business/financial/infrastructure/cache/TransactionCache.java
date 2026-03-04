package com.yape.business.financial.infrastructure.cache;

import com.yape.business.financial.infrastructure.events.TransactionCreatedEvent;
import com.yape.shared.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TransactionCache {
    private final ReactiveRedisTemplate<String, String> redisTemplate;
    private final ObjectMapper mapper;
    private static final String KEY_PREFIX = "tx:";

    public Mono<Boolean> save(TransactionCreatedEvent event) {
        String key = KEY_PREFIX + event.id();
        Map<String,String> map = Map.of(
                "id", event.id().toString(),
                "value", event.value().toString(),
                "status", event.status().toString()
        );
        return redisTemplate.opsForHash()
                .putAll(key, map)
                .then(redisTemplate.expire(key, Duration.ofMinutes(1L)));
    }

    public Mono<Boolean> update(UUID id, String status) {
        String key = KEY_PREFIX+id;
        return redisTemplate.opsForHash()
                .put(key, "status", status);
    }

    public Mono<TransactionCreatedEvent> getTransaction(UUID id) {
        String key = KEY_PREFIX+id;
        return redisTemplate.opsForHash()
                .entries(key)
                .collectMap(e -> e.getKey().toString(), e -> e.getValue().toString())
                .filter(map -> !map.isEmpty())
                .map(map -> TransactionCreatedEvent.builder()
                        .id(UUID.fromString(map.get("id")))
                        .value(BigDecimal.valueOf(Long.parseLong(map.get("value"))))
                        .status(TransactionStatus.valueOf(map.get("status")))
                        .build());
    }
}
