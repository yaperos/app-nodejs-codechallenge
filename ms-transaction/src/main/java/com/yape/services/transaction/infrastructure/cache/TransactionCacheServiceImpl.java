package com.yape.services.transaction.infrastructure.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yape.services.shared.util.CacheKeyUtils;
import com.yape.services.shared.util.Constants;
import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import com.yape.services.transaction.infrastructure.config.TransactionCacheConfig;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.jboss.logging.Logger;
import org.redisson.api.RMapCache;
import org.redisson.api.RedissonClient;
import org.redisson.codec.TypedJsonJacksonCodec;

/**
 * Redis implementation of TransactionCacheService using Redisson RMapCache.
 */
@ApplicationScoped
public class TransactionCacheServiceImpl implements TransactionCacheService {

  private static final Logger LOGGER = Logger.getLogger(TransactionCacheServiceImpl.class);

  private final RMapCache<String, Transaction> transactionCache;
  private final TransactionCacheConfig cacheConfig;

  /**
   * Constructor for TransactionCacheServiceImpl.
   *
   * @param redissonClient the Redisson client
   * @param cacheConfig    the cache configuration
   */
  @Inject
  public TransactionCacheServiceImpl(RedissonClient redissonClient,
                                     TransactionCacheConfig cacheConfig) {
    ObjectMapper mapper = createObjectMapper();
    TypedJsonJacksonCodec codec =
        new TypedJsonJacksonCodec(String.class, Transaction.class, mapper);
    this.transactionCache = redissonClient.getMapCache(cacheConfig.mapName(), codec);
    this.cacheConfig = cacheConfig;
  }

  private static ObjectMapper createObjectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    return mapper;
  }

  @Override
  public void saveTransaction(Transaction transaction, String statusCode) {
    String key = buildKey(transaction.getTransactionExternalId());
    long ttl = getTtlForStatus(statusCode);

    transactionCache.put(key, transaction, ttl, TimeUnit.SECONDS);
    LOGGER.infof("Transaction cached with key: %s, TTL: %d seconds", key, ttl);
  }

  @Override
  public Optional<Transaction> getTransactionByExternalId(UUID externalId) {
    String key = buildKey(externalId);
    Transaction transaction = transactionCache.get(key);

    if (transaction != null) {
      LOGGER.infof("Transaction found in cache with key: %s", key);
      return Optional.of(transaction);
    }

    LOGGER.infof("Transaction not found in cache with key: %s", key);
    return Optional.empty();
  }

  @Override
  public void updateTransactionStatus(UUID externalId,
                                      Integer newStatusId,
                                      String newStatusCode) {
    String key = buildKey(externalId);
    Transaction transaction = transactionCache.get(key);

    if (transaction == null) {
      LOGGER.warnf("Transaction not found in cache for status update: %s", key);
      return;
    }

    transaction.setTransactionStatusId(newStatusId);
    long ttl = getTtlForStatus(newStatusCode);

    transactionCache.put(key, transaction, ttl, TimeUnit.SECONDS);
    LOGGER.infof("Transaction status updated to %s with new TTL: %d seconds", newStatusCode, ttl);
  }

  private String buildKey(UUID transactionExternalId) {
    return CacheKeyUtils.buildKey(cacheConfig.prefix(), transactionExternalId.toString());
  }

  private long getTtlForStatus(String status) {
    return switch (status) {
      case Constants.TRANSACTION_STATUS_PENDING -> cacheConfig.ttl().pending();
      case Constants.TRANSACTION_STATUS_APPROVED -> cacheConfig.ttl().approved();
      case Constants.TRANSACTION_STATUS_REJECTED -> cacheConfig.ttl().rejected();
      default -> throw new IllegalStateException("Unexpected value: " + status);
    };
  }

}
