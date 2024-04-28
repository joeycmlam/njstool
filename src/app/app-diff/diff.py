import pandas as pd

class FileComparator:
    def __init__(self, file1, file2):
        self.file1 = file1
        self.file2 = file2

    def compare(self):
        df1 = pd.read_csv(self.file1, delimiter='|')
        df2 = pd.read_csv(self.file2, delimiter='|')

        df1.sort_values('code', inplace=True)
        df2.sort_values('code', inplace=True)

        mismatches = []

        for i in df1.index:
            if i not in df2.index:
                mismatches.append(f"{df1.loc[i, 'code']} --> is missing record in 2nd file")
            elif not df1.loc[i].equals(df2.loc[i]):
                for col in df1.columns:
                    if df1.loc[i, col] != df2.loc[i, col]:
                        mismatches.append(f"{df1.loc[i, 'code']} --> {col} is not match")

        for i in df2.index:
            if i not in df1.index:
                mismatches.append(f"{df2.loc[i, 'code']} --> is missing record in 1st file")

        return mismatches

comparator = FileComparator('/Users/joeylam/repo/njs/njstool/src/app/app-diff/test/data/data-1/client.2.txt', '/Users/joeylam/repo/njs/njstool/src/app/app-diff/test/data/data-2/client.2.txt')
print(comparator.compare())