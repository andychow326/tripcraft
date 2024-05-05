from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from tripcraft.models import Plan
from tripcraft.utils import with_db_session

from .base_query import BaseQuery


class PlanQuery(BaseQuery):
    def __init__(self, session: Session):
        super().__init__(session, Plan)


def with_plan_query():
    def depend_query(session: Annotated[Session, Depends(with_db_session)]):
        return PlanQuery(session)

    return depend_query
