from fastapi import FastAPI

from app.api.chat_rest import router as chat_rest_router
from app.api.chat_ws import router as chat_ws_router
from app.api.documents_rest import router as document_rest_router
from app.core.container import Container


Container.build()

app = FastAPI()

app.include_router(chat_rest_router)
app.include_router(chat_ws_router)
app.include_router(document_rest_router)

