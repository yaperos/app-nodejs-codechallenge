#!/bin/bash

set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}Testing Transaction Service API${NC}"
echo -e "${YELLOW}Base URL: $BASE_URL${NC}"
echo -e "${YELLOW}======================================${NC}\n"

echo -e "${YELLOW}[1/3] Creating a valid transaction (amount: 500)...${NC}"
CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "123e4567-e89b-12d3-a456-426614174000",
    "accountExternalIdCredit": "123e4567-e89b-12d3-a456-426614174001",
    "tranferTypeId": 1,
    "value": 500
  }')

HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$CREATE_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✓ Transaction created successfully${NC}"
    echo "$RESPONSE_BODY" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))"
    TRANSACTION_ID=$(echo "$RESPONSE_BODY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).transactionExternalId)")
    echo -e "${GREEN}Transaction ID: $TRANSACTION_ID${NC}\n"
else
    echo -e "${RED}✗ Failed to create transaction (HTTP $HTTP_CODE)${NC}"
    echo "$RESPONSE_BODY"
    exit 1
fi

echo -e "${YELLOW}[2/3] Getting transaction by ID...${NC}"
GET_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/transactions/$TRANSACTION_ID")
HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$GET_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Transaction retrieved successfully${NC}"
    echo "$RESPONSE_BODY" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))"
    echo ""
else
    echo -e "${RED}✗ Failed to get transaction (HTTP $HTTP_CODE)${NC}"
    echo "$RESPONSE_BODY"
    exit 1
fi

echo -e "${YELLOW}[3/3] Creating high-value transaction (should be flagged by anti-fraud)...${NC}"
CREATE_HIGH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "123e4567-e89b-12d3-a456-426614174002",
    "accountExternalIdCredit": "123e4567-e89b-12d3-a456-426614174003",
    "tranferTypeId": 1,
    "value": 1500
  }')

HTTP_CODE=$(echo "$CREATE_HIGH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$CREATE_HIGH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✓ High-value transaction created${NC}"
    echo "$RESPONSE_BODY" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))"
    HIGH_TRANSACTION_ID=$(echo "$RESPONSE_BODY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).transactionExternalId)")
    echo -e "${YELLOW}Note: This transaction should be processed by anti-fraud service${NC}"
    echo -e "${YELLOW}Check anti-fraud logs for validation results${NC}\n"
else
    echo -e "${RED}✗ Failed to create high-value transaction (HTTP $HTTP_CODE)${NC}"
    echo "$RESPONSE_BODY"
    exit 1
fi

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}All Transaction API tests passed! ✓${NC}"
echo -e "${GREEN}======================================${NC}"
