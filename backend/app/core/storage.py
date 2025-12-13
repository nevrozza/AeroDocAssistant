from langchain_community.embeddings.yandex import YandexGPTEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents.base import Document

from app.core import config

embeddings: YandexGPTEmbeddings
vectorstore: Chroma


def setup():
    global embeddings
    global vectorstore

    embeddings = YandexGPTEmbeddings(
        api_key=config.API_KEY,
        model_uri=f"emb://{config.FOLDER}/text-search-query/latest",
        doc_model_uri=f"emb://{config.FOLDER}/text-search-doc/latest"
    )

    vectorstore = Chroma(
        persist_directory="./chroma",
        embedding_function=embeddings
    )


async def update_document_async(doc: Document) -> str:
    return (await vectorstore.aadd_documents([doc]))[0]


async def search_async(query: str) -> list[Document]:
    return await vectorstore.asimilarity_search(query)
