class RecordComparator:
    """
    A class to compare records from two files.
    """
    def __init__(self, logger):
        self.logger = logger

    def compare_records(self, file_a_data, file_b_data, columns):
        """
        Compare records from two files based on the specified columns.

        :param file_a_data: Parsed data from File A.
        :param file_b_data: Parsed data from File B.
        :param columns: Dictionary defining column properties.
        :return: A list of comparison results.
        """
        results = []
        all_keys = set(file_a_data.keys()).union(file_b_data.keys())
        self.logger.info(f"Starting comparison with {len(all_keys)} composite keys.")

        for key in all_keys:
            record_a = file_a_data.get(key, {})
            record_b = file_b_data.get(key, {})

            row_number_a = record_a.get("row_number", "N/A")
            row_number_b = record_b.get("row_number", "N/A")

            for column_name, props in columns.items():
                if not props.get("skip", False):
                    results.append(self._compare_column(record_a, record_b, key, row_number_a, row_number_b, column_name))

        self.logger.info(f"Comparison completed with {len(results)} results.")
        return results

    @staticmethod
    def _compare_column(record_a, record_b, key, row_number_a, row_number_b, column_name):
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

        return {
            "row_number_a": row_number_a,
            "row_number_b": row_number_b,
            "key": key,
            "column": column_name,
            "file_a_value": value_a,
            "file_b_value": value_b,
            "status": status
        }