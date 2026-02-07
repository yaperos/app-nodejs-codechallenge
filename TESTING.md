# How to Test the Project (Windows CMD)

## Prerequisites
- Docker & Docker Compose
- Java 17+
- Maven

## 1. Start Infrastructure
Start using Docker Compose:

docker compose up -d

## 2. Test Transaction Creation
Send a POST request to create a transaction.

**Scenario A: Approved Transaction (Value <= 1000)**

curl -X POST http://localhost:8081/transactions ^
  -H "Content-Type: application/json" ^
  -d "{\"accountExternalIdDebit\":\"26066299-4467-4d70-a8af-2415dd537af5\",\"accountExternalIdCredit\":\"d26e431c-b72e-436f-8898-7509e5399580\",\"transferTypeId\":1,\"value\":500}"

**Scenario B: Rejected Transaction (Value > 1000)**

curl -X POST http://localhost:8081/transactions ^
  -H "Content-Type: application/json" ^
  -d "{\"accountExternalIdDebit\":\"26066299-4467-4d70-a8af-2415dd537af5\",\"accountExternalIdCredit\":\"d26e431c-b72e-436f-8898-7509e5399580\",\"transferTypeId\":1,\"value\":1500}"

## 3. Verify Status
The response from the initial POST will be PENDING.  
To check the final status (updated by Anti-Fraud service via Kafka), copy the transactionExternalId from the response and run:

curl -X GET "http://localhost:8081/transactions/{transactionExternalId}"

Replace {transactionExternalId} with the UUID returned from the POST.  
- Scenario A should be APPROVED.  
- Scenario B should be REJECTED.
