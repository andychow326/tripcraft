from contextlib import contextmanager
from typing import Iterator

import sqlalchemy as sa
from sqlalchemy.engine import create_engine
from sqlalchemy.orm import Session, sessionmaker

from tripcraft.constants import POSTGRES_URL

_db_engine = None


def create_app_engine():
    return create_engine(
        POSTGRES_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )


def get_db_engine():
    global _db_engine
    if _db_engine:
        return _db_engine
    _db_engine = create_app_engine()
    return _db_engine


@contextmanager
def open_db_session(read_write=True, isolation_level=None) -> Iterator[Session]:
    if isolation_level is not None:
        engine = get_db_engine().execution_options(
            isolation_level=isolation_level,
        )
    else:
        engine = get_db_engine()

    Session = sessionmaker(engine, expire_on_commit=False)
    session = Session()

    try:
        if not read_write:
            session.execute(sa.text("SET TRANSACTION READ ONLY"))
        yield session
        if not read_write or not session.is_active:
            session.rollback()
        else:
            session.commit()
    except BaseException:
        session.rollback()
        raise
    finally:
        session.close()
