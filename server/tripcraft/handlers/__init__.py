from fastapi import FastAPI

from tripcraft.handlers.healthz import healthz


def make_route(app: FastAPI):
    app.include_router(healthz)
