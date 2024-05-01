@ignore

Feature: FileComparator
  As a developer
  I want to ensure that the FileComparator class works correctly
  So that I can reliably compare files

  Scenario: Compare two identical files
    Given I have two files "client.txt" with key "code"
    When I compare the files using FileComparator
    Then I expect the files result
