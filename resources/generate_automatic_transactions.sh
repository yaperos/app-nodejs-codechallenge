#!/bin/bash

# Function to generate a random number within a specified range
random_number() {
    echo $(($RANDOM % $1 + $2))
}

# Loop 150 times
for i in {1..3}
do
    # Generate random values for each field
    accountExternalIdDebit=$(random_number 1000 1)    # Random number between 1 and 1000
    accountExternalIdCredit=$(random_number 1000 1)  # Random number between 1 and 1000
    tranferTypeId=$(random_number 10 1)              # Random number between 1 and 10
    value=$(random_number 1000 100)                  # Random number between 100 and 1100

    # Execute the curl command with random data
    curl --location 'http://localhost:3002/transaction-api/v1/transaction' \
    --header 'Content-Type: application/json' \
    --data "{
        \"accountExternalIdDebit\": \"$accountExternalIdDebit\",
        \"accountExternalIdCredit\": \"$accountExternalIdCredit\",
        \"tranferTypeId\": $tranferTypeId,
        \"value\": $value
    }"
    echo "Transaction $i sent"
done
