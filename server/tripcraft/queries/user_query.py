from typing import Annotated, Optional

import sqlalchemy as sa
from fastapi import Depends
from sqlalchemy.orm import Session

from tripcraft.models import Auth, User
from tripcraft.utils import with_db_session

from .base_query import BaseQuery


class UserQuery(BaseQuery):
    def __init__(self, session: Session) -> None:
        super().__init__(session, User)

    def get_by_name(self, name: str) -> Optional[User]:
        _query = self.query.where(User.name == name)
        user = self.session.execute(_query)
        return user.scalar()

    def get_by_email(self, email: str) -> Optional[User]:
        _query = self.query.where(User.email == email)
        user = self.session.execute(_query)
        return user.scalar()

    def get_by_auth(self, email: str, password_hashed: str) -> Optional[User]:
        _query = (
            self.query.join(Auth)
            .where(User.email == email)
            .where(Auth.password == password_hashed)
        )
        user = self.session.execute(_query)
        return user.scalar()


def with_user_query():
    def depend_query(session: Annotated[Session, Depends(with_db_session)]):
        return UserQuery(session)

    return depend_query
