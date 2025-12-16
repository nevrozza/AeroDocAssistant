import asyncio
from langchain_core.documents import Document
import uuid
from pathlib import Path

from app.core import search
from app.core.doc_manager import DocumentManager
from app.core.doc_loader import PDFLoader


async def main():
    search.setup()

    mode = input("MODE: ")
    if mode in ("SEARCH", "S"):
        print(await search.search_async(input("SEARCH: ")))
        return

    search.vectorstore.reset_collection()

    manager = DocumentManager(Path("./data"))
    manager.load()

    loader = PDFLoader()

    for doc in manager.list_documents():
        if not input(str(doc.filepath) + "? "):
            continue

        print(f"Processing {doc.filepath}...")

        fragments = loader.load(manager.get_abs_path(doc.filepath), doc)
        print(f"Read {len(fragments)} fragments")

        await manager.update_metadata_async(doc, fragments)
        print(f"New title: {doc.title}")

        for frag in fragments:
            await search.update_document_async(frag)
        search.rebuild_bm25()

    print(search.vectorstore.get())


if __name__ == '__main__':
    asyncio.run(main())
