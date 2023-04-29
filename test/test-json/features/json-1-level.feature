Feature: one level json file to excel

  Scenario Outline: 2 columns
    Given I have a JSON file at "<root_path><json_file>"
    When I generate the Excel file "<root_path>actual-<expected_file>"
    Then the generated Excel file should match the expected file "<root_path><expected_file>"

    Examples:
      | root_path                          | json_file | expected_file    |
      | test/test-json/features/test_data/ | test.json | json-1level.xlsx |
