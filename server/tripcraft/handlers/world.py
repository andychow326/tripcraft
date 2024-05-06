from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Query

from tripcraft.models import City, Country, Region, State, SubRegion
from tripcraft.queries import WorldQuery, with_world_query
from tripcraft.schemas import (
    CityResponse,
    CitySchema,
    CountryResponse,
    CountrySchema,
    Pagination,
    PaginationParams,
    RegionResponse,
    RegionSchema,
    StateResponse,
    StateSchema,
    SubRegionResponse,
    SubRegionSchema,
    with_pagination_params,
)

world = APIRouter(tags=["world"])


def map_region(region: Region) -> RegionSchema:
    return RegionSchema(
        id=region.id,
        name=region.translations,
    )


def map_sub_region(sub_region: SubRegion) -> SubRegionSchema:
    return SubRegionSchema(
        id=sub_region.id,
        name=sub_region.translations,
        region=map_region(sub_region.region),
    )


def map_country(country: Country) -> CountrySchema:
    return CountrySchema(
        id=country.id,
        name=country.translations,
        iso3=country.iso3,
        iso2=country.iso2,
        latitude=country.latitude,
        longitude=country.longitude,
        emoji=country.emoji,
        region=map_region(country.region) if country.region is not None else None,
        sub_region=(
            map_sub_region(country.sub_region)
            if country.sub_region is not None
            else None
        ),
    )


def map_state(state: State) -> StateSchema:
    return StateSchema(
        id=state.id,
        name=state.translations,
        latitude=state.latitude,
        longitude=state.longitude,
        country=map_country(state.country),
    )


def map_city(city: City) -> CitySchema:
    return CitySchema(
        id=city.id,
        name=city.translations,
        latitude=city.latitude,
        longitude=city.longitude,
        country=map_country(city.country),
        state=map_state(city.state),
    )


@world.get(
    "/world/region",
    operation_id="world_region_get",
    response_model=RegionResponse,
)
def _world_region(
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
    name: Annotated[Optional[str], Query(alias="name")] = None,
    id: Annotated[Optional[int], Query(alias="id")] = None,
):
    if name is not None:
        regions = world_query.region.get_by_name(name=name)
    else:
        regions = world_query.region.get_all(region_id=id)
    return RegionResponse(results=list(map(map_region, regions)))


@world.get(
    "/world/sub_region",
    operation_id="world_sub_region_get",
    response_model=SubRegionResponse,
)
def _world_sub_region(
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
    name: Annotated[Optional[str], Query(alias="name")] = None,
    id: Annotated[Optional[int], Query(alias="id")] = None,
    region_id: Annotated[Optional[int], Query(alias="regionId")] = None,
):
    if name is not None:
        sub_regions = world_query.sub_region.get_by_name(name)
    else:
        sub_regions = world_query.sub_region.get_all(
            sub_region_id=id,
            region_id=region_id,
        )
    return SubRegionResponse(results=list(map(map_sub_region, sub_regions)))


@world.get(
    "/world/country",
    operation_id="world_country_get",
    response_model=CountryResponse,
)
def _world_country(
    pagination: Annotated[PaginationParams, Depends(with_pagination_params)],
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
    name: Annotated[Optional[str], Query(alias="name")] = None,
    id: Annotated[Optional[int], Query(alias="id")] = None,
    sub_region_id: Annotated[Optional[int], Query(alias="subRegionId")] = None,
    region_id: Annotated[Optional[int], Query(alias="regionId")] = None,
):
    pagination_object = Pagination.from_query_params(params=pagination)
    if name is not None:
        countries = world_query.country.get_by_name(
            pagination=pagination_object,
            name=name,
        )
        pagination_object.total_count = world_query.country.count_by_name(name=name)
    else:
        countries = world_query.country.get_all(
            pagination=pagination_object,
            country_id=id,
            sub_region_id=sub_region_id,
            region_id=region_id,
        )
        pagination_object.total_count = world_query.country.count(
            country_id=id,
            sub_region_id=sub_region_id,
            region_id=region_id,
        )

    return CountryResponse(
        total_count=pagination_object.total_count or 0,
        next_page_index=pagination_object.next_page_index,
        results=list(map(map_country, countries)),
    )


@world.get(
    "/world/state",
    operation_id="world_state_get",
    response_model=StateResponse,
)
def _world_state(
    pagination: Annotated[PaginationParams, Depends(with_pagination_params)],
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
    name: Annotated[Optional[str], Query(alias="name")] = None,
    id: Annotated[Optional[int], Query(alias="id")] = None,
    country_id: Annotated[Optional[int], Query(alias="countryId")] = None,
):
    pagination_object = Pagination.from_query_params(params=pagination)
    if name is not None:
        states = world_query.state.get_by_name(
            pagination=pagination_object,
            name=name,
        )
        pagination_object.total_count = world_query.state.count_by_name(name=name)
    else:
        states = world_query.state.get_all(
            pagination=pagination_object,
            state_id=id,
            country_id=country_id,
        )
        pagination_object.total_count = world_query.state.count(
            state_id=id,
            country_id=country_id,
        )

    return StateResponse(
        total_count=pagination_object.total_count or 0,
        next_page_index=pagination_object.next_page_index,
        results=list(map(map_state, states)),
    )


@world.get(
    "/world/city",
    operation_id="world_city_get",
    response_model=CityResponse,
)
def _world_city(
    pagination: Annotated[PaginationParams, Depends(with_pagination_params)],
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
    name: Annotated[Optional[str], Query(alias="name")] = None,
    id: Annotated[Optional[int], Query(alias="id")] = None,
    state_id: Annotated[Optional[int], Query(alias="stateId")] = None,
    country_id: Annotated[Optional[int], Query(alias="countryId")] = None,
):
    pagination_object = Pagination.from_query_params(params=pagination)
    if name is not None:
        cities = world_query.city.get_by_name(
            pagination=pagination_object,
            name=name,
        )
        pagination_object.total_count = world_query.city.count_by_name(name=name)
    else:
        cities = world_query.city.get_all(
            pagination=pagination_object,
            city_id=id,
            state_id=state_id,
            country_id=country_id,
        )
        pagination_object.total_count = world_query.city.count(
            city_id=id,
            state_id=state_id,
            country_id=country_id,
        )

    return CityResponse(
        total_count=pagination_object.total_count or 0,
        next_page_index=pagination_object.next_page_index,
        results=list(map(map_city, cities)),
    )
