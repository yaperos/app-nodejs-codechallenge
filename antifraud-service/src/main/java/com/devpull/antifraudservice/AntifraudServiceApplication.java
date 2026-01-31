package com.devpull.antifraudservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.r2dbc.autoconfigure.R2dbcAutoConfiguration;

@SpringBootApplication(exclude = {
        R2dbcAutoConfiguration.class // Exclude R2DBC auto-configuration
})
public class AntifraudServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AntifraudServiceApplication.class, args);
    }

}
