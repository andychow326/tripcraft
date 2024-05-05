from datetime import date, datetime
from typing import Dict, Literal, Optional, Sequence

from pydantic import Field

from tripcraft.schemas import Translations
from tripcraft.schemas.base import BaseModelWithCamelCaseAlias


class PlanConfigDetailDestinationSchema(BaseModelWithCamelCaseAlias):
    type: Literal["country", "state", "city"]
    id: int
    country_iso2: Optional[str] = None


class PlanConfigDetailScheduleSchema(BaseModelWithCamelCaseAlias):
    place: str
    time_start: datetime
    time_end: datetime


class PlanConfigDetailSchema(BaseModelWithCamelCaseAlias):
    date: date
    destinations: Sequence[PlanConfigDetailDestinationSchema]
    destination_holidays: Dict[str, Translations] = Field({})
    schedules: Sequence[PlanConfigDetailScheduleSchema]


class PlanConfigSchema(BaseModelWithCamelCaseAlias):
    date_start: date
    date_end: date
    details: Sequence[PlanConfigDetailSchema] = Field([])


class PlanSchema(BaseModelWithCamelCaseAlias):
    id: str
    name: str
    config: PlanConfigSchema


class PlanRequest(BaseModelWithCamelCaseAlias):
    name: str
    config: PlanConfigSchema


class PlanMultipleResponse(BaseModelWithCamelCaseAlias):
    results: Sequence[PlanSchema]


class PlanSingleResponse(PlanSchema):
    pass
