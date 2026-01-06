package pe.com.yape.orchestrator.application.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

/**
 * Configuracion de WebClient
 * 
 * @author lmarusic
 * @version 1.0.0
 */
@Configuration
public class WebClientConfig {
    
    @Value("${services.transaction.base-url}")
    private String transactionServiceBaseUrl;
    
    @Value("${services.transaction.timeout:5000}")
    private int timeout;
    
    @Bean
    public WebClient transactionServiceWebClient(WebClient.Builder webClientBuilder) {
        // Configurar HttpClient con Netty
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, timeout)
                .responseTimeout(Duration.ofMillis(timeout))
                .doOnConnected(conn -> 
                    conn.addHandlerLast(new ReadTimeoutHandler(timeout, TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(timeout, TimeUnit.MILLISECONDS))
                );
        
        return webClientBuilder
                .baseUrl(transactionServiceBaseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}

