import json

class ConfigReader:
    def __init__(self, config_file):
        self.config_file = config_file

    def read_config(self):
        with open(self.config_file, 'r') as f:
            return json.load(f)