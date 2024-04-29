from pydantic import EmailStr, Field

from tripcraft.schemas.base import BaseModelWithCamelCaseAlias


class SignupRequest(BaseModelWithCamelCaseAlias):
    name: str = Field(min_length=4, max_length=18)
    email: EmailStr
    password: str = Field(min_length=6, max_length=32)


class SignupResponse(BaseModelWithCamelCaseAlias):
    access_token: str


class LoginRequest(BaseModelWithCamelCaseAlias):
    email: str
    password: str


class LoginResponse(BaseModelWithCamelCaseAlias):
    access_token: str
