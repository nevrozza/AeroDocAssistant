from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.chat_router import router as chat_router
from app.core.container import Container

def _add_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

Container.build()

app = FastAPI()

app.include_router(chat_router)
_add_middleware(app)

