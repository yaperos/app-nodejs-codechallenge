package com.yape.services.transaction.infrastructure.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithName;

/**
 * Configuration for transfer type cache settings.
 */
@ConfigMapping(prefix = "application.cache.transfer-type")
public interface TransferTypeCacheConfig {

  /**
   * Gets the RMapCache name.
   *
   * @return the map name
   */
  @WithName("map-name")
  String mapName();

  /**
   * Gets the cache key prefix.
   *
   * @return the prefix for cache keys
   */
  String prefix();

  /**
   * Gets the TTL in seconds.
   *
   * @return TTL in seconds
   */
  long ttl();

}
