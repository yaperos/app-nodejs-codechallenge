package com.challenge.transaction.app.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI transactionApi() {

        return new OpenAPI()
                .info(new Info()
                        .title("Transaction API")
                        .description("Reto de Yape")
                        .version("1.0"));

    }

}
