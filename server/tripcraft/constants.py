import os

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

ALLOW_ORIGINS = os.environ.get("ALLOW_ORIGINS", "").split(",")
