import json
import openpyxl
from openpyxl.styles import Font


def parse_file(file_path, columns, skip_keys=None):
    """
    Parse a file into a dictionary with File Type as the key and Counter as the value.
    Also returns a list of records for row tracking.

    :param file_path: Path to the file to parse.
    :param columns: Dictionary defining column positions and lengths.
    :param skip_keys: A set of keys (File Type) to skip during parsing.
    :return: A tuple (record_dict, records)
    """
    record_dict = {}
    records = []
    skip_keys = skip_keys or set()

    try:
        with open(file_path, 'r') as file:
            for line_no, line in enumerate(file, start=1):
                # Extract fields based on column definitions
                file_type = line[
                    columns["file_type"]["start"]: columns["file_type"]["start"] + columns["file_type"]["length"]
                ].strip()
                counter = line[
                    columns["counter"]["start"]: columns["counter"]["start"] + columns["counter"]["length"]
                ].strip()

                # Skip specified keys
                if file_type in skip_keys:
                    continue

                # Add to record dictionary and list
                record_dict[file_type] = int(counter) if counter.isdigit() else counter
                records.append((line_no, file_type, counter))
    except FileNotFoundError:
        print(f"Error: File not found - {file_path}")
        exit(1)
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        exit(1)

    return record_dict, records


def write_to_excel(results, output_file):
    """
    Write the comparison results to an Excel file.

    :param results: List of comparison results.
    :param output_file: Path to the output Excel file.
    :return: None
    """
    # Create a new Excel workbook
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "Comparison Results"

    # Add headers
    headers = ["Row", "Key", "Comparison Status", "File A Counter", "File B Counter"]
    for col_num, header in enumerate(headers, start=1):
        cell = sheet.cell(row=1, column=col_num, value=header)
        cell.font = Font(bold=True)

    # Write data
    for row_num, result in enumerate(results, start=2):
        for col_num, value in enumerate(result, start=1):
            sheet.cell(row=row_num, column=col_num, value=value)

    # Save the workbook
    workbook.save(output_file)
    print(f"Results written to {output_file}")


def compare_files(config_path):
    """
    Compare two files based on configuration settings.

    :param config_path: Path to the JSON configuration file.
    :return: None
    """
    # Load configuration
    try:
        with open(config_path, 'r') as config_file:
            config = json.load(config_file)
    except FileNotFoundError:
        print(f"Error: Config file not found - {config_path}")
        exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in config file - {config_path}")
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

    # Generate comparison results
    results = []
    all_keys = set(file_a_data.keys()).union(file_b_data.keys())

    for key in all_keys:
        # Identify row numbers in the original files
        row_a = next((row for row, k, _ in file_a_records if k == key), None)
        row_b = next((row for row, k, _ in file_b_records if k == key), None)

        if key in file_a_data and key in file_b_data:
            if file_a_data[key] == file_b_data[key]:
                results.append((row_a, key, "match", file_a_data[key], file_b_data[key]))
            else:
                results.append((row_a, key, "not-match", file_a_data[key], file_b_data[key]))
        elif key in file_a_data:
            results.append((row_a, key, "missing", file_a_data[key], None))
        elif key in file_b_data:
            results.append((row_b, key, "missing", None, file_b_data[key]))

    # Print results to console
    for result in results:
        print(", ".join(map(str, result)))

    # Write results to Excel
    write_to_excel(results, output_file)


if __name__ == "__main__":
    # Path to the configuration file
    config_path = "config.json"

    # Run comparison based on configuration
    compare_files(config_path)