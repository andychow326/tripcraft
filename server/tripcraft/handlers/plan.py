from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from tripcraft.handlers import error
from tripcraft.handlers.authn import with_current_user
from tripcraft.models import Plan, PlanConfig, PlanUser, PlanUserRole, User
from tripcraft.schemas import (
    PlanConfigSchema,
    PlanMultipleResponse,
    PlanRequest,
    PlanSchema,
    PlanSingleResponse,
)
from tripcraft.utils import with_db_session

plan = APIRouter(tags=["plan"])


def map_plan(plan: Plan) -> PlanSchema:
    return PlanSchema(
        id=plan.id,
        name=plan.name,
        config=PlanConfigSchema(
            date_start=plan.config.date_start,
            date_end=plan.config.date_end,
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
    plan = Plan(
        name=body.name,
        config=PlanConfig(
            date_start=body.config.date_start,
            date_end=body.config.date_end,
        ),
    )
    session.add(plan)
    session.commit()

    plan_user = PlanUser(
        plan_id=plan.id,
        user_id=user.id,
        role=PlanUserRole.editor,
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
):
    plan = next(filter(lambda plan: plan.id == plan_id, user.plans), None)
    if plan is None:
        raise error.not_found()

    plan = Plan(
        id=plan_id,
        name=body.name,
        config=PlanConfig(
            date_start=body.config.date_start,
            date_end=body.config.date_end,
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
