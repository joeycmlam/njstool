from config import Config
from logger import Logger
from file_parser import FileParser
from record_comparator import RecordComparator
from excel_writer import ExcelWriter
import os

class FileComparisonApp:
    """
    The main orchestrator for the file comparison application.
    """
    def __init__(self, config_path):
        self.config = Config(config_path)
        log_config = self.config.get("log", {})
        self.logger = Logger(log_config).get_logger()
        self.parser = FileParser(self.logger)
        self.comparator = RecordComparator(self.logger)
        
        # Initialize ExcelWriter with output configuration
        output_config = self.config.get("output", {})
        output_config["columns"] = self.config.get("columns", {})
        self.writer = ExcelWriter(self.logger, output_config)

    def run(self):
        try:
            file_a_path = self.config.get("file_a")
            file_b_path = self.config.get("file_b")
            columns = self.config.get("columns")
            skip_keys = set(self.config.get("skip_keys", []))
            output_config = self.config.get("output", {})

            # Parse both files
            file_a_data, _ = self.parser.parse_file(file_a_path, columns, skip_keys)
            file_b_data, _ = self.parser.parse_file(file_b_path, columns, skip_keys)

            # Compare records
            results = self.comparator.compare_records(file_a_data, file_b_data, columns)

            # Write results to Excel
            self.writer.write_to_excel(results)
        except Exception as e:
            self.logger.error(f"An error occurred during file comparison: {e}")
            raise