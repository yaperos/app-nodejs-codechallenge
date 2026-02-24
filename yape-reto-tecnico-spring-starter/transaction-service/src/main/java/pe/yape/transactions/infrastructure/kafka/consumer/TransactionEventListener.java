package pe.yape.transactions.infrastructure.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pe.yape.transactions.domain.model.TransactionStatus;
import pe.yape.transactions.domain.repository.TransactionRepository;
import pe.yape.transactions.infrastructure.antifraud.AntifraudClient;
import pe.yape.transactions.domain.event.TransactionCreatedEvent;

@Component
public class TransactionEventListener {

    private final TransactionRepository repository;
    private final AntifraudClient antifraudClient;

    public TransactionEventListener(TransactionRepository repository,
                                    AntifraudClient antifraudClient) {
        this.repository = repository;
        this.antifraudClient = antifraudClient;
    }

    @KafkaListener(topics = "transactions.created", groupId = "transaction-service")
    @Transactional
    public void handle(TransactionCreatedEvent event){

        var txOpt = repository.findByExternalId(event.transactionExternalId());
        if(txOpt.isEmpty()) return;

        var tx = txOpt.get();

        if(tx.getStatus() != TransactionStatus.PENDING) return;

        var decision = antifraudClient.validate(event);

        if("APPROVED".equals(decision.status())){
            tx.approve(decision.score());
        }else{
            tx.reject(decision.score());
        }

        repository.save(tx);
    }
}