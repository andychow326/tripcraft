from typing import TYPE_CHECKING, List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from tripcraft.models.base import Base, TimestampMixin

from .auth import Auth
from .plan_user import PlanUser

if TYPE_CHECKING:
    from .plan import Plan


class User(Base, TimestampMixin):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(sa.Text, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    email: Mapped[str] = mapped_column(sa.Text, nullable=False, unique=True)
    is_valid: Mapped[bool] = mapped_column(sa.Boolean, nullable=False)

    auth: Mapped[List["Auth"]] = relationship("Auth")

    plan_associations: Mapped[List["PlanUser"]] = relationship(back_populates="user")
    plans: Mapped[List["Plan"]] = relationship(
        secondary=lambda: PlanUser.__table__,
        back_populates="users",
        overlaps="user, plan, user_associations, plan_associations, user_id, plan_id",
    )
