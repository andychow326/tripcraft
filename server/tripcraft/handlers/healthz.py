from fastapi import APIRouter

healthz = APIRouter()


@healthz.get("/healthz", operation_id="healthz_get")
def _healthz():
    return "ok"
