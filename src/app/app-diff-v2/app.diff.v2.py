import json
import openpyxl
from openpyxl.styles import Font
import logging
from datetime import datetime

# Configure logging
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s"

# Create logger
logger = logging.getLogger("FileComparison")
logger.setLevel(logging.INFO)

# File handler: Logs to a file
file_handler = logging.FileHandler(f"file_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
file_handler.setFormatter(logging.Formatter(LOG_FORMAT))
logger.addHandler(file_handler)

# Console handler: Logs to the console
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter(LOG_FORMAT))
logger.addHandler(console_handler)


def parse_file(file_path, columns, skip_keys=None):
    """
    Parse a file into a list of records and a dictionary keyed by the configured key column.

    :param file_path: Path to the file to parse.
    :param columns: Dictionary defining column positions, lengths, and flags.
    :param skip_keys: A set of keys to skip during parsing.
    :return: A tuple (record_dict, records)
    """
    record_dict = {}
    records = []
    skip_keys = skip_keys or set()
    key_column = next(col for col, props in columns.items() if props.get("key", False))

    try:
        with open(file_path, 'r') as file:
            for line_no, line in enumerate(file, start=1):
                record = {"row_number": line_no}  # Add row number from the file
                for column_name, props in columns.items():
                    if props.get("skip", False):
                        continue
                    start = props["start"]
                    length = props["length"]
                    value = line[start:start + length].strip()
                    record[column_name] = value

                key_value = record[key_column]
                if key_value in skip_keys:
                    continue

                # Add to records and dictionary keyed by the key column
                records.append(record)
                record_dict[key_value] = record
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        exit(1)
    except Exception as e:
        logger.exception(f"Error processing file {file_path}: {e}")
        exit(1)

    logger.info(f"Parsed file: {file_path} with {len(records)} records.")
    return record_dict, records


def compare_records(file_a_data, file_b_data, columns):
    """
    Compare records from two files based on the specified columns.

    :param file_a_data: Parsed data from File A.
    :param file_b_data: Parsed data from File B.
    :param columns: Dictionary defining column properties.
    :return: A list of comparison results.
    """
    results = []
    all_keys = set(file_a_data.keys()).union(file_b_data.keys())
    logger.info(f"Starting comparison with {len(all_keys)} keys.")

    for key in all_keys:
        record_a = file_a_data.get(key, {})
        record_b = file_b_data.get(key, {})

        row_number_a = record_a.get("row_number", "N/A")
        row_number_b = record_b.get("row_number", "N/A")

        for column_name, props in columns.items():
            if props.get("skip", False):
                continue

            value_a = record_a.get(column_name, None)
            value_b = record_b.get(column_name, None)

            if value_a == value_b:
                status = "match"
            elif value_a is None:
                status = "missing in File A"
            elif value_b is None:
                status = "missing in File B"
            else:
                status = "not-match"

            # Add the result for this column
            results.append({
                "row_number_a": row_number_a,
                "row_number_b": row_number_b,
                "key": key,
                "column": column_name,
                "file_a_value": value_a,
                "file_b_value": value_b,
                "status": status
            })

    logger.info(f"Comparison completed with {len(results)} results.")
    return results


def write_to_excel(results, output_file):
    """
    Write the comparison results to an Excel file.

    :param results: List of comparison results.
    :param output_file: Path to the output Excel file.
    :return: None
    """
    try:
        # Create a new Excel workbook
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Comparison Results"

        # Add headers
        headers = ["Row Number (File A)", "Row Number (File B)", "Key", "Column", "File A Value", "File B Value", "Status"]
        for col_num, header in enumerate(headers, start=1):
            cell = sheet.cell(row=1, column=col_num, value=header)
            cell.font = Font(bold=True)

        # Write data
        for row_num, result in enumerate(results, start=2):
            sheet.cell(row=row_num, column=1, value=result["row_number_a"])
            sheet.cell(row=row_num, column=2, value=result["row_number_b"])
            sheet.cell(row=row_num, column=3, value=result["key"])
            sheet.cell(row=row_num, column=4, value=result["column"])
            sheet.cell(row=row_num, column=5, value=result["file_a_value"])
            sheet.cell(row=row_num, column=6, value=result["file_b_value"])
            sheet.cell(row=row_num, column=7, value=result["status"])

        # Save the workbook
        workbook.save(output_file)
        logger.info(f"Results written to {output_file}")
    except Exception as e:
        logger.exception(f"Error writing to Excel file {output_file}: {e}")
        exit(1)


def compare_files(config_path):
    """
    Compare two files based on configuration settings.

    :param config_path: Path to the JSON configuration file.
    :return: None
    """
    try:
        # Load configuration
        with open(config_path, 'r') as config_file:
            config = json.load(config_file)
    except FileNotFoundError:
        logger.error(f"Config file not found: {config_path}")
        exit(1)
    except json.JSONDecodeError:
        logger.exception(f"Invalid JSON format in config file: {config_path}")
        exit(1)

    # Extract configuration details
    file_a_path = config["file_a"]
    file_b_path = config["file_b"]
    columns = config["columns"]
    skip_keys = set(config.get("skip_keys", []))
    output_file = config.get("output_file", "comparison_results.xlsx")

    # Parse both files
    file_a_data, file_a_records = parse_file(file_a_path, columns, skip_keys)
    file_b_data, file_b_records = parse_file(file_b_path, columns, skip_keys)

    # Compare records
    results = compare_records(file_a_data, file_b_data, columns)

    # Write results to Excel
    write_to_excel(results, output_file)


if __name__ == "__main__":
    # Path to the configuration file
    config_path = "config.json"

    # Run comparison based on configuration
    logger.info("Starting file comparison.")
    compare_files(config_path)
    logger.info("File comparison completed.")