import argparse
import logging
import os
from datetime import datetime
import configReader

class App:
    
    def setup_logging(self):
        log_filename = f"{self.config['log']['filename']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        logging.basicConfig(filename=os.path.join(self.config['log']['path'], log_filename), 
                            level=self.config['log']['level'].upper(), 
                            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(__name__)
        
    def __init__(self, config:str) -> None:
        self.config = config
        self.setup_logging()
        
        
    def run(self) -> None:
        self.logger.info('Starting file comparison')
     
        self.logger.info('File comparison completed')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compare files based on a configuration file.')
    parser.add_argument('--config', type=str, required=True, help='Path to the configuration file.')
    args = parser.parse_args()

    app = App(args.config)
    app.run()