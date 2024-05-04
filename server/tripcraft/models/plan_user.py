import enum
from typing import TYPE_CHECKING

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from tripcraft.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from .plan import Plan
    from .user import User


class PlanUserRole(enum.Enum):
    owner = "owner"
    editor = "editor"
    viewer = "viewer"


class PlanUser(Base, TimestampMixin):
    __tablename__ = "plan_user"

    plan_id: Mapped[str] = mapped_column(
        sa.ForeignKey("plan.id"), primary_key=True, index=True
    )
    user_id: Mapped[str] = mapped_column(
        sa.ForeignKey("user.id"), primary_key=True, index=True
    )
    role: Mapped[PlanUserRole] = mapped_column(sa.Enum(PlanUserRole), nullable=False)

    plan: Mapped["Plan"] = relationship(
        back_populates="user_associations", overlaps="users, plans, plan_id"
    )
    user: Mapped["User"] = relationship(
        back_populates="plan_associations", overlaps="users, plans, plan_id"
    )
