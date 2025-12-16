from fastapi import APIRouter, HTTPException
from pydantic import UUID4

from app.core.container import Container
from app.api.schemas import ChatMetadataSchema, ChatContentSchema, MessageSchema, DocumentSchema, FragmentSchema
from app.core.chat import ChatData
from app.core import search


router = APIRouter(prefix="/chat")


@router.get("/list/", response_model=list[ChatMetadataSchema])
async def list_chats() -> list[ChatMetadataSchema]:
    converted = []
    for chat in Container.chat_service.list_chats():
        converted.append(ChatMetadataSchema(chat_id=chat.chat_id, title=chat.title))
    return converted


@router.post("/create/", response_model=ChatMetadataSchema)
async def create_chat() -> ChatMetadataSchema:
    chat = await Container.chat_service.create_chat_async()

    return ChatMetadataSchema(
        chat_id=chat.chat_id,
        title=chat.title,
    )


@router.get("/")
async def get_chat_by_filter(document: UUID4) -> ChatMetadataSchema:
    meta = Container.doc_manager.get_by_id(str(document))
    if not meta:
        raise HTTPException(404, detail=f"Document {document} not found")

    chat = await Container.chat_service.get_document_chat_async(meta)

    return ChatMetadataSchema(
        chat_id=chat.chat_id,
        title=chat.title,
    )


@router.get("/{chat_id}/", response_model=ChatContentSchema)
async def get_chat(chat_id: UUID4) -> ChatContentSchema:
    chat = Container.chat_service.get_by_id(str(chat_id))
    if not chat:
        raise HTTPException(404, "Chat not found")

    internal_fragments = await search.get_fragments_by_id_async(list(chat.used_fragments))
    serializable_fragments = [FragmentSchema(fragment_id=frag.id, text=frag.page_content, source=frag.metadata['source'],
                                             source_page=frag.metadata['source_page_number']) for frag in internal_fragments]

    documents = []
    for doc_id in chat.used_documents:
        doc = Container.doc_manager.get_by_id(str(doc_id))
        if doc:
            documents.append(DocumentSchema(document_id=doc.doc_id, title=doc.title))

    msg_type_map = {
        "human": "user",
        "ai": "assistant"
    }
    messages = [MessageSchema(role=msg_type_map[msg.type], text=msg.text, used_fragments=[]) for msg in chat.history if msg.type in msg_type_map.keys()]

    return ChatContentSchema(chat_id=chat.chat_id, title=chat.title, messages=messages, used_fragments=serializable_fragments, used_documents=documents)
