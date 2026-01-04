package com.yape.challenge.transaction.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis cache configuration for high volume read optimization
 * Implements distributed caching to reduce database load
 */
@Configuration
@EnableCaching
@ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis", matchIfMissing = true)
public class CacheConfig {

    /**
     * Configure ObjectMapper for Redis serialization with Java Time support
     * Enables default typing to preserve type information during serialization/deserialization
     */
    @Bean
    public ObjectMapper redisCacheObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.findAndRegisterModules();
        // Enable default typing to avoid ClassCastException when deserializing from Redis
        objectMapper.activateDefaultTyping(
                objectMapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL
        );
        return objectMapper;
    }

    /**
     * Configure Redis Cache Manager with custom TTLs for different cache regions
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new StringRedisSerializer()
                        )
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new GenericJackson2JsonRedisSerializer(redisCacheObjectMapper())
                        )
                )
                .disableCachingNullValues();

        // Build cache manager with specific cache configurations
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                // Transaction cache: 10 minutes (frequent reads)
                .withCacheConfiguration("transactions",
                        defaultConfig.entryTtl(Duration.ofMinutes(10)))
                // Transaction types: 1 hour (rarely changes)
                .withCacheConfiguration("transactionTypes",
                        defaultConfig.entryTtl(Duration.ofHours(1)))
                // Transaction list: 2 minutes (changes frequently)
                .withCacheConfiguration("transactionList",
                        defaultConfig.entryTtl(Duration.ofMinutes(2)))
                .transactionAware()
                .build();
    }
}

