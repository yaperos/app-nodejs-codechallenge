package pe.com.yape.ms.transaction.application.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.WriteOperation;
import org.springframework.stereotype.Component;
import pe.com.yape.ms.transaction.service.port.CacheRepositoryPort;

/**
 * Endpoint de Actuator para gestionar el cache
 * @author lmarusic
 */
@Component
@Endpoint(id = "cache")
@RequiredArgsConstructor
@Slf4j
public class CacheManagementEndpoint {

    private final CacheRepositoryPort cacheRepository;

    /**
     * Limpia todo el cache de transacciones
     * 
     * Uso: POST /actuator/cache/clear
     */
    @WriteOperation
    public String clear() {
        log.info("Clearing all transaction cache via actuator endpoint");
        cacheRepository.clear();
        return "Cache cleared successfully";
    }
}

