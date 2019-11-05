package org.dicadeveloper.weplantaforest;

import java.util.Arrays;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfiguration {

    public final static String TEN_MINUTE_CACHE = "ten_minute_cache";

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();

        cacheManager.setCaches(Arrays.asList(buildTenMinuteCache()));
        return cacheManager;
    }

    private Cache buildTenMinuteCache() {
        final CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager(TEN_MINUTE_CACHE);
        caffeineCacheManager.setCacheSpecification("maximumSize=500,expireAfterAccess=600s");
        return caffeineCacheManager.getCache(TEN_MINUTE_CACHE);
    }

}
