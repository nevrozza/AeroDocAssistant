from fastapi import APIRouter
from pydantic import BaseModel, UUID4
from typing import Literal

from uuid import uuid4


router = APIRouter(prefix="/chat")


class MessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    text: str
    used_fragments: list[UUID4]


class FragmentSchema(BaseModel):
    fragment_id: UUID4
    text: str
    source: UUID4
    source_page: int


class ChatMetadataSchema(BaseModel):
    chat_id: UUID4
    title: str


class ChatContentSchema(ChatMetadataSchema):
    messages: list[MessageSchema]
    used_fragments: list[FragmentSchema]


@router.get("/", response_model=list[ChatMetadataSchema])
async def list_chats() -> list[ChatMetadataSchema]:
    return [
        ChatMetadataSchema(chat_id=uuid4(), title="Первый чат"),
        ChatMetadataSchema(chat_id=uuid4(), title="Заголовок второго чата")
    ]


@router.post("/create/", response_model=ChatMetadataSchema)
async def create_chat() -> ChatMetadataSchema:
    return ChatMetadataSchema(
        chat_id=uuid4(),
        title="Новый чат"
    )


@router.get("/{chat_id}/", response_model=ChatContentSchema)
async def get_chat(chat_id: UUID4) -> ChatContentSchema:
    fragments = [
        FragmentSchema(fragment_id=uuid4(), text="Текст первого фрагмента из которого будет взята цитата")
    ]
    return ChatContentSchema(
        chat_id=chat_id,
        title=f"Чат {chat_id}",
        messages=[
            MessageSchema(role="user", text="Первый вопрос?", used_fragments=[]),
            MessageSchema(role="assistant", text=f"Ответ LLM на первый вопрос {{{{{{[frag:{fragments[0].fragment_id}] будет взята цитата}}}}}}", used_fragments=[fragments[0].fragment_id])
        ],
        used_fragments=fragments
    )
