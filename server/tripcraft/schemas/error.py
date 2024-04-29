from enum import Enum
from typing import Any, Optional

from tripcraft.schemas.base import BaseModelWithCamelCaseAlias


class ApiError(BaseModelWithCamelCaseAlias):
    class Code(str, Enum):
        NOT_FOUND = "NOT_FOUND"
        FORBIDDEN = "FORBIDDEN"
        INVALID_REQUEST = "INVALID_REQUEST"
        UNAUTHORIZED = "UNAUTHORIZED"
        INTERNAL_ERROR = "INTERNAL_ERROR"
        UNKNOWN = "UNKNOWN"
        CONFLICT = "CONFLICT"

    code: Code
    description: Optional[str] = None
    detail: Optional[Any] = None
