import enum
from datetime import date, datetime
from typing import TYPE_CHECKING, Any, Dict, List

import holidays
import sqlalchemy as sa
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from tripcraft.models.base import Base, TimestampMixin
from tripcraft.schemas.world import Translations
from tripcraft.utils.translate import (
    chinese_simplified_to_traditional,
    to_chinese_simplified,
)

from .plan_user import PlanUser

if TYPE_CHECKING:
    from .user import User


class PlanConfigDetailDestinationType(enum.Enum):
    country = "country"
    state = "state"
    city = "city"


class PlanConfigDetailDestination(BaseModel):
    type: PlanConfigDetailDestinationType
    id: int
    name: Translations
    country_iso2: str


class PlanConfigDetailSchedule(BaseModel):
    place: str
    time_start: datetime
    time_end: datetime


class PlanConfigDetail(BaseModel):
    date: date
    destinations: List[PlanConfigDetailDestination]
    schedules: List[PlanConfigDetailSchedule]

    @property
    def destination_holidays(self) -> Dict[str, Translations]:
        result = {}
        for destination in self.destinations:
            destination_holidays = holidays.country_holidays(destination.country_iso2)
            holiday = destination_holidays.get(self.date, None)
            if holiday is not None:
                en = holiday
                zh_hans = to_chinese_simplified(en)
                zh_hant = chinese_simplified_to_traditional(zh_hans)
                result[destination.country_iso2] = Translations(
                    en=en,
                    zh_hans=zh_hans,
                    zh_hant=zh_hant,
                )

        return result


class PlanConfig(BaseModel):
    date_start: date
    date_end: date
    details: List[PlanConfigDetail]


class Plan(Base, TimestampMixin):
    __tablename__ = "plan"

    id: Mapped[str] = mapped_column(sa.Text, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    _config: Mapped[Dict[str, Any]] = mapped_column("config", JSONB, nullable=False)

    user_associations: Mapped[List["PlanUser"]] = relationship(back_populates="plan")
    users: Mapped[List["User"]] = relationship(
        secondary=lambda: PlanUser.__table__,
        back_populates="plans",
        overlaps="user, plan, user_associations, plan_associations, user_id, plan_id",
    )

    @property
    def config(self) -> PlanConfig:
        return PlanConfig.model_validate_json(self._config)

    @config.setter
    def config(self, value: PlanConfig):
        self._config = value.model_dump_json()
