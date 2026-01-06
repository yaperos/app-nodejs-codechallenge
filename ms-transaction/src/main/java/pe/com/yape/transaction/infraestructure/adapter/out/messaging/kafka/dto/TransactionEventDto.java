package pe.com.yape.transaction.infraestructure.adapter.out.messaging.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
public class TransactionEventDto{

    private UUID transactionExternalId;
    private BigDecimal amount;
}
