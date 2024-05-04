from typing import Annotated, Optional

from fastapi import Depends, Header
from jwt.exceptions import DecodeError, ExpiredSignatureError, PyJWKError

from tripcraft.constants import JWT_SECRET
from tripcraft.handlers import error
from tripcraft.models import User
from tripcraft.queries import UserQuery, with_user_query
from tripcraft.utils import jwt


def get_token_from_bearer_header(authorization: str):
    auth_parts = authorization.split(" ")
    if len(auth_parts) == 2 and auth_parts[0].lower() == "bearer":
        return auth_parts[1]

    raise error.invalid_request(
        'Request Header "Authorization" must be of format "Bearer <token>"'
    )


def with_authorization_header(
    authorization: Annotated[
        Optional[str], Header(include_in_schema=False, alias="authorization")
    ] = None,
) -> Optional[str]:
    return authorization


def with_current_user(
    authorization: Annotated[Optional[str], Depends(with_authorization_header)],
    user_query: Annotated[UserQuery, Depends(with_user_query())],
) -> User:
    if authorization is None:
        raise error.invalid_request(
            'Request Header "Authorization" is required for authentication'
        )
    token = get_token_from_bearer_header(authorization)
    try:
        payload = jwt.decode(token, JWT_SECRET)
    except ExpiredSignatureError:
        raise error.unauthorized()
    except DecodeError:
        raise error.unauthorized()
    except PyJWKError:
        raise error.unauthorized()

    user_id = payload.get("sub")
    if user_id is None:
        raise error.unauthorized()

    user = user_query.get_by_id(user_id)
    if user is None:
        raise error.unauthorized()

    return user
