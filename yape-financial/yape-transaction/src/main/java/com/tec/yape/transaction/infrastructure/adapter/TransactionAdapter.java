package com.tec.yape.transaction.infrastructure.adapter;


import com.tec.yape.transaction.domain.exception.CommonErrorType;
import com.tec.yape.transaction.domain.exception.TransactionException;
import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import com.tec.yape.transaction.domain.port.output.TransactionOutPort;
import com.tec.yape.transaction.infrastructure.helper.TransactionHelper;
import com.tec.yape.transaction.infrastructure.repository.TransactionRepository;
import com.tec.yape.transaction.infrastructure.repository.model.entity.TransactionEntity;
import com.tec.yape.transaction.infrastructure.repository.model.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;


@Component
@RequiredArgsConstructor
public class TransactionAdapter implements TransactionOutPort {

    private final TransactionRepository transactionRepository;

    @Override
    public Page<TransactionResponse> findAllPageable(Pageable pageable) {

        Sort sort = pageable.getSort().isUnsorted() ? Sort.by("id") : pageable.getSort();
        if (!TransactionHelper.validateSorName(sort)) {
            throw new TransactionException(HttpStatus.BAD_REQUEST, CommonErrorType.COMMON_ERROR_400_1.name(), CommonErrorType.COMMON_ERROR_400_1.getDescription());
        }

        return transactionRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort))
                .map(TransactionMapper.MAPPER::toTransactionResponse);
    }

    @Override
    public List<TransactionResponse> findAll() {
        return transactionRepository.findAll().stream()
                .map(TransactionMapper.MAPPER::toTransactionResponse).toList();
    }


    @Override
    public TransactionResponse create(TransactionRequest transactionRequest) {
        TransactionEntity transactionEntity = TransactionMapper.MAPPER.toTransaction(transactionRequest);
        return TransactionMapper.MAPPER.toTransactionResponse(transactionRepository.save(transactionEntity));
    }

    @Override
    public void update(TransactionRequest transactionRequest) {
        TransactionEntity transactionEntity = TransactionMapper.MAPPER.toTransaction(transactionRequest);
        if (transactionEntity == null) {
            throw new TransactionException(HttpStatus.NOT_FOUND, CommonErrorType.COMMON_ERROR_404_1.name(), CommonErrorType.COMMON_ERROR_404_1.getDescription());
        }
        TransactionMapper.MAPPER.toTransactionResponse(transactionRepository.save(transactionEntity));
    }

    @Override
    public TransactionResponse findByExternalId(UUID transactionExternalId) {
        TransactionEntity transactionEntity = transactionRepository.findByTransactionExternalId(transactionExternalId);
        if (transactionEntity == null) {
            throw new TransactionException(HttpStatus.NOT_FOUND,  CommonErrorType.COMMON_ERROR_404_1.name(), CommonErrorType.COMMON_ERROR_404_1.getDescription());
        }

        return TransactionMapper.MAPPER.toTransactionResponse(transactionEntity);
    }
}
