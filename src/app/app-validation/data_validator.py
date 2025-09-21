import os
import csv
import re
from typing import Dict, List, Any, Optional
from datetime import datetime
import pandas as pd
from config import Config
from reference_validator import ReferenceValidator


class ValidationRule:
    """Represents a validation rule for a field."""

    def __init__(self, field_name: str, config: Dict[str, Any]):
        self.field_name = field_name
        self.skip = config.get("skip", False)
        self.length = config.get("length")
        self.pattern = config.get("pattern")
        self.compiled_pattern = None
        self.reference = "reference" in config

        # Compile pattern if provided
        if self.pattern:
            try:
                self.compiled_pattern = re.compile(self.pattern)
            except re.error:
                # Let the validator handle this error
                pass


class ValidationResult:
    """Represents the result of a validation check."""

    def __init__(self, row_id: int, column: str, value: str, status: str = "PASS"):
        self.row_id = row_id
        self.column = column
        self.value = value
        self.status = status

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for output."""
        return {
            "row_id": self.row_id,
            "column": self.column,
            "value": self.value,
            "status": self.status
        }


class FieldValidator:
    """Handles validation of individual fields."""

    def __init__(self, rules: Dict[str, ValidationRule], ref_validator: ReferenceValidator, logger):
        self.rules = rules
        self.ref_validator = ref_validator
        self.logger = logger

    def validate_field(self, field: str, value: str, row_id: int) -> ValidationResult:
        """Validate a field value against all applicable rules."""
        if field not in self.rules:
            return ValidationResult(row_id, field, value)

        rule = self.rules[field]

        # Skip validation if configured
        if rule.skip:
            return ValidationResult(row_id, field, value)

        # Length validation
        if rule.length is not None and len(str(value)) > int(rule.length):
            self.logger.warning(f"Row {row_id}, field '{field}': Value '{value}' exceeds max length")
            return ValidationResult(row_id, field, value, "INVALID LENGTH")

        # Pattern validation
        if rule.compiled_pattern and not rule.compiled_pattern.fullmatch(str(value)):
            self.logger.warning(f"Row {row_id}, field '{field}': Value '{value}' has invalid format")
            return ValidationResult(row_id, field, value, "INVALID CHARACTER")

        # Reference validation
        if rule.reference and not self.ref_validator.validate(field, value):
            self.logger.warning(f"Row {row_id}, field '{field}': Value '{value}' not found in reference data")
            return ValidationResult(row_id, field, value, "INVALID FORMAT")

        return ValidationResult(row_id, field, value)


class ResultWriter:
    """Handles writing validation results to output files."""

    def __init__(self, output_config: Dict[str, Any], logger):
        self.output_config = output_config or {}
        self.logger = logger

    def write_results(self, results: List[ValidationResult]) -> Optional[str]:
        """Write validation results to file based on configuration."""
        if not self.output_config or not results:
            return None

        output_path = self.output_config.get("path", "./result")
        output_file = self.output_config.get("file", "validation_results.csv")

        # Create output directory if needed
        os.makedirs(output_path, exist_ok=True)

        # Add timestamp if configured
        if self.output_config.get("timestamped", False):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_name, file_ext = os.path.splitext(output_file)
            output_file = f"{file_name}_{timestamp}{file_ext}"

        full_path = os.path.join(output_path, output_file)

        try:
            # Convert results to dicts for easier handling
            result_dicts = [r.to_dict() for r in results]

            # Determine output format and write
            if output_file.lower().endswith('.xlsx'):
                self._write_excel(result_dicts, full_path)
            else:
                self._write_csv(result_dicts, full_path)

            self.logger.info(f"Wrote {len(results)} validation results to {full_path}")
            return full_path

        except Exception as e:
            self.logger.error(f"Error writing results: {e}")
            return None

    def _write_excel(self, results: List[Dict[str, Any]], output_path: str):
        """Write results to Excel file."""
        headers = self.output_config.get("headers", ["Row ID", "Column", "Value", "Status"])

        # Convert to DataFrame
        df = pd.DataFrame(results)

        # Rename columns if headers provided
        if headers and len(headers) >= 4:
            mapping = {
                'row_id': headers[0],
                'column': headers[1],
                'value': headers[2],
                'status': headers[3]
            }
            df = df.rename(columns=mapping)

        # Write to Excel
        sheet_name = self.output_config.get("sheet_name", "Results")
        df.to_excel(output_path, sheet_name=sheet_name, index=False)

    def _write_csv(self, results: List[Dict[str, Any]], output_path: str):
        """Write results to CSV file."""
        # headers = self.output_config.get("headers", ["Row ID", "Column", "Value", "Status"])

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['row_id', 'column', 'value', 'status'])
            writer.writeheader()
            writer.writerows(results)


class DataValidator:
    """
    Reads a delimited file, validates field values against various rules,
    and writes validation results to output file.
    """

    def __init__(self, config: Config, logger):
        """Initialize validator with configuration and logger."""
        self.config = config
        self.logger = logger

        # Extract basic configuration
        self.data_file = self.config.get("data_file", "")
        self.delimiter = self.config.get("delimiter", ",")
        self.has_header = self.config.get("header", True)

        # Initialize validators
        self._setup_validation_components()

    def _setup_validation_components(self):
        """Set up validation components."""
        # Extract column configs
        column_configs = self.config.get("columns", {})

        # Set up reference validator
        self.ref_validator = ReferenceValidator(self.logger)
        self._initialize_reference_validators(column_configs)

        # Create validation rules
        self.validation_rules = {
            field: ValidationRule(field, config)
            for field, config in column_configs.items()
        }

        # Create field validator
        self.field_validator = FieldValidator(
            self.validation_rules,
            self.ref_validator,
            self.logger
        )

        # Create result writer
        self.result_writer = ResultWriter(
            self.config.get("output", {}),
            self.logger
        )

    def _initialize_reference_validators(self, column_configs: Dict[str, Dict[str, Any]]):
        """Load reference data for validation."""
        for field_name, field_config in column_configs.items():
            if "reference" in field_config and isinstance(field_config["reference"], dict):
                ref_config = field_config["reference"]
                ref_file = ref_config.get("file", "")
                value_column = ref_config.get("valueColumn", "code")
                ref_delimiter = ref_config.get("delimiter", self.delimiter)

                if ref_file:
                    self.logger.info(f"Loading reference data for {field_name} from {ref_file}")
                    self.ref_validator.load_reference_file(
                        field_name,
                        ref_file,
                        value_column,
                        ref_delimiter
                    )

    def run(self):
        """Execute validation process on the configured data file."""
        self.logger.info(f"Starting data validation of {self.data_file}")

        if not os.path.isfile(self.data_file):
            self.logger.error(f"Data file not found: {self.data_file}")
            raise FileNotFoundError(f"Data file not found: {self.data_file}")

        # Validate data file
        all_results = self._validate_data_file()

        # Write results
        self.result_writer.write_results(all_results)

        # Log summary
        self._log_validation_summary(all_results)

        return all_results

    def _validate_data_file(self) -> List[ValidationResult]:
        """Read and validate the data file."""
        all_results = []

        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter=self.delimiter) if self.has_header else None

                if self.has_header and not reader.fieldnames:
                    raise ValueError("Failed to parse header row")

                # Track progress
                row_count = 0
                start_time = datetime.now()

                # Process with header
                if self.has_header:
                    for row_idx, row in enumerate(reader, start=2):  # Start at 2 for header row
                        row_results = self._validate_row(row_idx, row)
                        all_results.extend(row_results)

                        # Log progress for large files
                        row_count += 1
                        if row_count % 100000 == 0:
                            self.logger.info(f"Processed {row_count} rows...")

                # Log processing time
                elapsed = (datetime.now() - start_time).total_seconds()
                self.logger.info(f"Processed {row_count} rows in {elapsed:.2f} seconds")

        except Exception as e:
            self.logger.error(f"Error during validation: {e}")
            raise

        return all_results

    def _validate_row(self, row_id: int, row: Dict[str, str]) -> List[ValidationResult]:
        """Validate all fields in a single row."""
        results = []

        for field, value in row.items():
            # Validate each field
            result = self.field_validator.validate_field(field, value, row_id)
            results.append(result)

        return results

    def _log_validation_summary(self, results: List[ValidationResult]):
        """Log summary of validation results."""
        total = len(results)
        failed = sum(1 for r in results if r.status != "PASS")
        passed = total - failed

        self.logger.info(f"Validation complete: {total} checks, {failed} failed, {passed} passed")