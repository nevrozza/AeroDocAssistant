import asyncio

from app.core import chat, search, config
from app.core.doc_manager import DocumentManager, DocumentMetadata


async def main():
    search.setup()
    chat_service = chat.ChatService()
    doc_manager = DocumentManager(config.DATA_FOLDER)
    doc_manager.load()

    scope_doc_id = input("Document ID: ")
    scope_doc: DocumentMetadata | None = None
    if scope_doc_id.strip():
        scope_doc = doc_manager.get_by_id(scope_doc_id)
        if not scope_doc:
            raise KeyError(f"Document {scope_doc_id} not found")

    chat_id = await chat_service.create_chat_async(scope_doc)

    while True:
        message = input(">>> ")

        invocation = await chat_service.invoke_chat_async(chat_id, message)
        async for chunk in invocation:
            print(chunk.text_delta, end="", flush=True)

        print(f"\n({invocation.total_tokens} токенов)")

        printed_docs = set()
        for frag_id in invocation.used_fragments:
            frag = invocation.retrieved_fragments.get(frag_id, None)
            if not frag:
                print(f"Unretrieved used document: {frag_id}")
                continue

            source = frag.metadata.get('source', "")
            if not source:
                print(f"Source of fragment {frag_id} is not specified")
                continue

            if source in printed_docs:
                continue
            printed_docs.add(source)

            doc = doc_manager.get_by_id(source)
            print(f"Использовано: ```{doc.title}```")


if __name__ == '__main__':
    asyncio.run(main())
