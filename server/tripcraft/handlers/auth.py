import hashlib
from typing import Annotated

from fastapi import APIRouter, Depends
from redis import Redis
from sqlalchemy.orm import Session

from tripcraft.constants import JWT_SECRET
from tripcraft.handlers import error
from tripcraft.models import Auth, User
from tripcraft.queries import UserQuery, with_user_query
from tripcraft.schemas import LoginRequest, LoginResponse, SignupRequest, SignupResponse
from tripcraft.utils import jwt, with_db_session

auth = APIRouter(tags=["auth"])


@auth.post(
    "/auth/signup",
    operation_id="auth_signup_post",
    response_model=SignupResponse,
)
def _auth_signup(
    body: SignupRequest,
    session: Annotated[Session, Depends(with_db_session)],
    user_query: Annotated[UserQuery, Depends(with_user_query())],
):
    user = user_query.get_by_email(body.email)
    if user is not None:
        raise error.invalid_request(f"Email {body.email} is already in use")

    password_hashed = hashlib.sha512(body.password.encode("ascii")).hexdigest()

    new_user = User(
        name=body.name,
        email=body.email,
        is_valid=False,
    )
    new_user.auth.append(Auth(password=password_hashed))

    session.add(new_user)
    session.flush()

    access_token = jwt.encode(
        {
            "sub": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
        },
        JWT_SECRET,
    )

    return SignupResponse(access_token=access_token)


@auth.post(
    "/auth/login",
    operation_id="auth_login_post",
    response_model=LoginResponse,
)
def _auth_login(
    body: LoginRequest,
    user_query: Annotated[UserQuery, Depends(with_user_query())],
):
    password_hashed = hashlib.sha512(body.password.encode("ascii")).hexdigest()
    user = user_query.get_by_auth(body.email, password_hashed)
    if user is None:
        raise error.unauthorized()

    access_token = jwt.encode(
        {
            "sub": user.id,
            "email": user.email,
            "name": user.name,
        },
        JWT_SECRET,
    )

    return LoginResponse(access_token=access_token)
