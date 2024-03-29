package com.hust.ecommerce.config;

import com.hust.ecommerce.entity.Order;
import com.hust.ecommerce.entity.Product;
import com.hust.ecommerce.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;
    private final EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnSupportedAction = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        config.getExposureConfiguration().forDomainType(Product.class)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnSupportedAction))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnSupportedAction));

        config.getExposureConfiguration().forDomainType(ProductCategory.class)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnSupportedAction))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnSupportedAction));

        config.getExposureConfiguration().forDomainType(Order.class)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnSupportedAction))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnSupportedAction));

        exposeIds(config);
        cors.addMapping( "/api/**").allowedOrigins(theAllowedOrigins);
    }

    private void exposeIds(RepositoryRestConfiguration config){
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();
        for (EntityType entityType : entities){
            entityClasses.add(entityType.getJavaType());
        }

        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
