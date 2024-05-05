import datetime
from typing import Annotated, List

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


def map_plan(plan: Plan) -> PlanSchema:
    return PlanSchema(
        id=plan.id,
        name=plan.name,
        config=PlanConfigSchema(
            date_start=plan.config.date_start,
            date_end=plan.config.date_end,
            details=list(map(map_plan_config_detail, plan.config.details)),
        ),
    )


@plan.get("/plan", operation_id="plan_get", response_model=PlanMultipleResponse)
def _plan(user: Annotated[User, Depends(with_current_user)]):
    return PlanMultipleResponse(results=list(map(map_plan, user.plans)))


@plan.get(
    "/plan/{plan_id}", operation_id="plan_id_get", response_model=PlanSingleResponse
)
def _plan(plan_id: str, user: Annotated[User, Depends(with_current_user)]):
    plan = next(filter(lambda plan: plan.id == plan_id, user.plans), None)
    if plan is None:
        raise error.not_found()

    return map_plan(plan)


@plan.post("/plan", operation_id="plan_post", response_model=PlanSingleResponse)
def _plan(
    body: PlanRequest,
    session: Annotated[Session, Depends(with_db_session)],
    user: Annotated[User, Depends(with_current_user)],
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

    return map_plan(plan)


@plan.put(
    "/plan/{plan_id}", operation_id="plan_id_put", response_model=PlanSingleResponse
)
def _plan(
    plan_id: str,
    body: PlanRequest,
    session: Annotated[Session, Depends(with_db_session)],
    user: Annotated[User, Depends(with_current_user)],
    world_query: Annotated[WorldQuery, Depends(with_world_query())],
):
    plan = next(filter(lambda plan: plan.id == plan_id, user.plans), None)
    if plan is None:
        raise error.not_found()

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
    )

    session.merge(plan)
    session.flush()

    return map_plan(plan)


@plan.delete(
    "/plan/{plan_id}",
    operation_id="plan_id_delete",
    response_model=PlanMultipleResponse,
)
def _plan(
    plan_id: str,
    session: Annotated[Session, Depends(with_db_session)],
    user: Annotated[User, Depends(with_current_user)],
):
    plan = next(filter(lambda plan: plan.id == plan_id, user.plans), None)
    if plan is None:
        raise error.not_found()

    for plan_user in plan.user_associations:
        session.delete(plan_user)
    session.delete(plan)
    session.flush()
    session.expire(user)

    return PlanMultipleResponse(results=list(map(map_plan, user.plans)))
