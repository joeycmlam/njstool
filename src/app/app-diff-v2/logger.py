import logging
from datetime import datetime
import os

class Logger:
    """
    A class to configure and manage logging with timestamped log file names.
    """
    def __init__(self, log_config):
        log_path = log_config.get("path", "./log")
        log_file = log_config.get("file", "diff.log")
        self.logger = self._initialize_logger(log_path, log_file)

    @staticmethod
    def _initialize_logger(log_path, log_file):
        os.makedirs(log_path, exist_ok=True)

        # Add timestamp to the log file name
        base_name, ext = os.path.splitext(log_file)
        timestamped_log_file = f"{base_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
        log_file_name = os.path.join(log_path, timestamped_log_file)

        logger = logging.getLogger("FileComparison")
        logger.setLevel(logging.INFO)

        # File handler
        file_handler = logging.FileHandler(log_file_name)
        file_handler.setFormatter(logging.Formatter(Logger._log_format()))
        logger.addHandler(file_handler)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(logging.Formatter(Logger._log_format()))
        logger.addHandler(console_handler)

        return logger

    @staticmethod
    def _log_format():
        return "%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s"

    def get_logger(self):
        return self.logger