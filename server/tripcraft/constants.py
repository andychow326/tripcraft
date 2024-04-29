import os

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

ALLOW_ORIGINS = os.environ.get("ALLOW_ORIGINS", "").split(",")

POSTGRES_URL = os.environ.get("POSTGRES_URL", "")
POSTGRES_SCHEMA = os.environ.get("POSTGRES_SCHEMA", "")

REDIS_URL = os.environ.get("REDIS_URL", "")

SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 0))
SMTP_SSL = os.environ.get("SMTP_SSL", "true").lower() == "true"
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL", "")

JWT_SECRET = os.environ.get("JWT_SECRET", "")
