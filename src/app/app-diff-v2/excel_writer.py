import openpyxl
from openpyxl.styles import Font
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
            output_path = output_config.get("path", "./result")
            output_file_name = output_config.get("file", "comparison_results.xlsx")
            os.makedirs(output_path, exist_ok=True)

            # Generate full output path
            timestamped_file_name = f"{os.path.splitext(output_file_name)[0]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            output_file = os.path.join(output_path, timestamped_file_name)

            workbook = openpyxl.Workbook()
            sheet = workbook.active
            sheet.title = "Comparison Results"

            headers = ["Row Number (File A)", "Row Number (File B)", "Composite Key", "Column", "File A Value", "File B Value", "Status"]
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