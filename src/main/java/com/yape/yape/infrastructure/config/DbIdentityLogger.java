package com.yape.yape.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DbIdentityLogger implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        var row = jdbcTemplate.queryForMap("""
      select inet_server_addr() as host,
             inet_server_port() as port,
             current_database() as db,
             current_schema() as schema,
             current_user as usr
    """);
        log.info("[DB_IDENTITY] {}", row);
    }
}
