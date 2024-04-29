import datetime
from typing import Any, Optional

import nanoid
import sqlalchemy as sa
from sqlalchemy import TIMESTAMP, DateTime, MetaData
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func
from typing_extensions import Annotated

from tripcraft.constants import POSTGRES_SCHEMA


class Base(DeclarativeBase):
    metadata = MetaData(
        naming_convention={
            "ix": "ix_%(table_name)s_%(column_0_name)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s",
            "pk": "pk_%(table_name)s",
        },
        schema=POSTGRES_SCHEMA,
    )
    type_annotation_map = {
        dict[str, Any]: JSONB,
        datetime.datetime: TIMESTAMP(timezone=True),
    }


@sa.event.listens_for(Base, "before_insert", propagate=True)
def receive_before_insert(*args):
    target = args[2]
    if hasattr(target, "id") and target.id is None:
        target.id = nanoid.generate()


class TimestampMixin:
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        index=False,
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        index=False,
        nullable=False,
        server_default=sa.text("SYSDATETIMEOFFSET()"),
        onupdate=func.current_timestamp(),
    )


class DeletedTimestampMixin:
    deleted_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime, index=False, nullable=True
    )
