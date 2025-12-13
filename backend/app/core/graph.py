import asyncio
from typing import Generator
from dataclasses import dataclass
from yandex_cloud_ml_sdk import AsyncYCloudML
from yandex_cloud_ml_sdk._models.completions.model import AsyncGPTModel
from langchain.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage, AnyMessage
from langchain_core.documents.base import Document

from app.core import storage, config

llm: AsyncGPTModel


def setup():
    global llm
    sdk = AsyncYCloudML(
        auth=config.API_KEY,
        folder_id=config.FOLDER,
    )
    model = sdk.models.completions("yandexgpt-lite")
    llm = model.configure(max_tokens=50)


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
    prev_text = ""
    prev_tokens = 0
    history = [*history, __context_to_message(context)]
    async for chunk in llm.run_stream([{"role": ROLES_MAP[m.type], "text": m.text} for m in history]):
        text_delta = chunk.alternatives[0].text.lstrip(prev_text)
        prev_text = chunk.alternatives[0].text

        tokens_delta = chunk.usage.total_tokens - prev_tokens
        prev_tokens = chunk.usage.total_tokens
        yield LLMChunk(text_delta, tokens_delta)


async def main():
    storage.setup()
    setup()

    history = [SystemMessage("Ты LLM помощник по технической документации в сфере авиастроения в ПАО Яковлев. "
                             "Твоя задача - максимально экспертно отвечать сотрудникам на поставленные вопросы. "
                             "Без воды, только факты и реальная помощь.")]
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
