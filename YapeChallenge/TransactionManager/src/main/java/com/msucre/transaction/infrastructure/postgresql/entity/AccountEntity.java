package com.msucre.transaction.infrastructure.postgresql.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;


@Table(name = "account")
public class AccountEntity {

  @Id
  public UUID id;

  @Column
  public String owner;
}