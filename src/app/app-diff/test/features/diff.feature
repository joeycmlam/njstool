@ignore
Feature: FileComparator

  Scenario Outline: Match
    Given I have two files "<file1>" and "<file2> with config "<config>"
    When I compare the files using FileComparator
    Then the total number of matching rows should be <matches>
    When I compare the files using FileComparator
    Then the total number of matching rows should be <matches>
    And the total number of mismatching rows should be <mismatches>

    Examples:
      | config             | file1      | file2      | matches | mismatches |
      | config/config.json | client.txt | client.txt |     100 |          0 |
