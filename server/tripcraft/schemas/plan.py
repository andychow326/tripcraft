from datetime import date, datetime
from typing import Dict, Literal, Optional, Sequence

from pydantic import Field

from tripcraft.schemas.base import BaseModelWithCamelCaseAlias
from tripcraft.schemas.world import Translations


class PlanConfigDetailDestinationSchema(BaseModelWithCamelCaseAlias):
    type: Literal["country", "state", "city"]
    id: int
    name: Optional[Translations] = None
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
    is_editable: bool


class PlanRequest(BaseModelWithCamelCaseAlias):
    name: str
    config: PlanConfigSchema
    public_role: Optional[Literal["editor", "viewer"]] = None
    public_visibility: Optional[bool] = None


class PlanMultipleResponse(BaseModelWithCamelCaseAlias):
    results: Sequence[PlanSchema]


class PlanSingleResponse(PlanSchema):
    pass
