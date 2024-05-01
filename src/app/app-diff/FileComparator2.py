import pandas as pd
import os


class FileComparator:
    DELIMITER = '|'
    
    def __init__(self, config, logger):
        self.config = config
        self.logger = logger

    def read_file(self, path: str, filename: str, key: str) -> pd.DataFrame:
        """Read a file into a DataFrame, setting 'key' as the index."""
        self.logger.info('Reading file: %s', os.path.join(path, filename))
        file_path = os.path.join(path, filename)
        return pd.read_csv(file_path, delimiter=self.DELIMITER).set_index(key)

    def compare_one_file(self, df1: pd.DataFrame, df2: pd.DataFrame) -> list:
        mismatches = []
        matches = 0
        for code in df1.index.union(df2.index):
            if code not in df2.index:
                mismatches.append([code, "is missing record in 2nd file", None, None])
            elif code not in df1.index:
                mismatches.append([code, "is missing record in 1st file", None, None])
            elif not df1.loc[code].equals(df2.loc[code]):
                for col in df1.columns:
                    if df1.loc[code, col] != df2.loc[code, col]:
                        mismatches.append([code, f"{col} is not match", df1.loc[code, col], df2.loc[code, col]])
            else:
                matches += 1
        return mismatches, matches
    
    def compare_files(self):
        summary = []
        details = []

        for file_config in self.config['files']:
            file = file_config['filename']
            key = file_config['key']
            
            df1 = self.read_file(self.config['path1'], file, key)
            df2 = self.read_file(self.config['path2'], file, key)

            mismatches = []
            matches = 0
            self.logger.info(f"Comparing file {file}")
            mismatches, matches = self.compare_one_file(df1, df2)

            total_records = len(df1.index.union(df2.index))
            summary.append([file, total_records, matches, len(mismatches)])
            details.extend([[file] + mismatch for mismatch in mismatches])

        summary_df = pd.DataFrame(summary, columns=['File', 'Total Records', 'Number of Matches', 'Number of Mismatches'])
        details_df = pd.DataFrame(details, columns=['File', 'Code', 'Mismatch', 'Value in File 1', 'Value in File 2'])

        output_file = os.path.join(self.config['out']['path'], self.config['out']['filename'])
        with pd.ExcelWriter(output_file) as writer:
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            details_df.to_excel(writer, sheet_name='Details', index=False)

