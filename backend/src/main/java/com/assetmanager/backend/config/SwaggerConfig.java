package com.assetmanager.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI basOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Asset Manager API")
                        .version("1.0.0")
                        .description("Documentation for Asset Manager Backend"));
    }
}
