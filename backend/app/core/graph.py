import asyncio
from typing import Generator
from dataclasses import dataclass
from langchain.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage, AnyMessage
from langchain_core.documents.base import Document
from langchain_community.chat_models import ChatYandexGPT
from langchain_openai import ChatOpenAI

from app.core import storage, config

llm: ChatOpenAI


def setup():
    global llm
    llm = ChatOpenAI(
        base_url="https://llm.api.cloud.yandex.net/v1",
        model=f"gpt://{config.FOLDER}/yandexgpt-lite",
        api_key=config.API_KEY,
    )


@dataclass
class LLMChunk:
    text_delta: str
    tokens_delta: int


ROLES_MAP = {
    "human": "user",
    "ai": "assistant",
    "system": "system",
    "tool": "system"
}


def __context_to_message(context: list[Document]) -> AnyMessage:
    rendered_docs = []
    for doc in context:
        rendered_docs.append(f"Документ: {doc.metadata.get("title", "")}\n{doc.page_content}")

    return ToolMessage(f"Результат поиска в базе знаний: {'\n\n'.join(rendered_docs)}", tool_call_id=123)


async def stream_llm_async(history: list[AnyMessage], context: list[Document]) -> Generator[LLMChunk, None, None]:
    history = [*history, __context_to_message(context)]
    async for chunk in llm.astream(history, config={"max_tokens": 50}):
        yield LLMChunk(chunk.text, (chunk.usage_metadata or {}).get("total_tokens", 0))


SETUP_INSTRUCTIONS = """
Ты LLM помощник по технической документации в сфере авиастроения в ПАО Яковлев.
Твоя задача - максимально экспертно отвечать сотрудникам на поставленные вопросы.
Без воды, только факты и реальная помощь.
"""


async def main():
    storage.setup()
    setup()

    history = [SystemMessage(SETUP_INSTRUCTIONS)]
    while True:
        message = input(">>> ")
        history.append(HumanMessage(message))
        chunks = []
        context = await storage.search_async(message)
        async for chunk in stream_llm_async(history, context):
            print(chunk.text_delta, end="", flush=True)
            chunks.append(chunk)

        history.append(AIMessage("".join(c.text_delta for c in chunks)))
        tokens = sum(c.tokens_delta for c in chunks)
        print(f"\n({tokens} токенов)\n")


if __name__ == "__main__":
    asyncio.run(main())
