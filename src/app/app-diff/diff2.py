import pandas as pd
import os
import argparse
import configReader
from datetime import datetime



class FileComparator:
    def __init__(self, config):
        self.config = config

    def compare_files(self, file1, file2):
        df1 = pd.read_csv(file1, delimiter='|').set_index('code')
        df2 = pd.read_csv(file2, delimiter='|').set_index('code')

        # Merge the two dataframes on the index (code)
        df = df1.merge(df2, how='outer', left_index=True, right_index=True, indicator=True)

        # Rows that exist in both dataframes (matches)
        matches = df[df['_merge'] == 'both']

        # Rows that exist only in df1 or df2 (mismatches)
        mismatches = df[df['_merge'] != 'both']


        return matches, mismatches
    
    
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
            matches, mismatches = self.compare_files(file1, file2)
            total_records = len(df1.index.union(df2.index))
            
            total_records = len(df1.index.union(df2.index))
            summary.append([file, total_records, len(matches.values), len(mismatches.values)])
            # details.extend([[file] + [mismatch] for mismatch in mismatches])


        summary_df = pd.DataFrame(summary, columns=['File', 'Total Records', 'Number of Matches', 'Number of Mismatches'])
        # details_df = pd.DataFrame(details, columns=['File', 'Code', 'Mismatch', 'Value in File 1', 'Value in File 2'])

        # Get current date and time
        now = datetime.now()
        
        # Format as string
        now_str = now.strftime("%Y%m%d_%H%M%S")
        
        # Use in filename
        # filename = f'{now_str}'
        filename = self.config['out']['filename'] 
        output_file = os.path.join(self.config['out']['path'], filename)
        with pd.ExcelWriter(output_file) as writer:
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            # details_df.to_excel(writer, sheet_name='Details', index=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compare files based on a configuration file.')
    parser.add_argument('--config', type=str, required=True, help='Path to the configuration file.')
    args = parser.parse_args()

    config_reader = configReader.ConfigReader(args.config)
    config = config_reader.read_config()

    comparator = FileComparator(config)
    comparator.compare()