from fastapi import FastAPI

from app.api.chat_rest import router as chat_rest_router
from app.api.chat_ws import router as chat_ws_router
from app.api.documents_rest import router as document_rest_router
from app.core.container import Container
from app.api.graph_rest import router as graph_rest_router
from starlette.middleware.cors import CORSMiddleware

Container.build()

app = FastAPI()

app.include_router(chat_rest_router)
app.include_router(chat_ws_router)
app.include_router(document_rest_router)
app.include_router(graph_rest_router)


def _add_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

_add_middleware(app)