from typing import Annotated, Optional, Sequence

import sqlalchemy as sa
from fastapi import Depends
from sqlalchemy.orm import Session

from tripcraft.models import City, Country, Region, State, SubRegion
from tripcraft.schemas import Pagination
from tripcraft.utils import with_db_session

from .base_query import BaseQuery


class RegionQuery(BaseQuery):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Region)

    def get_all(self, region_id: Optional[int] = None) -> Sequence[Region]:
        _query = self.query

        if region_id is not None:
            _query = _query.where(Region.id == region_id)

        return self._all(_query)

    def get_by_name(self, name: str) -> Sequence[Region]:
        _query = self.query.from_statement(
            sa.sql.text("SELECT * FROM regions WHERE regions ==> :name"),
        ).params(name=f"{name}*")
        return self._all(_query)


class SubRegionQuery(BaseQuery):
    def __init__(self, session: Session) -> None:
        super().__init__(session, SubRegion)

    def get_all(
        self,
        sub_region_id: Optional[int] = None,
        region_id: Optional[int] = None,
    ) -> Sequence[SubRegion]:
        _query = self.query

        if sub_region_id is not None:
            _query = _query.where(SubRegion.id == sub_region_id)

        if region_id is not None:
            _query = _query.where(SubRegion.region_id == region_id)

        return self._all(_query)

    def get_by_name(self, name: str) -> Sequence[SubRegion]:
        _query = self.query.from_statement(
            sa.sql.text("SELECT * FROM subregions WHERE subregions ==> :name"),
        ).params(name=f"{name}*")
        return self._all(_query)


class CountryQuery(BaseQuery):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Country)

    def get_all(
        self,
        pagination: Optional[Pagination] = None,
        country_id: Optional[int] = None,
        sub_region_id: Optional[int] = None,
        region_id: Optional[int] = None,
    ) -> Sequence[Country]:
        _query = self.query

        if country_id is not None:
            _query = _query.where(Country.id == country_id)

        if sub_region_id is not None:
            _query = _query.where(Country.region_id == sub_region_id)

        if region_id is not None:
            _query = _query.where(Country.region_id == region_id)

        if pagination is not None:
            _query = self._paginate(pagination, _query)

        return self._all(_query)

    def get_by_name(
        self,
        name: str,
        pagination: Optional[Pagination] = None,
    ) -> Sequence[Country]:
        _query = self.query.from_statement(
            sa.sql.text(
                "SELECT * FROM countries WHERE countries ==> :name "
                f"OFFSET {pagination.page_index * pagination.page_size} "
                f"LIMIT {pagination.page_size}"
            ),
        ).params(name=f"{name}*")
        return self._all(_query)

    def count(
        self,
        country_id: Optional[int] = None,
        region_id: Optional[int] = None,
        sub_region_id: Optional[int] = None,
    ) -> int:
        _query = sa.select(sa.func.count()).select_from(Country)

        if country_id is not None:
            _query = _query.where(Country.id == country_id)

        if region_id is not None:
            _query = _query.where(Country.region_id == region_id)

        if sub_region_id is not None:
            _query = _query.where(Country.region_id == sub_region_id)

        count_result = self.session.execute(_query)
        return count_result.scalar_one()

    def count_by_name(self, name: str):
        count_result = self.session.execute(
            sa.sql.text("SELECT COUNT(*) FROM countries WHERE countries ==> :name"),
            {"name": f"{name}*"},
        )
        return count_result.scalar_one()


class StateQuery(BaseQuery):
    def __init__(self, session: Session) -> None:
        super().__init__(session, State)

    def get_all(
        self,
        pagination: Optional[Pagination] = None,
        state_id: Optional[int] = None,
        country_id: Optional[int] = None,
    ) -> Sequence[State]:
        _query = self.query

        if state_id is not None:
            _query = _query.where(State.id == state_id)

        if country_id is not None:
            _query = _query.where(State.country_id == country_id)

        if pagination is not None:
            _query = self._paginate(pagination, _query)

        return self._all(_query)

    def get_by_name(
        self,
        name: str,
        pagination: Optional[Pagination] = None,
    ) -> Sequence[State]:
        _query = self.query.from_statement(
            sa.sql.text(
                "SELECT * FROM states WHERE states ==> :name "
                f"OFFSET {pagination.page_index * pagination.page_size} "
                f"LIMIT {pagination.page_size}"
            ),
        ).params(name=f"{name}*")
        return self._all(_query)

    def count(
        self,
        state_id: Optional[int] = None,
        country_id: Optional[int] = None,
    ) -> int:
        _query = sa.select(sa.func.count()).select_from(State)

        if state_id is not None:
            _query = _query.where(State.id == state_id)

        if country_id is not None:
            _query = _query.where(State.country_id == country_id)

        count_result = self.session.execute(_query)
        return count_result.scalar_one()

    def count_by_name(self, name: str):
        count_result = self.session.execute(
            sa.sql.text("SELECT COUNT(*) FROM states WHERE states ==> :name"),
            {"name": f"{name}*"},
        )
        return count_result.scalar_one()


class CityQuery(BaseQuery):
    def __init__(self, session: Session) -> None:
        super().__init__(session, City)

    def get_all(
        self,
        pagination: Optional[Pagination] = None,
        city_id: Optional[int] = None,
        state_id: Optional[int] = None,
        country_id: Optional[int] = None,
    ) -> Sequence[City]:
        _query = self.query

        if city_id is not None:
            _query = _query.where(City.id == city_id)

        if state_id is not None:
            _query = _query.where(City.state_id == state_id)

        if country_id is not None:
            _query = _query.where(City.country_id == country_id)

        if pagination is not None:
            _query = self._paginate(pagination, _query)

        return self._all(_query)

    def get_by_name(
        self,
        name: str,
        pagination: Optional[Pagination] = None,
    ) -> Sequence[City]:
        _query = self.query.from_statement(
            sa.sql.text(
                "SELECT * FROM cities WHERE cities ==> :name "
                f"OFFSET {pagination.page_index * pagination.page_size} "
                f"LIMIT {pagination.page_size}"
            ),
        ).params(name=f"{name}*")
        return self._all(_query)

    def count(
        self,
        city_id: Optional[int] = None,
        state_id: Optional[int] = None,
        country_id: Optional[int] = None,
    ) -> int:
        _query = sa.select(sa.func.count()).select_from(City)

        if city_id is not None:
            _query = _query.where(City.id == city_id)

        if state_id is not None:
            _query = _query.where(City.state_id == state_id)

        if country_id is not None:
            _query = _query.where(City.country_id == country_id)

        count_result = self.session.execute(_query)
        return count_result.scalar_one()

    def count_by_name(self, name: str):
        count_result = self.session.execute(
            sa.sql.text("SELECT COUNT(*) FROM cities WHERE cities ==> :name"),
            {"name": f"{name}*"},
        )
        return count_result.scalar_one()


class WorldQuery:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.region = RegionQuery(session)
        self.sub_region = SubRegionQuery(session)
        self.country = CountryQuery(session)
        self.state = StateQuery(session)
        self.city = CityQuery(session)


def with_world_query():
    def depend_query(session: Annotated[Session, Depends(with_db_session)]):
        return WorldQuery(session)

    return depend_query
