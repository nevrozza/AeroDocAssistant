import asyncio
from typing import Generator
from dataclasses import dataclass
from langchain.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage, AnyMessage
from langchain_core.documents.base import Document
from langchain_community.chat_models import ChatYandexGPT
from langchain_openai import ChatOpenAI
from langchain.tools import tool

from app.core import storage, config

llm: ChatOpenAI


def setup():
    global llm
    llm = ChatOpenAI(
        base_url="https://llm.api.cloud.yandex.net/v1",
        model=f"gpt://{config.FOLDER}/yandexgpt-lite",
        api_key=config.API_KEY,
    )

    llm = llm.bind_tools([search_tool], tool_choice="auto")


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

    return SystemMessage(f"Автоматически добавленный RAG контекст: {'\n\n'.join(rendered_docs)}\nЕсли информации недостаточно или она не подходит, то используй инструмент поиска. При использовании этих данных обязательно приводи и отдельно выделяй цитату.")


@tool
async def search_tool(query: str) -> str:
    """Векторный поиск через embedding по векторной базе документов. Составляй запросы так, чтобы при векторизации было максимум совпадений с документами.
    Результат не будет сохранен в истории чата. Процитируй нужные или использованые фрагменты из поиска в своем сообщении.
    """
    docs = await storage.search_async(query)

    rendered = []
    for doc in docs:
        rendered.append(
            f"Документ: {doc.metadata.get('title', '')}\n{doc.page_content}"
        )

    return "\n\n".join(rendered)


async def stream_llm_async(history: list[AnyMessage], context: list[Document]) -> Generator[LLMChunk, None, None]:
    history = [*history, __context_to_message(context)]

    response = await llm.ainvoke(history)

    if response.tool_calls:
        history.append(response)

        for call in response.tool_calls:
            if call["name"] == "search_tool":
                tool_result = await search_tool.ainvoke(call["args"])
                print(f"Invoked search with query {call["args"]}")

                history.append(ToolMessage(content=tool_result, tool_call_id=call["id"]))

        async for chunk in llm.astream(history, config={"max_tokens": 50}):
            yield LLMChunk(
                chunk.text,
                (chunk.usage_metadata or {}).get("total_tokens", 0),
            )
    else:
        yield LLMChunk(response.content, 0)


SETUP_INSTRUCTIONS = """
Ты LLM помощник по технической документации в сфере авиастроения в ПАО Яковлев.

Правила:
- если вопрос требует фактов, терминов, параметров, стандартов — используй инструмент поиска
- не отвечай по памяти, если информация может быть в базе
- отвечай кратко и технически точно
- если используешь поиск, то обязательно приводи цитату.
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
