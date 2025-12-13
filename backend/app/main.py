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

        for frag_id in invocation.used_fragments:
            frag = invocation.retrieved_fragments.get(frag_id, None)
            if not frag:
                print(f"Unretrieved used document: {frag_id}")
                continue

            print(f"Использовано: ```{frag.metadata.get('title', '')}```")


if __name__ == '__main__':
    asyncio.run(main())
