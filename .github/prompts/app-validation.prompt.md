---
mode: "app-validation.agent"
description: " Create an Validation Enhancement Tool to validate the data files in csv format."

## Background
We have an existing data validation tool under `app-validation` that currently validates field lengths based on JSON configuration. We need to enhance this tool to also validate reference data against master lists.

## Requirements
1. Enhance the existing validation tool to support reference data validation.
2. Implement validation of gender values in "data/sample.csv" against allowed values in "data/gender.csv".
3. Log records with invalid gender values as "INVALID FORMAT" in the validation results.
4. Maintain existing length validation functionality.
5. Follow our current architecture patterns and coding standards.

## Technical Details
- The master file "data/gender.csv" contains allowed gender values
- Each record in "data/sample.csv" should have its gender value validated
- Implementation should be reusable for other reference data validations in future
- Configuration should specify which fields need reference validation and against which master files

## Implementation Suggestions
1. Extend the configuration schema to support reference data validation rules
2. Create a ReferenceDataValidator class that can load and validate against reference data files
3. Update the main DataValidator to use both length and reference validations
4. Add proper error handling and logging for reference data issues

# Project Structure
root: njstool
    - src
        - app
            - app-validation
                - config
                - data
                - log                

File:
    config/config.loca.json: local configuration file
    data/gender.csv: reference data, csv with pipeline | as delimiter
    data/sample.csv: sample data to be validated, csv with pipeline | as delimiter
    app-valulation/app.validate.py: main to start up the app
    app-valulation/app.config.json: configuration file reader
    app-valulation/data_validator.py: main validation logic
    app-valulation/reference_data_validator.py: a class for reference data validation

## Example Configuration Addition
```json
{
  "data_file": "./data/sample.csv",
  "gender_file": "./data/gender.csv",
  "delimiter": "|",
  "header": true,
  "columns": {
    "customer_code": {
      "length": 8,
      "skip": true
    },
    "first_name": {
      "length": 12,
      "skip": false
    },
    "last_name": {
      "length": 20,
      "skip": false
    },
    "address": {
      "length": 50,
      "skip": false
    },
    "gender": {
      "length": 1,
      "reference": {
        "file": "data/gender.csv",
        "valueColumn": "code"
      }, 
      "skip": false
    },
    "status": {
      "start": 26,
      "length": 20,
      "skip": false
    }
  },
  "output": {
      "path": "./result",
        "file": "validation.xlsx",
        "sheet_name": "Results",
        "headers": ["Row ID", "Column" , "Value",  "Status"],
        "timestamped": true
  },
  "log": {
    "path": "./log",
    "file": "app.log",
    "level": "DEBUG",
    "enable_console": true
  }

}
```

## Acceptance Criteria
- Gender values not found in the reference file are marked as "INVALID FORMAT" in results
- Reference validation can be enabled/disabled via configuration
- Code follows our established patterns for testability and maintainability
- Appropriate unit tests are added for the new functionality

Please provide a complete implementation with all necessary changes to the existing codebase.