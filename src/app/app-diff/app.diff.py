import argparse
import configReader
from FileComparator2 import FileComparator

class App:
    def __init__(self, config_path):
        self.config_reader = configReader.ConfigReader(config_path)
        self.config = self.config_reader.read_config()
        self.comparator = FileComparator(self.config)

    def run(self):
        self.comparator.compare_files()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compare files based on a configuration file.')
    parser.add_argument('--config', type=str, required=True, help='Path to the configuration file.')
    args = parser.parse_args()

    app = App(args.config)
    app.run()