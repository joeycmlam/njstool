import openpyxl
from openpyxl.styles import Font, Alignment
from datetime import datetime
import os


class ExcelWriter:
    """
    A class to write comparison results to an Excel file.
    """
    def __init__(self, logger):
        self.logger = logger

    def write_to_excel(self, results, output_config):
        try:
            if not results:
                self.logger.warning("No results to write to Excel.")
                return

            # Validate results format
            required_fields = {"row_number_a", "row_number_b", "key", "column", "file_a_value", "file_b_value", "status"}
            if not all(field in results[0] for field in required_fields):
                self.logger.error("Results data is missing required fields.")
                raise ValueError("Invalid results data format.")

            # Output path and file name
            output_path = output_config.get("path", "./result")
            output_file_name = output_config.get("file", "comparison_results.xlsx")
            os.makedirs(output_path, exist_ok=True)

            timestamped_file_name = output_config.get("timestamped", True)
            if timestamped_file_name:
                output_file_name = f"{os.path.splitext(output_file_name)[0]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            output_file = os.path.join(output_path, output_file_name)

            # Create workbook and write data
            workbook = openpyxl.Workbook()
            headers = output_config.get("headers", [
                "Row Number (File A)", "Row Number (File B)", "Composite Key",
                "Column", "File A Value", "File B Value", "Status"
            ])
            group_by = output_config.get("group_by", None)

            if group_by:
                grouped_results = self._group_results(results, group_by)
                for group, group_results in grouped_results.items():
                    sheet = workbook.create_sheet(title=group)
                    self._write_headers(sheet, headers)
                    self._write_data(sheet, group_results)
            else:
                sheet = workbook.active
                sheet.title = output_config.get("sheet_name", "Comparison Results")
                self._write_headers(sheet, headers)
                self._write_data(sheet, results)

            workbook.save(output_file)
            self.logger.info(f"Results written to {output_file}")
        except Exception as e:
            self.logger.exception(f"Error writing to Excel file: {e}")
            raise

    @staticmethod
    def _write_headers(sheet, headers):
        for col_num, header in enumerate(headers, start=1):
            cell = sheet.cell(row=1, column=col_num, value=header)
            cell.font = Font(bold=True)
            sheet.column_dimensions[cell.column_letter].width = 20
            cell.alignment = Alignment(horizontal="center")

    @staticmethod
    def _write_data(sheet, results):
        for row_num, result in enumerate(results, start=2):
            sheet.cell(row=row_num, column=1, value=result["row_number_a"])
            sheet.cell(row=row_num, column=2, value=result["row_number_b"])
            sheet.cell(row=row_num, column=3, value=result["key"])
            sheet.cell(row=row_num, column=4, value=result["column"])
            sheet.cell(row=row_num, column=5, value=result["file_a_value"])
            sheet.cell(row=row_num, column=6, value=result["file_b_value"])
            sheet.cell(row=row_num, column=7, value=result["status"])

    @staticmethod
    def _group_results(results, group_by):
        grouped = {}
        for result in results:
            key = result.get(group_by, "Other")
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(result)
        return grouped