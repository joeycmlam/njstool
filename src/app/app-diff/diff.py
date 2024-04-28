import pandas as pd
import json
import os

class FileComparator:
    def __init__(self, config_file):
        with open(config_file, 'r') as f:
            self.config = json.load(f)

    def compare(self):
        with open('results.txt', 'w') as f:
            for file in self.config['files']:
                file1 = os.path.join(self.config['path1'], file)
                file2 = os.path.join(self.config['path2'], file)

                df1 = pd.read_csv(file1, delimiter='|').set_index('code')
                df2 = pd.read_csv(file2, delimiter='|').set_index('code')

                mismatches = []

                for code in df1.index.union(df2.index):
                    if code not in df2.index:
                        mismatches.append(f"{code} --> is missing record in 2nd file")
                    elif code not in df1.index:
                        mismatches.append(f"{code} --> is missing record in 1st file")
                    elif not df1.loc[code].equals(df2.loc[code]):
                        for col in df1.columns:
                            if df1.loc[code, col] != df2.loc[code, col]:
                                mismatches.append(f"{code} --> {col} is not match, file1: {df1.loc[code, col]}, file2: {df2.loc[code, col]}")

                f.write(f"Results for {file}:\n")
                f.write('\n'.join(mismatches))
                f.write('\n\n')

comparator = FileComparator('config/config.json')
comparator.compare()