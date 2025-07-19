# Business Rules Engine Test Suite

This directory contains tests for the BusinessRulesEngine class that categorizes securities based on business rules.

## Test Structure

- `features/business-rules-engine.feature` - Cucumber feature file describing test scenarios
- `features/step_definitions/business-rules-engine.steps.py` - Python step definitions for Cucumber
- `test_business_rules_engine.py` - Simple test runner script

## Running the Tests

### Option 1: Simple Test Runner (Recommended)

Run the simple test runner script:

```bash
cd src/app/app-etl-py/test
python test_business_rules_engine.py
```

This will run all tests and provide a detailed report.

### Option 2: Cucumber Tests

To run the Cucumber tests, you'll need to set up the proper test environment:

```bash
# Install dependencies (if not already installed)
npm install

# Run Cucumber tests
npx cucumber-js src/app/app-etl-py/test/features/
```

## Test Scenarios

The test suite covers the following scenarios:

### 1. Security Categorization
- **Onshore Equity**: HK country with Equity or ETF security type
- **Offshore Equity**: Non-HK country with Equity or ETF security type  
- **Onshore Fixed Income**: HK country with Bond security type
- **Offshore Fixed Income**: Non-HK country with Bond security type
- **Currency**: Currency security type
- **Commodity**: Commodity security type
- **Others**: Any other combination

### 2. Edge Cases
- Records with missing fields
- Empty records
- Records with None values
- Records with empty strings
- Case sensitivity

## Expected Results

All tests should pass with the following categorizations:

| Country | Security Type | Expected Category |
|---------|---------------|-------------------|
| HK      | Equity        | onshore_equity    |
| HK      | ETF           | onshore_equity    |
| US      | Equity        | offshore_equity   |
| JP      | ETF           | offshore_equity   |
| HK      | Bond          | onshore_fixed_income |
| US      | Bond          | offshore_fixed_income |
| JP      | Currency      | currency          |
| DE      | Commodity     | commodity         |
| CN      | REIT          | others            |

## Troubleshooting

If you encounter import errors, make sure:

1. The `businessrulesengine.py` file exists in the parent directory
2. The `py_rules` package is installed
3. You're running the tests from the correct directory

## Dependencies

- Python 3.6+
- py_rules package
- The BusinessRulesEngine class from `../businessrulesengine.py` 