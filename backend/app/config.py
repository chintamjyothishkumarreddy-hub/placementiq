import os
from pathlib import Path
from pydantic_settings import BaseSettings

_DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "placementiq.db"
_DEFAULT_DB_URL = f"sqlite:///{_DEFAULT_DB_PATH.as_posix()}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "PlacementIQ — Student Placement Data Analysis and Management System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = "placementiq-super-secret-production-key-2026-9876543210"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.environ.get("DATABASE_URL", _DEFAULT_DB_URL)
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"

settings = Settings()
