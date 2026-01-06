package pe.com.yape.ms.transaction.service.adapter.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.service.port.CacheRepositoryPort;

/**
 * Adaptador de Cache implementada en Redis
 * @author lmarusic
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RedisCacheAdapter implements CacheRepositoryPort {
    
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    
    private static final String CACHE_PREFIX = "transaction:";
    
    @Override
    public void save(Transaction transaction, long ttlSeconds) {
        String key = generateKey(transaction.transactionExternalId());
        
        try {
            String json = objectMapper.writeValueAsString(transaction);
            redisTemplate.opsForValue().set(key, json, Duration.ofSeconds(ttlSeconds));
            
            log.debug("Transaction cached: {} with TTL: {}s", transaction.transactionExternalId(), ttlSeconds);
        } catch (JsonProcessingException e) {
            log.error("Error serializing transaction to cache: {}", transaction.transactionExternalId(), e);
        }
    }
    
    @Override
    public Optional<Transaction> findByExternalId(UUID transactionExternalId) {
        String key = generateKey(transactionExternalId);
        String json = redisTemplate.opsForValue().get(key);
        
        if (json == null) {
            log.debug("Cache miss for transaction: {}", transactionExternalId);
            return Optional.empty();
        }
        
        try {
            Transaction transaction = objectMapper.readValue(json, Transaction.class);
            log.debug("Cache hit for transaction: {}", transactionExternalId);
            return Optional.of(transaction);
        } catch (JsonProcessingException e) {
            log.warn("Error deserializing transaction from cache: {}. Evicting corrupted cache entry.", 
                transactionExternalId, e);
            // Eliminar el cache corrupto automáticamente
            evict(transactionExternalId);
            return Optional.empty();
        }
    }
    
    @Override
    public void evict(UUID transactionExternalId) {
        String key = generateKey(transactionExternalId);
        redisTemplate.delete(key);
        
        log.debug("Transaction evicted from cache: {}", transactionExternalId);
    }
    
    @Override
    public void clear() {
        // Obtener todas las claves con el prefijo
        var keys = redisTemplate.keys(CACHE_PREFIX + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("Cache cleared: {} keys deleted", keys.size());
        }
    }
    
    private String generateKey(UUID transactionExternalId) {
        return CACHE_PREFIX + transactionExternalId.toString();
    }
}

