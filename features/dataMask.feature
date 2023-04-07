Feature: Mask PII data

  Scenario Outline: intput email and name text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData     | expectedData             |
      | jlam@test.com | EMAIL_ADDRESS            |
      | Peter. Chan   | PERSON_NAME. PERSON_NAME |

  Scenario Outline: mark Visa Card text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData           | expectedData       |
      | 1234-4567-7899-0012 | CREDIT_CARD_NUMBER |
      | 2345 0987 2987 1111 | CREDIT_CARD_NUMBER |


  Scenario Outline: mark data in json format
    Given provide json file "<inputFile>"
    When convert msg from file
    Then validate the out "<expectedData>"
    Examples:
      | inputFile                     | expectedData                                  |
      | features/test_data/test1.json | features/test_data/test1_expected_result.json |
      | features/test_data/test2.json | features/test_data/test2_expected_result.json |
