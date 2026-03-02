package com.codeh.transaction_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transaction_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionType {

    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}