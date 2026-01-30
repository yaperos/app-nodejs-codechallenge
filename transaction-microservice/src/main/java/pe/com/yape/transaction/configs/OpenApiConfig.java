package pe.com.yape.transaction.configs;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("OCS Api")
                        .version("1.0.0")
                        .description("OCS Api Documentation")
                        .contact(new Contact()
                                .name("Empresa")
                                .email("Email")
                                .url("Url")));
    }
}