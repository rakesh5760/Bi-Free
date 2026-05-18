import logging
import sys

# Configure a modular, extensible logger
logger = logging.getLogger("biher_freelancing_backend")
logger.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter(
    fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Console Handler (Stdout)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)

# Prevent duplicate logs if the logger is imported multiple times
if not logger.handlers:
    logger.addHandler(console_handler)
    logger.propagate = False
