import logging
from typing import Any, List, Optional, Sequence, TypeVar

import sqlalchemy as sa
from sqlalchemy.orm import Session

from tripcraft.schemas import Pagination

T = TypeVar("T")

logger = logging.getLogger(__name__)


class BaseQuery(object):
    def __init__(
        self,
        session: Session,
        model: T,
    ):
        self.session = session
        self.Model = model

    @property
    def query(self) -> sa.Select[Any]:
        return sa.select(self.Model)

    def _all_without_unique(self, query: sa.Select[Any]) -> Sequence[T]:
        result = self.session.execute(query)
        return result.scalars().all()

    def _all(self, query: sa.Select[Any]) -> Sequence[T]:
        result = self.session.execute(query).unique()
        return result.scalars().all()

    def get_by_id(self, id_: int) -> Optional[T]:
        query = self.query.where(self.Model.id == id_).limit(1)
        result = self.session.execute(query)
        return result.scalars().first()

    def get_by_ids(self, ids: Sequence[int]) -> List[T]:
        query = self.query.where(self.Model.id.in_(ids))
        result = self._all(query)
        return result

    def _paginate(self, pagination: Pagination, query: sa.Select[Any]):
        _query = query.offset(pagination.page_index * pagination.page_size).limit(
            pagination.page_size
        )
        return _query
