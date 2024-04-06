Feature: Excel to JSON conversion for DataTransformv2

  Scenario Outline: v2-Validate Excel to JSON conversion
    Given v2-I have an Excel file "<excel_file>" and "<config_file>"
    When v2-I convert the Excel file to JSON
    Then v2-the JSON output should match the expected JSON file "<expect_result>"

    Examples: 
      | excel_file     | expect_result    | config_file |
      | sample.08.xlsx | expected.08.json | config.json |

