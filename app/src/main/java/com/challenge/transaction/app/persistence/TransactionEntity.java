package com.challenge.transaction.app.persistence;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
public class TransactionEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 4397230746145932537L;

    @Id
    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private Double value;
    private String status;
    private LocalDateTime createdAt;
}
