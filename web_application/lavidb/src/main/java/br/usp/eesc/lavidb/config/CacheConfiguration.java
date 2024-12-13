package br.usp.eesc.lavidb.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, br.usp.eesc.lavidb.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, br.usp.eesc.lavidb.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, br.usp.eesc.lavidb.domain.User.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.Authority.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.User.class.getName() + ".authorities");
            createCache(cm, br.usp.eesc.lavidb.domain.DatabaseRequest.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.Country.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.CustomUser.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.CustomUser.class.getName() + ".databaseRequests");
            createCache(cm, br.usp.eesc.lavidb.domain.Institution.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.Diagnostic.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.Patient.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.Manufacturer.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.IrradiationEvent.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.Acquisition.class.getName());
            createCache(cm, br.usp.eesc.lavidb.domain.DatabaseVersion.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
