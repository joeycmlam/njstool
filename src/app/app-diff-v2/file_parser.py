import os


class FileParser:
    """
    A class to parse and process input files.
    """

    def __init__(self, logger):
        self.logger = logger

    def parse_file(self, file_path, columns, skip_keys=None, delimiter=None, encoding="utf-8", key_delimiter="-"):
        """
        Parse a file into a list of records and a dictionary keyed by the composite key.

        :param file_path: Path to the file to parse.
        :param columns: Dictionary defining column positions, lengths, and flags.
        :param skip_keys: A set of composite keys to skip during parsing.
        :param delimiter: Delimiter for delimited files (optional).
        :param encoding: File encoding (default: utf-8).
        :param key_delimiter: Delimiter for the human-readable composite key (default: "-").
        :return: A tuple (record_dict, records).
        :raises FileNotFoundError: If the file does not exist.
        :raises ValueError: If the file is empty or malformed.
        """
        self._validate_columns(columns)

        record_dict = {}
        records = []
        skip_keys = skip_keys or set()
        key_columns = self._get_key_columns(columns)

        if not os.path.exists(file_path):
            self.logger.error(f"File not found: {file_path}")
            raise FileNotFoundError(f"File not found: {file_path}")

        if not os.access(file_path, os.R_OK):
            self.logger.error(f"File is not readable: {file_path}")
            raise PermissionError(f"File is not readable: {file_path}")

        try:
            with open(file_path, 'r', encoding=encoding) as file:
                for line_no, line in enumerate(file, start=1):
                    if delimiter:
                        record = self._parse_delimited_line(line, columns, line_no, delimiter)
                    else:
                        record = self._parse_line(line, columns, line_no)

                    # Generate both the hash-based and human-readable composite keys
                    human_readable_key = self._construct_human_readable_key(record, key_columns, key_delimiter)
                    hash_key = self._construct_composite_key(record, key_columns)

                    # Skip records with keys in the skip list
                    if hash_key in skip_keys:
                        continue

                    # Add keys to the record for reference
                    record["composite_key"] = human_readable_key
                    record["hash_key"] = hash_key

                    records.append(record)
                    record_dict[hash_key] = record

        except FileNotFoundError:
            self.logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            self.logger.exception(f"Encoding error while reading file {file_path}: {e}")
            raise
        except Exception as e:
            self.logger.exception(f"Error processing file {file_path}: {e}")
            raise

        self.logger.info(f"Parsed file: {file_path} with {len(records)} records.")
        return record_dict, records

    @staticmethod
    def _validate_columns(columns):
        for column_name, props in columns.items():
            if not isinstance(props, dict):
                raise ValueError(f"Invalid column definition for '{column_name}'. Expected a dictionary.")
            if "start" not in props or "length" not in props:
                raise ValueError(f"Column '{column_name}' must have 'start' and 'length' properties.")
            if not isinstance(props["start"], int) or not isinstance(props["length"], int):
                raise ValueError(f"Column '{column_name}' 'start' and 'length' must be integers.")

    @staticmethod
    def _get_key_columns(columns):
        return [col for col, props in columns.items() if props.get("key", False)]

    @staticmethod
    def _parse_line(line, columns, line_no):
        record = {"row_number": line_no}
        for column_name, props in columns.items():
            if not props.get("skip", False):
                start = props["start"]
                length = props["length"]
                record[column_name] = line[start:start + length].strip()
        return record

    @staticmethod
    def _parse_delimited_line(line, columns, line_no, delimiter):
        values = line.strip().split(delimiter)
        record = {"row_number": line_no}
        for column_name, props in columns.items():
            if not props.get("skip", False):
                index = props["start"]
                record[column_name] = values[index] if index < len(values) else ""
        return record

    @staticmethod
    def _construct_composite_key(record, key_columns):
        """
        Generate a hash-based composite key for a record.

        :param record: The record dictionary.
        :param key_columns: List of key columns to include in the composite key.
        :return: A unique composite key (hash).
        """
        key_values = [str(record.get(column, "")) for column in key_columns]
        return hash(tuple(key_values))

    @staticmethod
    def _construct_human_readable_key(record, key_columns, delimiter):
        """
        Generate a human-readable composite key for a record.

        :param record: The record dictionary.
        :param key_columns: List of key columns to include in the composite key.
        :param delimiter: The delimiter to use between key values.
        :return: A human-readable composite key string.
        """
        key_values = [str(record.get(column, "")) for column in key_columns]
        return delimiter.join(key_values)