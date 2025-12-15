from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, UUID4
from typing import Literal

from app.core.container import Container


router = APIRouter(prefix="/chat")


class DocumentSchema(BaseModel):
    document_id: UUID4
    title: str


class FragmentSchema(BaseModel):
    fragment_id: UUID4
    text: str
    source: UUID4
    source_page: int


class MessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    text: str
    used_fragments: list[UUID4]


class ChatMetadataSchema(BaseModel):
    chat_id: UUID4
    title: str


class ChatContentSchema(ChatMetadataSchema):
    messages: list[MessageSchema]
    used_fragments: list[FragmentSchema]
    used_documents: list[DocumentSchema]


@router.get("/list/", response_model=list[ChatMetadataSchema])
async def list_chats() -> list[ChatMetadataSchema]:
    converted = []
    for chat in Container.chat_service.list_chats():
        converted.append(ChatMetadataSchema(chat_id=chat.chat_id, title=chat.title))
    return converted


@router.post("/create/", response_model=ChatMetadataSchema)
async def create_chat() -> ChatMetadataSchema:
    chat = await Container.chat_service.create_chat_async()

    # для тестов
    from langchain.messages import HumanMessage, AIMessage
    chat.history.append(HumanMessage("Первый вопрос?"))
    chat.history.append(AIMessage("Какой-то ответ"))

    return ChatMetadataSchema(
        chat_id=chat.chat_id,
        title=chat.title,
    )


@router.get("/{chat_id}/", response_model=ChatContentSchema)
async def get_chat(chat_id: UUID4) -> ChatContentSchema:
    chat = Container.chat_service.get_by_id(str(chat_id))
    if not chat:
        raise HTTPException(404, "Chat not found")

    msg_type_map = {
        "human": "user",
        "ai": "assistant"
    }
    messages = [MessageSchema(role=msg_type_map[msg.type], text=msg.text, used_fragments=[]) for msg in chat.history if msg.type in msg_type_map.keys()]

    return ChatContentSchema(chat_id=chat.chat_id, title=chat.title, messages=messages, used_fragments=[], used_documents=[])
