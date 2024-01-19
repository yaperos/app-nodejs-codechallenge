Feature: Health check
  I want to verify the health of the application

  Scenario: Check applicacion health
    Given the application running
    When I send a GET request to "/health"
    Then the response status code should be 200
    And the response should be empty