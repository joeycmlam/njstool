import json

class Config:
    """
    A class to manage the configuration file.
    """
    def __init__(self, config_path):
        self.config_data = self._load_config(config_path)

    def _load_config(self, config_path):
        try:
            with open(config_path, 'r') as config_file:
                return json.load(config_file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Config file not found: {config_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format in config file: {e}")

    def get(self, key, default=None):
        return self.config_data.get(key, default)
