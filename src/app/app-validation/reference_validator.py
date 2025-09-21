import os
import csv
from typing import Dict, Set, Optional, List, Any


class ReferenceValidator:
    """
    Manages reference data validation by loading reference CSV files once
    and providing efficient in-memory validation for high-volume processing.

    Optimized for performance with large datasets (1M+ records).
    """

    def __init__(self, logger):
        """
        Initialize the reference validator with logger.
        """
        self.logger = logger
        self._reference_data: Dict[str, Set[str]] = {}
        self._file_cache: Dict[str, str] = {}  # File path to field mapping for tracking

    def load_reference_file(self, field_name: str, file_path: str, value_column: str = "code",
                            delimiter: str = ",") -> bool:
        """
        Load reference data from CSV file into memory for fast lookups.

        Args:
            field_name: Field identifier (used as dictionary key)
            file_path: Path to CSV file containing reference data
            value_column: Column name in CSV containing valid values
            delimiter: Delimiter character for CSV file (default: '|')

        Returns:
            bool: Success or failure
        """
        # Return cached data if we've already loaded this file
        if field_name in self._reference_data and self._file_cache.get(file_path) == field_name:
            self.logger.debug(f"Using cached reference data for {field_name}")
            return True

        try:
            if not os.path.isfile(file_path):
                self.logger.error(f"Reference file not found: {file_path}")
                return False

            # Use set for O(1) lookups during validation
            valid_values = set()

            with open(file_path, 'r', encoding='utf-8') as f:
                # Use explicit delimiter (pipe) instead of detection
                self.logger.debug(f"Reading reference file {file_path} with delimiter '{delimiter}'")

                # Read and process the file with explicit delimiter
                reader = csv.DictReader(f, delimiter=delimiter)

                # Validate column exists
                if not reader.fieldnames:
                    self.logger.error(
                        f"Failed to parse header in {file_path}. Check if delimiter '{delimiter}' is correct.")
                    return False

                if value_column not in reader.fieldnames:
                    self.logger.error(f"Column '{value_column}' not found in {file_path}")
                    self.logger.debug(f"Available columns: {reader.fieldnames}")
                    return False

                # Load values into set
                row_count = 0
                for row in reader:
                    value = row.get(value_column)
                    if value is not None:  # Skip None values but allow empty strings if needed
                        valid_values.add(value)
                    row_count += 1

            # Store in memory for future validations
            self._reference_data[field_name] = valid_values
            self._file_cache[file_path] = field_name

            self.logger.info(
                f"Loaded {len(valid_values)} reference values from {row_count} rows for {field_name} from {file_path}")
            return True

        except csv.Error as e:
            self.logger.error(f"CSV parsing error in {file_path}: {e}. Check if delimiter '{delimiter}' is correct.")
            return False
        except Exception as e:
            self.logger.error(f"Error loading reference data from {file_path}: {e}")
            return False

    def validate(self, field_name: str, value: str) -> bool:
        """
        Validate if a value exists in the reference data.

        Args:
            field_name: Field to validate against
            value: Value to check

        Returns:
            bool: True if valid, False otherwise
        """
        # If no reference data, consider it valid (allows for optional validation)
        if field_name not in self._reference_data:
            return True

        # O(1) lookup in set
        return value in self._reference_data[field_name]

    def get_valid_values(self, field_name: str) -> List[str]:
        """
        Get all valid values for a field (for debugging/reporting).

        Args:
            field_name: Field to get values for

        Returns:
            List of valid values
        """
        if field_name not in self._reference_data:
            return []
        return sorted(list(self._reference_data[field_name]))