import datetime
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from tripcraft.handlers import error
from tripcraft.handlers.authn import with_current_user
from tripcraft.models import Plan, PlanConfig, PlanUser, PlanUserRole, User
from tripcraft.models.plan import (
    PlanConfigDetail,
    PlanConfigDetailDestination,
    PlanConfigDetailSchedule,
)
from tripcraft.queries import WorldQuery, with_world_query
from tripcraft.queries.plan_query import PlanQuery, with_plan_query
from tripcraft.schemas import (
    PlanConfigSchema,
    PlanMultipleResponse,
    PlanRequest,
    PlanSchema,
    PlanSingleResponse,
)
from tripcraft.schemas.plan import (
    PlanConfigDetailDestinationSchema,
    PlanConfigDetailScheduleSchema,
    PlanConfigDetailSchema,
)
from tripcraft.utils import with_db_session

plan = APIRouter(tags=["plan"])


def map_plan_config_detail_destination(
    destination: PlanConfigDetailDestination,
) -> PlanConfigDetailDestinationSchema:
    return PlanConfigDetailDestinationSchema(
        type=destination.type.value,
        id=destination.id,
        name=destination.name,
        country_iso2=destination.country_iso2,
    )


def map_plan_config_detail_schedule(
    schedule: PlanConfigDetailSchedule,
) -> PlanConfigDetailScheduleSchema:
    return PlanConfigDetailScheduleSchema(
        place=schedule.place,
        time_start=schedule.time_start,
        time_end=schedule.time_end,
    )


def map_plan_config_detail(detail: PlanConfigDetail) -> PlanConfigDetailSchema:
    return PlanConfigDetailSchema(
        date=detail.date,
        destinations=list(map(map_plan_config_detail_destination, detail.destinations)),
        destination_holidays=detail.destination_holidays,
        schedules=list(map(map_plan_config_detail_schedule, detail.schedules)),
    )


def create_map_plan(is_editable: bool):
    def map_plan(plan: Plan) -> PlanSchema:
        return PlanSchema(
            id=plan.id,
            name=plan.name,
            config=PlanConfigSchema(
                date_start=plan.config.date_start,
                date_end=plan.config.date_end,
                details=list(map(map_plan_config_detail, plan.config.details)),
            ),
            is_editable=is_editable,
        )

    return map_plan


@plan.get("/plan", operation_id="plan_get", response_model=PlanMultipleResponse)
def _plan(user: Annotated[User, Depends(with_current_user(False))]):
    return PlanMultipleResponse(
        results=list(map(create_map_plan(is_editable=True), user.plans))
    )


@plan.get(
    "/plan/{plan_id}", operation_id="plan_id_get", response_model=PlanSingleResponse
)
def _plan(
    plan_id: str,
    user: Annotated[Optional[User], Depends(with_current_user(True))],
    plan_query: Annotated[PlanQuery, Depends(with_plan_query())],
):
    plan: Plan = plan_query.get_by_id(plan_id)
    if plan is None or not plan.is_visible(user):
        raise error.not_found()

    is_editable = plan.is_editable(user)

    return create_map_plan(is_editable=is_editable)(plan)


@plan.post("/plan", operation_id="plan_post", response_model=PlanSingleResponse)
def _plan(
    body: PlanRequest,
    session: Annotated[Session, Depends(with_db_session)],
    user: Annotated[User, Depends(with_current_user(False))],
):
    date_start = body.config.date_start
    date_end = body.config.date_end
    details: List[PlanConfigDetail] = []
    for day in range((date_end - date_start).days + 1):
        date = date_start + datetime.timedelta(day)
        detail = PlanConfigDetail(
            date=date,
            destinations=[],
            schedules=[],
        )
        details.append(detail)

    plan = Plan(
        name=body.name,
        config=PlanConfig(
            date_start=date_start,
            date_end=date_end,
            details=details,
        ),
        public_role=(
            body.public_role if body.public_role is not None else PlanUserRole.viewer
        ),
        public_visibility=(
            body.public_visibility if body.public_visibility is not None else False
        ),
    )
    session.add(plan)
    session.commit()

    plan_user = PlanUser(
        plan_id=plan.id,
        user_id=user.id,
        role=PlanUserRole.owner,
    )
    session.add(plan_user)
    session.commit()

    session.flush()

    return create_map_plan(is_editable=True)(plan)


@plan.put(
    "/plan/{plan_id}", operation_id="plan_id_put", response_model=PlanSingleResponse
)
def _plan(
    plan_id: str,
    body: PlanRequest,
    session: Annotated[Session, Depends(with_db_session)],
    user: Annotated[User, Depends(with_current_user(True))],
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
    plan_query: Annotated[PlanQuery, Depends(with_plan_query())],
):
    plan: Plan = plan_query.get_by_id(plan_id)
    if plan is None or not plan.is_visible(user):
        raise error.not_found()

    if not plan.is_editable(user):
        raise error.forbidden()

    date_start = body.config.date_start
    date_end = body.config.date_end
    details: List[PlanConfigDetail] = []
    for day in range((date_end - date_start).days + 1):
        date = date_start + datetime.timedelta(day)
        detail = next(filter(lambda d: d.date == date, body.config.details), None)
        if detail is not None:
            detail = PlanConfigDetail(
                date=date,
                destinations=list(
                    map(
                        lambda d: PlanConfigDetailDestination(
                            type=d.type,
                            id=d.id,
                            name=world_query.get_name_by_type_id(d.type, d.id),
                            country_iso2=world_query.get_country_iso2_by_type_id(
                                d.type, d.id
                            ),
                        ),
                        detail.destinations,
                    )
                ),
                schedules=list(
                    map(
                        lambda s: PlanConfigDetailSchedule(
                            place=s.place, time_start=s.time_start, time_end=s.time_end
                        ),
                        detail.schedules,
                    )
                ),
            )
        else:
            detail = PlanConfigDetail(
                date=date,
                destinations=[],
                schedules=[],
            )
        details.append(detail)

    plan = Plan(
        id=plan_id,
        name=body.name,
        config=PlanConfig(
            date_start=date_start,
            date_end=date_end,
            details=details,
        ),
        public_role=(
            body.public_role if body.public_role is not None else plan.public_role
        ),
        public_visibility=(
            body.public_visibility
            if body.public_visibility is not None
            else plan.public_visibility
        ),
    )

    session.merge(plan)
    session.flush()

    return create_map_plan(is_editable=True)(plan)


@plan.delete(
    "/plan/{plan_id}",
    operation_id="plan_id_delete",
    response_model=PlanMultipleResponse,
)
def _plan(
    plan_id: str,
    session: Annotated[Session, Depends(with_db_session)],
    user: Annotated[User, Depends(with_current_user(False))],
):
    plan = next(filter(lambda plan: plan.id == plan_id, user.plans), None)
    if plan is None:
        raise error.not_found()

    for plan_user in plan.user_associations:
        session.delete(plan_user)
    session.delete(plan)
    session.flush()
    session.expire(user)

    return PlanMultipleResponse(
        results=list(map(create_map_plan(is_editable=True), user.plans))
    )
