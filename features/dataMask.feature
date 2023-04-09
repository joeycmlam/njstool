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
      | inputData                                 | expectedData                            |
      | 1234-4567-7899-0012                       | ******                                  |
      | 2345 0987 2987 1111                       | ******                                  |
      | my bank account number is 43231-0998-1923 | my bank account number is ******-****** |

  Scenario Outline: mark password text
    Given provide the a string "<inputData>"
    When I mask the data
    Then output is "<expectedData>"

    Examples:
      | inputData              | expectedData |
      | password: abcd123$ibye | ******       |
      | pass: abcd123$ibye     | ******       |
      | password abcd123$ibye  | ******       |
      | token abcd123$ibye     | ******       |

  Scenario: mark data as object format
    Given provide object
    When convert object
    Then the data should be masked

  Scenario: mark data as array of object format
    Given provide array of object
    When convert object
    Then the data should be masked

  Scenario Outline: mark data in json file
    Given provide json file "<inputFile>"
    When convert msg from file
    Then validate the out "<expectedData>"
    Examples:
      | inputFile                     | expectedData                                  |
      | features/test_data/test1.json | features/test_data/test1_expected_result.json |
      | features/test_data/test2.json | features/test_data/test2_expected_result.json |
      | features/test_data/test3.json | features/test_data/test3_expected_result.json |

  Scenario: mark data in json file for nested of array
    Given provide json file "features/test_data/test4.json"
    When convert msg from file
    Then validate the out "features/test_data/test4_expected_result.json"


  Scenario Outline: number case
    Given provide integer "<inputData>"
    When convert object
    Then integer output is "<expectedData>"

    Examples:
      | inputData | expectedData |
      | 123       | 123          |
