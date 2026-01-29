package com.tec.yape.antifraud.infrastructure.config;

import com.tec.yape.antifraud.domain.util.BeanConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@Configuration
public class ExecutorAsyncVirtualConfig {

    @Bean(name = BeanConstants.ASYNC_VIRTUAL_SAVE_CALL_HISTORY)
    public Executor asyncVirtualSaveCallHistory() {
        return Executors.newThreadPerTaskExecutor(
                Thread.ofVirtual().name("virtual-thread-", 0)::unstarted
        );
    }
}
