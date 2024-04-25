import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tripcraft.constants import ALLOW_ORIGINS, LOG_LEVEL
from tripcraft.handlers import make_route
from tripcraft.logging import SlogFormatter

stream_handler = logging.StreamHandler()
formatter = SlogFormatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
stream_handler.setFormatter(formatter)
logging.basicConfig(
    handlers=[stream_handler],
    level=LOG_LEVEL,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

make_route(app)
