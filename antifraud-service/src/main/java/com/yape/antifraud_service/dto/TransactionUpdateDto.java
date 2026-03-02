package com.yape.antifraud_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionUpdateDto {
    private String status; // "APPROVED" o "REJECTED"
}