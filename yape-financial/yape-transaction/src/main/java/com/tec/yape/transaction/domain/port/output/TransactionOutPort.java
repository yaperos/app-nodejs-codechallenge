package com.tec.yape.transaction.domain.port.output;

import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TransactionOutPort {

    Page<TransactionResponse> findAllPageable(Pageable pageable);

    List<TransactionResponse> findAll();

    TransactionResponse create(TransactionRequest transactionRequest);

    void update(TransactionRequest transactionRequest);

    TransactionResponse findByExternalId(UUID transactionExternalId);
}
