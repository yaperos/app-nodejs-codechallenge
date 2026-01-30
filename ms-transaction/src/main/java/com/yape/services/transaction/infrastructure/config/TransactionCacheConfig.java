package com.yape.services.transaction.infrastructure.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithName;

/**
 * Configuration for transaction cache settings.
 */
@ConfigMapping(prefix = "application.cache.transaction")
public interface TransactionCacheConfig {

  /**
   * Gets the map name for the transaction cache.
   *
   * @return the name of the cache map
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
   * Gets the TTL configuration.
   *
   * @return the TTL settings
   */
  Ttl ttl();

  /**
   * TTL configuration for different transaction statuses.
   */
  interface Ttl {

    /**
     * TTL in seconds for pending transactions.
     *
     * @return TTL in seconds
     */
    @WithName("pending")
    long pending();

    /**
     * TTL in seconds for approved transactions.
     *
     * @return TTL in seconds
     */
    @WithName("approved")
    long approved();

    /**
     * TTL in seconds for rejected transactions.
     *
     * @return TTL in seconds
     */
    @WithName("rejected")
    long rejected();

  }

}
