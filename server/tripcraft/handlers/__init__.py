from fastapi import FastAPI

from tripcraft.handlers.auth import auth
from tripcraft.handlers.healthz import healthz
from tripcraft.handlers.plan import plan
from tripcraft.handlers.world import world


def make_route(app: FastAPI):
    app.include_router(auth)
    app.include_router(healthz)
    app.include_router(world)
    app.include_router(plan)
