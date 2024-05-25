Feature: one level json file to excel

  @ignore
  Scenario Outline: 1 level
    Given I have a JSON file at "<root_path>" "<json_file>"
    When I generate the Excel file "<actual_file>"
    Then the generated Excel file should match the expected file "<expected_file>"

    Examples: 
      | root_path                    | json_file | expected_file    | actual_file     |
      | test/test-json/features/data | test.json | json-1level.xlsx | out-1level.xlsx |

  @ignore
  Scenario Outline: 2 level
    Given I have a JSON file at "<root_path>" "<json_file>"
    When I generate the Excel file "<actual_file>"
    Then the generated Excel file should match the expected file "<expected_file>"

    Examples: 
      | root_path                    | json_file       | expected_file    | actual_file     |
      | test/test-json/features/data | test2level.json | json-2level.xlsx | out-2level.xlsx |
