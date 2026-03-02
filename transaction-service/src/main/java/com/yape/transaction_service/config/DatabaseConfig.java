package com.yape.transaction_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;
import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {

    private final DataSource dataSource;

    public DatabaseConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void initDatabase() {
        try {
            ClassPathResource schema = new ClassPathResource("schema-postgresql.sql");
            ClassPathResource data = new ClassPathResource("data-postgresql.sql");

            System.out.println("=== schema existe: " + schema.exists() + " ===");
            System.out.println("=== data existe: " + data.exists() + " ===");
            System.out.println("=== schema path: " + schema.getPath() + " ===");

            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(schema);
            populator.addScript(data);
            populator.setContinueOnError(false);
            populator.execute(dataSource);
            System.out.println("=== SCRIPTS EJECUTADOS EXITOSAMENTE ===");
        } catch (Exception e) {
            System.out.println("=== ERROR: " + e.getMessage() + " ===");
            e.printStackTrace();
        }
    }

}
