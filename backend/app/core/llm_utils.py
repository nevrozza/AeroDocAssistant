from langchain_openai import ChatOpenAI
from langchain_core.documents.base import Document
from langchain.messages import SystemMessage

from app.core import config


class LLMUtils:

    __llm: ChatOpenAI

    def __init__(self):
        self.__llm = ChatOpenAI(
            base_url="https://llm.api.cloud.yandex.net/v1",
            model=f"gpt://{config.FOLDER}/yandexgpt-lite",
            api_key=config.API_KEY,
        )

    __TITLE_INSTRUCTIONS = \
"""
Ниже дано начало технического документа из сферы авиастроения.
Ты должен сделать краткие заголовок на 3-10 слов.
Приоритет - найти заголовок среди данного текста.
Заголовок должен отражать суть содержимого документа.
Документ:\n
"""

    async def get_doc_title_and_description_async(self, fragments: list[Document]) -> str:
        joined = "\n".join(f.page_content for f in fragments[:7])
        prompt = SystemMessage(self.__TITLE_INSTRUCTIONS + joined)

        response = await self.__llm.ainvoke([prompt], {"temperature": 0, "max_tokens": 50})
        return response.text
