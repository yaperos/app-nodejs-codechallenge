package com.yape.services.shared.util;

/**
 * Utility class for cache key operations.
 */
public final class CacheKeyUtils {

  private CacheKeyUtils() {
  }

  /**
   * Builds a cache key with prefix and value.
   *
   * @param prefix the key prefix
   * @param value  the value to append
   * @return the cache key
   */
  public static String buildKey(String prefix, String value) {
    return prefix + value;
  }

}
