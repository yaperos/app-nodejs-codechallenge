package com.yape.antifraud.aplication.impl;

import org.springframework.stereotype.Component;
import static com.yape.antifraud.utils.Constants.MAX_ALLOWED_VALUE;

@Component
public class FraudPolicy {

  public boolean isFraud(double amount) {
    return amount > MAX_ALLOWED_VALUE;
  }
}
