from dataclasses import dataclass
import os
import logging
from config import Config             # adjust import name if different


@dataclass
class ValidationRule:
    column: str
    max_length: int  # you can rename to 'length' if exact match required
    mode: str = "max"  # "max" = value length <= max_length; "equal" = ==


@dataclass
class ValidationResult:
    row_id: int
    column: str
    value: str
    passed: bool

    def to_row(self, pass_label: str, fail_label: str):
        return {
            "row_id": self.row_id,
            "column": self.column,
            "value": self.value,
            "result": pass_label if self.passed else fail_label
        }


class DataValidator:
    """
    Reads a delimited file, validates field lengths based on JSON config,
    and writes a result file with: row id | column name | value | pass/fail.
    """

    def __init__(self, config: Config, logger: logging.Logger = None):
        self.config = config
        file_path = self.config.get("data_file", "")
        if not file_path:
            raise ValueError("Input file not specified (config.file missing).")
        self.columns = self.config.get("columns", {})
        self.delimiter = self.config.get("delimiter", ",")
        self.logger = logger

    def action(self):
        try:
            if not os.path.isfile(self.config.get("data_file")):
                raise FileNotFoundError(f"Data file not found: {self.config.get('data_file')}")

            with open(self.config.get("data_file"), "r", encoding="utf-8") as f:
                header = f.readline().strip().split(self.delimiter)
                for row_id, line in enumerate(f, start=2):
                    values = line.strip().split(self.delimiter)
                    if len(values) != len(header):
                        self.logger.warning(f"Row {row_id} has {len(values)} columns, expected {len(header)}.")
                    yield {"row_id": row_id, **dict(zip(header, values))}

                    for record in values:
                        self.logger.info(f"Record: {record}")
        except Exception as e:
            self.logger.error(f"An error occurred during validation: {e}")
            raise
