from typing import Literal
from pydantic import BaseModel, UUID4


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