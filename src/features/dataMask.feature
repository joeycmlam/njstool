Feature: Mask PII data

  Scenario Outline : mark the email
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData     | expectedData  |
      | jlam@test.com | EMAIL_ADDRESS |
      | jlam@test.com | jlam@test.com |

