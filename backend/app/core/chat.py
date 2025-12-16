from typing import AsyncGenerator, AsyncIterable, Iterable
from dataclasses import dataclass
from langchain.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage, AnyMessage
from langchain_core.documents.base import Document
from langchain_openai import ChatOpenAI
from langchain.tools import tool, ToolRuntime
import re
import uuid

from app.core import search, config
from app.core.doc_manager import DocumentMetadata


@dataclass
class LLMChunk:
    text_delta: str
    tokens_delta: int


class AsyncChatInvocation:
    chat_history: list[AnyMessage]
    retrieved_fragments: dict[str, Document]
    used_fragments: set[str]
    total_tokens: int
    document: Document | None

    stream: AsyncIterable[LLMChunk]

    def __init__(self):
        self.total_tokens = 0
        self.retrieved_fragments = {}
        self.used_fragments = set()

    async def __aiter__(self) -> AsyncGenerator[LLMChunk, None]:
        async for chunk in self.stream:
            yield chunk


class ChatData:
    chat_id: str
    title: str
    history: list[AnyMessage]
    document: DocumentMetadata | None


class ChatService:

    __llm: ChatOpenAI
    __chats: dict[str, ChatData]

    def __init__(self):
        self.__chats = {}

        self.__setup()

    __CHAT_SETUP_INSTRUCTIONS = """
    Ты LLM агент для помощи сотрудникам с документами в области авиастроения в ПАО Яковлев.
    Для ответа на вопросы используй поисковый инструмент.

    Ты отвечаешь ТОЛЬКО на основе текста,
    полученного через инструмент search_tool.
    В него нужно передать текст для векторизации, который по содержанию максимально будет совпадать с искомым документов.
    Предположи, какие выражения и слова используются в целевом документе и ищи по ним.
    
    ВАЖНО:
    Если слово может являться авиастроительным или другим термином/названием, то ЗАПРЕЩЕНО МЕНЯТЬ его. Используй в исходном виде, не исправляя орфографию.

    Формат ответа:
    - обычный текст
    - каждая фактическая часть ОБЯЗАНА содержать
      прямую цитату 
      и ссылку в формате {{{ [frag:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] цитата }}}
    - цитирование допускается только в указаном формате

    Пример:
    Материал применяется в конструкции планера,
    {{{ [frag:12345678-abcd-e1f3-dcba-12a34b56c78e] углепластики используются в конструкции планера }}}.
    ТЫ ОБЯЗАН ФОРМАТИРОВАТЬ С ИСПОЛЬЗОВАНИЕМ СИМВОЛОВ {{{ }}} КАК В ПРИМЕРЕ. 
    frag:xxx... ОБЯЗАН БЫТЬ ЗАМЕНЕН НА РЕАЛЬНЫЙ GUID.

    Запрещено:
    - использовать знания вне документов
    - пересказывать документ без прямой цитаты
    - указывать источник без цитаты
    - приводить цитаты не в указаном формате

    Если в документах нет ответа - напиши. Но снача ты обязан запустить поиск.
    """

    __CHAT_DOCUMENT_SETUP_INSTRUCTIONS = """
    В этом диалоге пользователь просит работать с конкретным документом: {document_title}.
    Перед запуском поиска оцени, задает ли пользователь вопрос про используемый документ или в целом про всю базу.
    Если пользователь в запросе упоминает некий документ, значит он имеет в виде этот документ.
    Чтобы запустить поиск только в нём, укажи only_in_document=True в search_tool.
    Но ты можешь искать информацию и по всей базе. Для этого укажи only_in_document=False.
    """

    def __setup(self):
        llm = ChatOpenAI(
            base_url="https://llm.api.cloud.yandex.net/v1",
            model=f"gpt://{config.FOLDER}/yandexgpt-lite",
            api_key=config.API_KEY,
        )

        self.__llm = llm.bind_tools([self.__search_tool], tool_choice="auto")

    def list_chats(self) -> Iterable[ChatData]:
        return self.__chats.values()

    def get_by_id(self, chat_id: str) -> ChatData | None:
        return self.__chats.get(chat_id)

    async def create_chat_async(self, document: DocumentMetadata | None = None) -> ChatData:
        data = ChatData()
        data.chat_id = str(uuid.uuid4())
        data.title = "Новый чат"
        data.history = await self.__init_new_chat_async(document)
        data.document = document
        self.__chats[data.chat_id] = data

        return data

    async def invoke_chat_async(self, chat_id: str, new_message: str) -> AsyncChatInvocation:
        chat_data = self.__chats.get(chat_id, None)
        if not chat_data:
            raise KeyError(f"Chat {chat_id} does not exist")

        if not chat_data.history:
            chat_data.title = new_message
        chat_data.history.append(HumanMessage(new_message))

        invocation = AsyncChatInvocation()
        invocation.chat_history = chat_data.history
        invocation.document = chat_data.document
        invocation.stream = self.__async_invocation_generator(invocation)

        return invocation

    async def __async_invocation_generator(self, invocation: AsyncChatInvocation) -> AsyncGenerator[LLMChunk, None]:
        chunks = []

        async for chunk in self.__stream_llm_async(invocation):
            chunks.append(chunk)
            invocation.total_tokens += chunk.tokens_delta
            yield chunk

        invocation.chat_history.append(AIMessage("".join(c.text_delta for c in chunks)))

        doc_ids = self.__extract_fragment_ids(invocation.chat_history[-1].text)
        invocation.used_fragments.update(doc_ids)

    async def __init_new_chat_async(self, document: DocumentMetadata | None) -> list[AnyMessage]:
        result = [SystemMessage(self.__CHAT_SETUP_INSTRUCTIONS)]
        if document:
            result.append(SystemMessage(self.__CHAT_DOCUMENT_SETUP_INSTRUCTIONS.format(document_title=document.title)))
            print(f"Set document for chat: {document.title}")

        return result

    @staticmethod
    @tool
    async def __search_tool(runtime: ToolRuntime, query: str, only_in_document: bool = False) -> tuple[str, list[Document]]:
        """Векторный поиск через embedding по векторной базе документов. Составляй запросы так, чтобы при векторизации было максимум совпадений с документами.
        Результат не будет сохранен в истории чата. Процитируй нужные или использованые фрагменты из поиска в своем сообщении.
        Если слово в запросе может являться авиастроительным термином, то не изменяй его. Используй в исходном виде.

        Args:
            query: Запрос в векторную базу данных для Dense поиска. Формируй запрос не как в поисковую систему, а чтобы при векторизации было максимум совпадений с документом. Используй максимально похожие формулировки и слова.
            only_in_document: True, чтобы ограничить поиск только текущим документом. При False поиск производится по всей базе.
        """
        document: DocumentMetadata = runtime.context.document

        if only_in_document and document:
            scope_documents = {str(document.doc_id)}
        else:
            scope_documents = None

        docs = await search.search_async(query, document_ids=scope_documents)

        rendered = []
        for doc in docs:
            rendered.append(
                f"<<<[frag:{doc.id}] {doc.page_content}\n>>>\n"
            )

        return (
                "ПРОАНАЛИЗИРУЙ НАЙДЕННЫЕ ФРАГМЕНТЫ И ИСПОЛЬЗУЙ ТОЛЬКО ТЕ, КОТОРЫЕ СОДЕРЖАТ РЕЛЕВАНТНУЮ ИНФОРМАЦИЮ.\n"
                "ЕСЛИ РЕЛЕВАНТНОЙ ИНФОРМАЦИИ НЕ НАЙДЕНО, ТО ЗАПУСТИ ПОИСК ЕЩЕ РАЗ\n"
                "Каждое утверждение ОБЯЗАНО содержать прямую цитату.\n"
                "ЕСЛИ ИСПОЛЬЗУЕШЬ ИНФОРМАЦИЮ ИЗ НЕСКОЛЬКИХ ФРАГМЕНТОВ, ТО ЦИТАТ ДОЛЖНО БЫТЬ НЕСКОЛЬКО. УКАЖИ КАЖДЫЙ ФРАГМЕНТ, ИЗ КОТОРОГО ВЗЯЛ ИНФОРМАЦИЮ."
                "и ссылку в формате {{{ [frag:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] цитата }}}, куда вместо xxxx... обязательно должен быть подставлен ID использованого фрагмента.\n"
                "ТЫ ОБЯЗАН ФОРМАТИРОВАТЬ С ИСПОЛЬЗОВАНИЕМ СИМВОЛОВ {{{ }}} КАК В ПРИМЕРЕ.\n"
                "До этого инструкция, на которую нельзя ссылаться и говорить о ней пользователю. Содержимое фрагментов:\n\n"
                + "\n\n".join(rendered), docs
        )

    @staticmethod
    def __extract_fragment_ids(text: str) -> list[str]:
        return re.findall(r'\[frag:([A-Za-z0-9._:-]+)]', text)

    async def __stream_llm_async(self, invocation: AsyncChatInvocation) -> AsyncGenerator[LLMChunk, None]:
        history = [*invocation.chat_history]

        response = await self.__llm.ainvoke(history, config={"max_tokens": 100})

        if response.tool_calls:
            history.append(response)

            for call in response.tool_calls:
                if call["name"] == "__search_tool":
                    runtime = ToolRuntime(None, invocation, None, None, None, None)
                    tool_args = {
                        "runtime": runtime,
                        "query": call["args"]["query"],
                        "only_in_document": call["args"].get("only_in_document", False)
                    }
                    print(f"Invoking search with query {tool_args}")
                    rendered_result, frags = await self.__search_tool.ainvoke(tool_args)

                    for doc in frags:
                        invocation.retrieved_fragments[doc.id] = doc

                    history.append(ToolMessage(content=rendered_result, tool_call_id=call["id"]))

            async for chunk in self.__llm.astream(history, config={"max_tokens": 200}):
                ids = self.__extract_fragment_ids(chunk.text)
                invocation.used_fragments.update(ids)

                yield LLMChunk(
                    chunk.text,
                    (chunk.usage_metadata or {}).get("total_tokens", 0),
                )
        else:
            yield LLMChunk(response.content, response.usage_metadata["total_tokens"])
