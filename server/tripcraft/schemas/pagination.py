from typing import Annotated, Generic, Optional, Sequence, TypeVar

from fastapi import Query

from .base import BaseModelWithCamelCaseAlias

T = TypeVar("T")


def with_pagination_params(
    page_index: Annotated[int, Query(alias="pageIndex")] = 0,
    page_size: Annotated[int, Query(alias="pageSize")] = 10,
):
    return PaginationParams(page_index=page_index, page_size=page_size)


class PaginationParams(BaseModelWithCamelCaseAlias):
    page_index: int
    page_size: int


class Pagination(BaseModelWithCamelCaseAlias):
    page_index: int
    page_size: int
    _total_count: Optional[int] = None

    @classmethod
    def from_query_params(cls, params: PaginationParams) -> "Pagination":
        return Pagination(
            page_index=params.page_index,
            page_size=params.page_size,
        )

    def _next_page(self) -> "Pagination":
        return Pagination(
            page_index=self.page_index + 1,
            page_size=self.page_size,
        )

    @property
    def next_page_index(self) -> Optional[int]:
        if self.total_count is None:
            return None
        next_pagination = self._next_page()
        has_next_page_index = (
            self.total_count > next_pagination.page_index * next_pagination.page_size
        )
        next_page_index = next_pagination.page_index if has_next_page_index else None
        return next_page_index

    @property
    def total_count(self) -> Optional[int]:
        return self._total_count

    @total_count.setter
    def total_count(self, value: Optional[int]):
        self._total_count = value


class PaginatedResponse(BaseModelWithCamelCaseAlias, Generic[T]):
    total_count: int
    next_page_index: Optional[int]
    results: Sequence[T]
