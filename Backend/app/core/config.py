import os
from typing import Any, Dict, Optional
from pydantic import MySQLDsn, field_validator
from pydantic_core.core_schema import ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bi-Free Freelancing Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # Database
    MYSQL_SERVER: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DB: str
    MYSQL_PORT: int = 3306
    SQLALCHEMY_DATABASE_URI: Optional[MySQLDsn] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> Any:
        if isinstance(v, str):
            return v
        return MySQLDsn.build(
            scheme="mysql+pymysql",
            username=info.data.get("MYSQL_USER"),
            password=info.data.get("MYSQL_PASSWORD"),
            host=info.data.get("MYSQL_SERVER"),
            port=info.data.get("MYSQL_PORT"),
            path=info.data.get("MYSQL_DB") or "",
        )

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
