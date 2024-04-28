import argparse
import configReader
import logging
import os
from FileComparator2 import FileComparator
from datetime import datetime

class App:
    def __init__(self, config_path):
        self.config_reader = configReader.ConfigReader(config_path)
        self.config = self.config_reader.read_config()
       

        # Set up logging
        log_filename = f"{self.config['log']['filename']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        logging.basicConfig(filename=os.path.join(self.config['log']['path'], log_filename), 
                            level=self.config['log']['level'].upper(), 
                            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(__name__)

        self.comparator = FileComparator(self.config, self.logger)
        
        
    def run(self):
        self.logger.info('Starting file comparison')
        self.comparator.compare_files()
        self.logger.info('File comparison completed')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compare files based on a configuration file.')
    parser.add_argument('--config', type=str, required=True, help='Path to the configuration file.')
    args = parser.parse_args()

    app = App(args.config)
    app.run()