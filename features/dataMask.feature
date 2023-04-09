Feature: Mask PII data

  Scenario Outline: normal case without masking
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData               | expectedData            |
      | this is normal log file | this is normal log file |
      | testing                 | testing                 |

  Scenario Outline: intput email and name text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData     | expectedData   |
      | jlam@test.com | ******         |
      | Peter. Chan   | ******. ****** |

  Scenario Outline: mark Visa Card text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData           | expectedData |
      | 1234-4567-7899-0012 | ******       |
      | 2345 0987 2987 1111 | ******       |

  Scenario Outline: mark password text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData              | expectedData    |
      | password: abcd123$ibye | ******          |
      | pass: abcd123$ibye     | ******          |
      | password abcd123$ibye  | password ****** |

  Scenario Outline: mark data in json file
    Given provide json file "<inputFile>"
    When convert msg from file
    Then validate the out "<expectedData>"
    Examples:
      | inputFile                     | expectedData                                  |
      | features/test_data/test1.json | features/test_data/test1_expected_result.json |
      | features/test_data/test2.json | features/test_data/test2_expected_result.json |

  Scenario: mark data as object format
    Given provide object
    When convert object
    Then the data should be masked
