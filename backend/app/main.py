import asyncio

from app.core import chat, storage


async def main():
    storage.setup()
    chat_service = chat.ChatService()

    while True:
        message = input(">>> ")

        invocation = await chat_service.invoke_chat_async("123", message)
        async for chunk in invocation:
            print(chunk.text_delta, end="", flush=True)

        print(f"\n({invocation.total_tokens} токенов)")

        for doc_id in invocation.used_documents:
            doc = invocation.retrieved_documents.get(doc_id, None)
            if not doc:
                print(f"Unretrieved used document: {doc_id}")
                continue

            print(f"Использовано: ```[doc:{doc_id}] {doc.metadata.get('title', '')}```")


if __name__ == '__main__':
    asyncio.run(main())
