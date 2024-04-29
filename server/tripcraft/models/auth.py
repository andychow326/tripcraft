import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from tripcraft.models.base import Base, TimestampMixin


class Auth(Base, TimestampMixin):
    __tablename__ = "_auth"

    user_id: Mapped[str] = mapped_column(
        sa.ForeignKey("user.id"), primary_key=True, index=True
    )
    password: Mapped[str] = mapped_column(sa.Text, nullable=False)
