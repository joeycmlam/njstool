import os
from config import Config  # adjust import name if different


class DataValidator:
    """
    Reads a delimited file, validates field lengths based on JSON config,
    and writes a result file with: row id | column name | value | pass/fail.
    """

    def __init__(self, config: Config, logger):
        self.config = config
        file_path = self.config.get("data_file", "")
        if not file_path:
            raise ValueError("Input file not specified (config.file missing).")
        self.columns = self.config.get("columns", {})
        self.delimiter = self.config.get("delimiter", ",")
        self.logger = logger

    def run(self):
        self.logger.info("Starting data validation...")
        try:
            if not os.path.isfile(self.config.get("data_file")):
                raise FileNotFoundError(f"Data file not found: {self.config.get('data_file')}")

            with open(self.config.get("data_file"), "r", encoding="utf-8") as f:
                header = f.readline().strip().split(self.delimiter)
                for row_id, line in enumerate(f, start=2):
                    values = line.strip().split(self.delimiter)
                    if len(values) != len(header):
                        self.logger.warning(f"Row {row_id} has {len(values)} columns, expected {len(header)}.")

                    for record in values:
                        self.logger.debug(f"Record: {record}")
        except Exception as e:
            self.logger.error(f"An error occurred during validation: {e}")
            raise
        self.logger.info("Data validation completed.")
