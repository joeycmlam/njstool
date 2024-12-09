
class FileParser:
    """
    A class to parse and process input files.
    """
    def __init__(self, logger):
        self.logger = logger

    def parse_file(self, file_path, columns, skip_keys=None):
        """
        Parse a file into a list of records and a dictionary keyed by the composite key.

        :param file_path: Path to the file to parse.
        :param columns: Dictionary defining column positions, lengths, and flags.
        :param skip_keys: A set of composite keys to skip during parsing.
        :return: A tuple (record_dict, records)
        """
        record_dict = {}
        records = []
        skip_keys = skip_keys or set()
        key_columns = self._get_key_columns(columns)

        try:
            with open(file_path, 'r') as file:
                for line_no, line in enumerate(file, start=1):
                    record = self._parse_line(line, columns, line_no)
                    composite_key = self._construct_composite_key(record, key_columns)
                    if composite_key in skip_keys:
                        continue

                    records.append(record)
                    record_dict[composite_key] = record
        except FileNotFoundError:
            self.logger.error(f"File not found: {file_path}")
            raise
        except Exception as e:
            self.logger.exception(f"Error processing file {file_path}: {e}")
            raise

        self.logger.info(f"Parsed file: {file_path} with {len(records)} records.")
        return record_dict, records

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
    def _construct_composite_key(record, key_columns):
        return "-".join(str(record.get(column, "")) for column in key_columns)