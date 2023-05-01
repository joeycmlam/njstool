Feature: Test REST API

  Scenario: Test health check API
    Given the application is running at "http://localhost:3000"
    When I make a GET request to "/health"
    Then the response status code is "200"
    And the response version is "1.0.0"


  Scenario Template: Test get json file
    Given the application is running at "http://localhost:3000"
    When I make a GET request to "/files" "<filename>"
    Then the response status code is "200"
    And the response body is "<output>"

    Examples:
      | filename        | output                   |
      | test.json       | test.expected.json       |
      | test2level.json | test2level.expected.json |
