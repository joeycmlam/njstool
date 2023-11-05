Feature: ETL Processing
  As a developer,
  I want to test the ETL process
  So that I can ensure the data is correctly loaded into the database

  Scenario Outline: Loading data from an interface file
    Given the interface file "<data_file>"
    When file arrive
    Then call eltProcesser.ts to load the data into database and expect the job is <status> and number of record <total_record>

    Examples:
      | data_file | status | total_record |
      | test/test-etl/test-data/account-data.xlsx | 0 | 1000 |