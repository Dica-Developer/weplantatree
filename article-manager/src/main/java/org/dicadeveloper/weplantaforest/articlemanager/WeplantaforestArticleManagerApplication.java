package org.dicadeveloper.weplantaforest.articlemanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

@SpringBootApplication
@EntityScan(basePackageClasses = { WeplantaforestArticleManagerApplication.class, Jsr310JpaConverters.class })
@ComponentScan(basePackages = { "org.dicadeveloper.weplantaforest.*" })
@EnableCaching
public class WeplantaforestArticleManagerApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(WeplantaforestArticleManagerApplication.class, args);
    }
}
