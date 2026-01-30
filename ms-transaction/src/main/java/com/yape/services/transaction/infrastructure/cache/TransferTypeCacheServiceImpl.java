package com.yape.services.transaction.infrastructure.cache;

import com.yape.services.shared.util.CacheKeyUtils;
import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.domain.service.TransferTypeCacheService;
import com.yape.services.transaction.infrastructure.config.TransferTypeCacheConfig;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.jboss.logging.Logger;
import org.redisson.api.RMapCache;
import org.redisson.api.RedissonClient;
import org.redisson.codec.TypedJsonJacksonCodec;

/**
 * Redis implementation of TransferTypeCacheService using Redisson RMapCache.
 * Uses cache-aside pattern for transfer type data.
 */
@ApplicationScoped
public class TransferTypeCacheServiceImpl implements TransferTypeCacheService {

  private static final Logger LOGGER = Logger.getLogger(TransferTypeCacheServiceImpl.class);

  private final RMapCache<String, TransferType> transferTypeCache;
  private final TransferTypeCacheConfig cacheConfig;

  /**
   * Constructor for TransferTypeCacheServiceImpl.
   *
   * @param redissonClient the Redisson client
   * @param cacheConfig    the cache configuration
   */
  @Inject
  public TransferTypeCacheServiceImpl(RedissonClient redissonClient,
                                      TransferTypeCacheConfig cacheConfig) {
    TypedJsonJacksonCodec codec = new TypedJsonJacksonCodec(String.class, TransferType.class);
    this.transferTypeCache = redissonClient.getMapCache(cacheConfig.mapName(), codec);
    this.cacheConfig = cacheConfig;
  }

  @Override
  public void save(TransferType transferType) {
    String key = buildKey(transferType.getTransferTypeId());
    transferTypeCache.put(key, transferType, cacheConfig.ttl(), TimeUnit.SECONDS);
    LOGGER.infof("TransferType cached with key: %s, TTL: %d seconds", key, cacheConfig.ttl());
  }

  @Override
  public void saveAll(List<TransferType> transferTypes) {
    transferTypes.forEach(this::save);
    LOGGER.infof("Cached %d transfer types", transferTypes.size());
  }

  @Override
  public Optional<TransferType> findById(Integer transferTypeId) {
    String key = buildKey(transferTypeId);
    TransferType transferType = transferTypeCache.get(key);

    if (transferType != null) {
      LOGGER.infof("Cache HIT for transfer type key: %s", key);
      return Optional.of(transferType);
    }

    LOGGER.infof("Cache MISS for transfer type key: %s", key);
    return Optional.empty();
  }

  @Override
  public Optional<List<TransferType>> findAll() {
    if (transferTypeCache.isEmpty()) {
      LOGGER.info("Cache MISS for all transfer types");
      return Optional.empty();
    }

    List<TransferType> transferTypes = transferTypeCache.values().stream()
        .collect(Collectors.toMap(
            TransferType::getTransferTypeId,
            t -> t,
            (existing, replacement) -> existing))
        .values()
        .stream()
        .toList();
    LOGGER.infof("Cache HIT for all transfer types, count: %d", transferTypes.size());
    return Optional.of(transferTypes);
  }

  private String buildKey(Integer transferTypeId) {
    return CacheKeyUtils.buildKey(cacheConfig.prefix(), String.valueOf(transferTypeId));
  }

}
