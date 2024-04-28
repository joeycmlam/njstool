import pandas as pd
import os
import argparse
import configReader



class FileComparator:
    def __init__(self, config):
        self.config = config

    def compare(self):
        summary = []
        details = []

        for file in self.config['files']:
            file1 = os.path.join(self.config['path1'], file)
            file2 = os.path.join(self.config['path2'], file)

            df1 = pd.read_csv(file1, delimiter='|').set_index('code')
            df2 = pd.read_csv(file2, delimiter='|').set_index('code')

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

            total_records = len(df1.index.union(df2.index))
            summary.append([file, total_records, matches, len(mismatches)])
            details.extend([[file] + mismatch for mismatch in mismatches])

        summary_df = pd.DataFrame(summary, columns=['File', 'Total Records', 'Number of Matches', 'Number of Mismatches'])
        details_df = pd.DataFrame(details, columns=['File', 'Code', 'Mismatch', 'Value in File 1', 'Value in File 2'])

        output_file = os.path.join(self.config['out']['path'], self.config['out']['filename'])
        with pd.ExcelWriter(output_file) as writer:
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            details_df.to_excel(writer, sheet_name='Details', index=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compare files based on a configuration file.')
    parser.add_argument('--config', type=str, required=True, help='Path to the configuration file.')
    args = parser.parse_args()

    config_reader = configReader.ConfigReader(args.config)
    config = config_reader.read_config()

    comparator = FileComparator(config)
    comparator.compare()