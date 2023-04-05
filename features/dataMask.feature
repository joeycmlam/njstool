Feature: Mask PII data

  Scenario Outline: mark the email
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData     | expectedData             |
      | jlam@test.com | EMAIL_ADDRESS            |
      | Peter. Chan   | PERSON_NAME. PERSON_NAME |

