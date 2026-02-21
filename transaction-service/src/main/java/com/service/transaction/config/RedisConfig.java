package com.service.transaction.config;

import com.service.transaction.model.entity.Transaction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

/**
 * <b>Class</b>: RedisConfig<br/>
 * Copyright: &copy; 2026.<br/>
 * Company: Yape.<br/>
 *
 * <u>Developed by</u>: <br/>
 * <ul>
 *     <li>Felipe Rosado</li>
 *     <li>February 21, 2026 Creaci&oacute;n de Clase.</li>
 * </ul>
 * @version 1.0
 */
@Configuration
public class RedisConfig {

  @Bean
  @SuppressWarnings("unchecked")
  public ReactiveRedisTemplate<String, Transaction> reactiveRedisTemplate(
      ReactiveRedisConnectionFactory factory) {
    RedisSerializationContext<String, Transaction> context =
        RedisSerializationContext.<String, Transaction>newSerializationContext()
            .key(RedisSerializer.string())
            .value((RedisSerializer<Transaction>)(RedisSerializer<?>) RedisSerializer.json())
            .hashKey(RedisSerializer.string())
            .hashValue(RedisSerializer.json())
            .build();
    return new ReactiveRedisTemplate<>(factory, context);
  }

}