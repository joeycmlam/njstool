import argparse
import configReader
from FileComparator2 import FileComparator

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compare files based on a configuration file.')
    parser.add_argument('--config', type=str, required=True, help='Path to the configuration file.')
    args = parser.parse_args()

    config_reader = configReader.ConfigReader(args.config)
    config = config_reader.read_config()

    comparator = FileComparator(config)
    comparator.compare_files()