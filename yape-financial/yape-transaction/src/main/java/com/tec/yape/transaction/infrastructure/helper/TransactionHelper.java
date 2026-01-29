package com.tec.yape.transaction.infrastructure.helper;

import org.springframework.data.domain.Sort;

public class TransactionHelper {

    private TransactionHelper() {

    }

    public static boolean validateSorName(Sort sort) {
        if (sort.isSorted()) {
            return !sort.iterator().next().getProperty().equals("string");
        } else {
            System.out.println("No sort criteria applied");
            return true;
        }
    }
}
