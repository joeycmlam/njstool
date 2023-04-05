Feature: Mask PII data

  Scenario Outline: mark intput text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData     | expectedData             |
      | jlam@test.com | EMAIL_ADDRESS            |
      | Peter. Chan   | PERSON_NAME. PERSON_NAME |


  Scenario Outline: mark data in json format
    Given provide json file "<inputFile>"
    When I mask the data
    Then validate the out "<expectedData>"
    Examples:
      | inputFile                     | expectedData                         |
      | features/test_data/test1.json | features/test_data/test1_result.json |
