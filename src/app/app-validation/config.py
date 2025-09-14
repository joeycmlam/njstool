import json
import os

class Config:
    """
    A class to manage the configuration file.
    """
    def __init__(self, config_path):
        self.config_path = config_path
        self.config_data = self._load_config(config_path)


    def validate_config_file(self) -> None:
        """
        Validate the existence and accessibility of the configuration file.        
        Raises:
            FileNotFoundError: If the configuration file does not exist.
            PermissionError: If the configuration file is not readable.
            ValueError: If the path is empty or None.
        """
        config_path = self.config_path
        
        if not config_path:
            raise ValueError("Configuration file path cannot be empty")
            
        config_path = os.path.abspath(config_path)
        
        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Configuration file not found: {config_path}")
            
        if not os.path.isfile(config_path):
            raise FileNotFoundError(f"Path is not a file: {config_path}")
            
        if not os.access(config_path, os.R_OK):
            raise PermissionError(f"Configuration file is not readable: {config_path}")


    def _load_config(self, config_path):
        try:
            self.validate_config_file()
            
            with open(config_path, 'r') as config_file:
                return json.load(config_file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Config file not found: {config_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format in config file: {e}")

    def get(self, key, default=None):
        return self.config_data.get(key, default)
