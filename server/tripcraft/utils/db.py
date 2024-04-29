from sqlalchemy.orm import Session

from tripcraft.models import open_db_session


def with_db_session() -> Session:  # type: ignore
    with open_db_session() as session:
        yield session
