import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime
import os
import constants


class Logger:
    """
    A class to configure and manage logging with timestamped log file names.
    """
    def __init__(self, log_config):
        log_path = log_config.get("path", "./log")
        log_file = log_config.get("file", "logfile")
        log_level = log_config.get("level", "INFO").upper()
        enable_console = log_config.get("enable_console", True)
        self.logger = self._initialize_logger(log_path, log_file, log_level, enable_console)

    @staticmethod
    def _initialize_logger(log_path, log_file, log_level, enable_console):
        os.makedirs(log_path, exist_ok=True)

        # Create timestamped log file
        timestamped_log_file = f"{os.path.splitext(log_file)[0]}_{datetime.now():%Y%m%d_%H%M%S}.log"
        log_file_name = os.path.join(log_path, timestamped_log_file)

        logger = logging.getLogger("FileComparison")
        logger.setLevel(getattr(logging, log_level, logging.INFO))

        # File handler with rotation
        file_handler = RotatingFileHandler(log_file_name, maxBytes=10 * 1024 * 1024, backupCount=5)
        file_handler.setFormatter(logging.Formatter(Logger._log_format()))
        logger.addHandler(file_handler)

        # Console handler (optional)
        if enable_console:
            console_handler = logging.StreamHandler()
            console_handler.setFormatter(logging.Formatter(Logger._log_format()))
            logger.addHandler(console_handler)

        return logger

    @staticmethod
    def _log_format():
        return constants.DEFAULT_LOG_FORMAT

    def get_logger(self):
        return self.logger