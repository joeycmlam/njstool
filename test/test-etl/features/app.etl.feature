
Feature: ETL Processing
  As a developer,
  I want to test the ETL process
  So that I can ensure the data is correctly loaded into the database

@ignore
  Scenario Outline: Loading account data from an interface file
    Given the interface file "<data_file>" and "<table_name>"
    When file arrive
    Then call eltProcesser.ts to load the data into database and expect the job is <status> and number of record <total_record>

    Examples: 
      | data_file                                 | table_name | status | total_record |
      | test/test-etl/test-data/account-data.xlsx | account    |      0 |         1000 |

@ignore
  Scenario Outline: Loading holding data from an interface file
    Given the interface file "<data_file>" and "<table_name>"
    When file arrive
    Then call eltProcesser.ts to load the data into database and expect the job is <status> and number of record <total_record>

    Examples: 
      | data_file                                 | table_name | status | total_record |
      | test/test-etl/test-data/holding-data.xlsx | holding    |      0 |         1000 |
