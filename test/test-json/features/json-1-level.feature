Feature: one level json file to excel

  Scenario Outline: 2 columns
    Given I have a JSON file at "<root_path>" "<json_file>"
    When I generate the Excel file "<actual_file>"
    Then the generated Excel file should match the expected file "<expected_file>"

    Examples:
      | root_path                         | json_file                                   | expected_file                                      | actual_file                                       |
      | test/test-json/features/test_data | test/test-json/features/test_data/test.json | test/test-json/features/test_data/json-1level.xlsx | test/test-json/features/test_data/out-1level.xlsx |
