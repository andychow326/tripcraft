from datetime import date
from typing import Sequence

from tripcraft.schemas.base import BaseModelWithCamelCaseAlias


class PlanConfigSchema(BaseModelWithCamelCaseAlias):
    date_start: date
    date_end: date


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
