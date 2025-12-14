from fastapi import FastAPI

from app.api.chat_router import router as chat_router
from app.core.container import Container


Container.build()

app = FastAPI()

app.include_router(chat_router)

