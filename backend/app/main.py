import asyncio

from app.core import chat, storage, config
from app.core.doc_manager import DocumentManager


async def main():
    storage.setup()
    chat_service = chat.ChatService()
    doc_manager = DocumentManager(config.DATA_FOLDER)
    doc_manager.load()

    while True:
        message = input(">>> ")

        invocation = await chat_service.invoke_chat_async("123", message)
        async for chunk in invocation:
            print(chunk.text_delta, end="", flush=True)

        print(f"\n({invocation.total_tokens} токенов)")

        for frag_id in invocation.used_fragments:
            frag = invocation.retrieved_fragments.get(frag_id, None)
            if not frag:
                print(f"Unretrieved used document: {frag_id}")
                continue

            source = frag.metadata.get('source', "")
            if not source:
                print(f"Source of fragment {frag_id} is not specified")
                continue

            doc = doc_manager.get_by_id(source)
            print(f"Использовано: ```{doc.title}```")


if __name__ == '__main__':
    asyncio.run(main())
