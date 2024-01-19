Feature: Paginated transactions
  I want to paginated saved transactions

  Background:
    Given the application running
    But only the transaction saved:
      """
      {
        "id": "7422280d-9f7f-4470-9e95-4cb286c17fc0",
        "creditAccountExternalId": "815fc8b3-3cf6-4c05-ac65-63a623b15755",
        "debitAccountExternalId": "c7ed27c0-5df9-4760-b3c9-ccc1bee913da",
        "amount": 1200,
        "transferType": "3",
        "validationStatus": "rejected"
      }
      """
    And the transaction saved:
      """
      {
        "id": "97194702-860b-45a2-866a-20ae3248e9d7",
        "creditAccountExternalId": "6cafd57c-b53c-429a-abe1-015944559cf9",
        "debitAccountExternalId": "6cc0277a-995e-4445-b6ad-fa6f40882727",
        "amount": 900,
        "transferType": "2",
        "validationStatus": "approved"
      }
      """

  Scenario: Default paginated transactions
    When I send a transaction grpc request to "findPaginated" with data:
      """
      {}
      """
    Then the grpc response code should be 200
    And the grpc response data should be:
      """
      {
        "items": [
          {
            "id": "97194702-860b-45a2-866a-20ae3248e9d7",
            "amount": 900,
            "transferType": {
              "id": "2",
              "name": "EXTERNAL"
            },
            "validationStatus": "approved",
            "createdAt": "2024-12-10T22:44:51.804Z"
          },
          {
            "id": "7422280d-9f7f-4470-9e95-4cb286c17fc0",
            "amount": 1200,
            "transferType": {
              "id": "3",
              "name": "INTERNAL"
            },
            "validationStatus": "rejected",
            "createdAt": "2024-12-10T22:44:51.804Z"
          }
        ],
        "page": 1,
        "limit": 10,
        "pages": 1,
        "total": 2,
        "filters": []
      }
      """

  Scenario: paginated transactions with all data request
    When I send a transaction grpc request to "findPaginated" with data:
      """
      {
        "page": 1,
        "limit": 1,
        "orderBy": "createdAt",
        "order": "asc",
        "filters": [
          {
            "field": "transferType",
            "operator": "=",
            "value": "2"
          }
        ]
      }
      """
    Then the grpc response code should be 200
    And the grpc response data should be:
      """
      {
        "items": [
          {
            "id": "97194702-860b-45a2-866a-20ae3248e9d7",
            "amount": 900,
            "transferType": {
              "id": "2",
              "name": "EXTERNAL"
            },
            "validationStatus": "approved",
            "createdAt": "2024-12-10T22:44:51.804Z"
          }
        ],
        "page": 1,
        "limit": 1,
        "pages": 1,
        "total": 1,
        "filters": [
          {
            "field": "transferType",
            "operator": "=",
            "value": "2"
          }
        ]
      }
      """