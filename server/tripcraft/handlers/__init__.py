from fastapi import FastAPI

from tripcraft.handlers.auth import auth
from tripcraft.handlers.healthz import healthz


def make_route(app: FastAPI):
    app.include_router(auth)
    app.include_router(healthz)
