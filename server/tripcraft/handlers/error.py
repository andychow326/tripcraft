from enum import Enum
from typing import Any, Optional

from fastapi import HTTPException

from tripcraft.schemas import ApiError


def forbidden():
    return HTTPException(
        detail=ApiError(code=ApiError.Code.FORBIDDEN).model_dump(),
        status_code=403,
    )


def not_found():
    return HTTPException(
        detail=ApiError(code=ApiError.Code.NOT_FOUND).model_dump(),
        status_code=404,
    )


def invalid_request(desc: str, detail: Optional[Any] = None):
    return HTTPException(
        detail=ApiError(
            code=ApiError.Code.INVALID_REQUEST,
            description=desc,
            detail=detail,
        ).model_dump(),
        status_code=400,
    )


def unauthorized():
    return HTTPException(
        detail=ApiError(code=ApiError.Code.UNAUTHORIZED).model_dump(),
        status_code=401,
    )


def conflict(desc: str):
    return HTTPException(
        detail=ApiError(code=ApiError.Code.CONFLICT, description=desc).model_dump(),
        status_code=409,
    )


def internal_error(desc: str):
    return HTTPException(
        detail=ApiError(
            code=ApiError.Code.INTERNAL_ERROR, description=desc
        ).model_dump(),
        status_code=500,
    )


def unknown():
    return HTTPException(
        detail=ApiError(
            code=ApiError.Code.UNKNOWN,
            description="Unknown error",
        ).model_dump(),
        status_code=500,
    )
