package fit.iuh.event_service.configs;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;

/**
 * Redis Cache Configuration
 * 
 * This configuration enables Spring Cache abstraction with Redis as the backend.
 * It configures:
 * - Cache TTL (Time-To-Live): 1 hour by default
 * - Serialization: Jackson2JsonRedisSerializer for complex objects
 * - Cache names: "events" for Event entity caching
 * 
 * How it works:
 * 1. @EnableCaching activates Spring's caching mechanism globally
 * 2. RedisCacheManager handles cache operations on Redis
 * 3. @Cacheable, @CachePut, @CacheEvict annotations in service methods work with this config
 */
@Configuration
@EnableCaching
public class RedisConfig {

    /**
     * Configure Redis Cache Manager with custom TTL and serialization
     * 
     * @param connectionFactory Redis connection factory (auto-configured by Spring Boot)
     * @return Configured RedisCacheManager
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        
        // Configure default cache settings
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration
                .defaultCacheConfig()
                // Set TTL to 1 hour (3600 seconds)
                .entryTtl(Duration.ofHours(1))
                // Use String for cache keys
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new StringRedisSerializer()
                        )
                )
                // Use Jackson for serializing cache values (complex objects)
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                jacksonRedisSerializer()
                        )
                )
                // Don't cache null values
                .disableCachingNullValues();

        // Create cache manager with the default config
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultCacheConfig)
                .build();
    }

    /**
     * Jackson2JsonRedisSerializer for serializing/deserializing complex objects
     * This allows Event objects and other entities to be cached in Redis
     */
    @Bean
    public Jackson2JsonRedisSerializer<Object> jacksonRedisSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        // Enable type information to handle polymorphism
        objectMapper.activateDefaultTyping(
                objectMapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        
        return new Jackson2JsonRedisSerializer<>(objectMapper, Object.class);
    }
}
