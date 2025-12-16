from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel, UUID4
from enum import Enum
import traceback

from app.api.schemas import FragmentSchema, DocumentSchema
from app.core.container import Container


router = APIRouter(prefix="/chat")


class IncomingEventType(Enum):
    USER_MESSAGE = "USER_MESSAGE"


class IncomingMessageEvent(BaseModel):
    event_type: IncomingEventType = IncomingEventType.USER_MESSAGE
    text: str


class OutgoingEventType(Enum):
    ERROR = "ERROR"
    MESSAGE_CHUNK = "MESSAGE_CHUNK"


class OutgoingErrorEvent(BaseModel):
    event_type: OutgoingEventType = OutgoingEventType.ERROR
    error_text: str


class OutgoingMessageChunkEvent(BaseModel):
    event_type: OutgoingEventType = OutgoingEventType.MESSAGE_CHUNK
    chunk_text: str
    new_fragments: list[FragmentSchema]
    new_documents: list[DocumentSchema]


@router.websocket("/{chat_id}")
async def chat_ws(chat_id: UUID4, websocket: WebSocket):
    chat_data = Container.chat_service.get_by_id(str(chat_id))
    if not chat_data:
        raise HTTPException(404, f"Chat {chat_id} not found")

    await websocket.accept()
    while True:
        data = await websocket.receive_json()

        try:
            await __handle_incoming_async(websocket, chat_id, data)
        except WebSocketDisconnect:
            raise
        except Exception as e:
            traceback.print_exc()
            await websocket.send_json(OutgoingErrorEvent(error_text=str(e)).model_dump(mode="json"))


async def __handle_incoming_async(websocket: WebSocket, chat_id: UUID4, data: dict):
    match data["event_type"]:
        case IncomingEventType.USER_MESSAGE.value:
            event = IncomingMessageEvent(**data)
            await __handle_new_message_async(websocket, chat_id, event)
        case _:
            raise HTTPException(400, f"Unknown event type {data["event_type"]}")


async def __handle_new_message_async(websocket: WebSocket, chat_id: UUID4, event: IncomingMessageEvent):
    invocation = await Container.chat_service.invoke_chat_async(str(chat_id), event.text)

    async for chunk in invocation:
        internal_fragments = (invocation.retrieved_fragments[f] for f in chunk.new_fragments if f in invocation.retrieved_fragments)
        serializeable_fragments = [FragmentSchema(fragment_id=frag.id, text=frag.page_content, source=frag.metadata['source'],
                                                  source_page=frag.metadata['source_page_number']) for frag in internal_fragments]

        doc_ids = set(f.source for f in serializeable_fragments)
        docs = []
        for doc_id in doc_ids:
            doc = Container.doc_manager.get_by_id(doc_id)
            if doc:
                docs.append(DocumentSchema(document_id=doc.doc_id, title=doc.title))

        outgoing_event = OutgoingMessageChunkEvent(chunk_text=chunk.text_delta, new_fragments=serializeable_fragments, new_documents=docs)
        await websocket.send_json(outgoing_event.model_dump(mode="json"))
