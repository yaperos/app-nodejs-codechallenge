package com.msucre.transaction.infrastructure.redis.config;

import com.msucre.transaction.domain.model.Transaction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

  @Bean
  ReactiveRedisTemplate<String, Transaction> redisOperations(ReactiveRedisConnectionFactory factory) {
    Jackson2JsonRedisSerializer<Transaction> serializer = new Jackson2JsonRedisSerializer<>(Transaction.class);
    RedisSerializationContext.RedisSerializationContextBuilder<String, Transaction> builder =
        RedisSerializationContext.newSerializationContext(new StringRedisSerializer());
    RedisSerializationContext<String, Transaction> context = builder.value(serializer).build();
    return new ReactiveRedisTemplate<>(factory, context);
  }
}
