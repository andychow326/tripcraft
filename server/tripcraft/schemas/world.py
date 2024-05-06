from typing import Optional, Sequence

from tripcraft.schemas import PaginatedResponse
from tripcraft.schemas.base import BaseModelWithCamelCaseAlias


class Translations(BaseModelWithCamelCaseAlias):
    en: str
    zh_hant: str
    zh_hans: str


class RegionSchema(BaseModelWithCamelCaseAlias):
    id: int
    name: Translations


class SubRegionSchema(BaseModelWithCamelCaseAlias):
    id: int
    name: Translations
    region: RegionSchema


class CountrySchema(BaseModelWithCamelCaseAlias):
    id: int
    name: Translations
    iso3: str
    iso2: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    emoji: str
    region: Optional[RegionSchema]
    sub_region: Optional[SubRegionSchema]


class StateSchema(BaseModelWithCamelCaseAlias):
    id: int
    name: Translations
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    country: CountrySchema


class CitySchema(BaseModelWithCamelCaseAlias):
    id: int
    name: Translations
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    country: CountrySchema
    state: StateSchema


class RegionResponse(BaseModelWithCamelCaseAlias):
    results: Sequence[RegionSchema]


class SubRegionResponse(BaseModelWithCamelCaseAlias):
    results: Sequence[SubRegionSchema]


class CountryResponse(PaginatedResponse):
    results: Sequence[CountrySchema]


class StateResponse(PaginatedResponse):
    results: Sequence[StateSchema]


class CityResponse(PaginatedResponse):
    results: Sequence[CitySchema]
