from langchain_community.embeddings.yandex import YandexGPTEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents.base import Document
from langchain_community.retrievers import BM25Retriever
import asyncio

from app.core import config

embeddings: YandexGPTEmbeddings
vectorstore: Chroma
bm25_retriever: BM25Retriever
bm25_documents: list[Document] = []


def setup():
    global embeddings
    global vectorstore
    global bm25_retriever
    global bm25_documents

    embeddings = YandexGPTEmbeddings(
        api_key=config.API_KEY,
        model_uri=f"emb://{config.FOLDER}/text-search-query/latest",
        doc_model_uri=f"emb://{config.FOLDER}/text-search-doc/latest"
    )

    vectorstore = Chroma(
        persist_directory="./chroma",
        embedding_function=embeddings
    )

    bm25_documents = _load_documents_from_chroma()
    rebuild_bm25()


def rebuild_bm25():
    global bm25_documents
    global bm25_retriever

    bm25_retriever = BM25Retriever.from_documents(bm25_documents, k=10)


def _load_documents_from_chroma() -> list[Document]:
    all_data = vectorstore.get()
    documents = all_data['documents']
    metadatas = all_data.get('metadatas', [{}] * len(documents))

    bm25_docs = []
    for i, (doc_text, metadata) in enumerate(zip(documents, metadatas)):
        bm25_docs.append(Document(
            page_content=doc_text,
            metadata=metadata
        ))

    print(f"Loaded {len(bm25_docs)} documents to BM25")
    return bm25_docs


async def update_document_async(doc: Document) -> str:
    global bm25_documents

    doc_id = (await vectorstore.aadd_documents([doc]))[0]

    bm25_documents.append(doc)
    rebuild_bm25()
    return doc_id


def reciprocal_rank_fusion(
        dense_results: list[tuple[Document, float]],
        sparse_results: list[Document],
        k: int = 60
) -> list[Document]:

    ranks = {}

    for rank, (doc, score) in enumerate(dense_results):
        content = doc.page_content
        if content not in ranks:
            ranks[content] = {'doc': doc, 'scores': []}
        ranks[content]['scores'].append(1.0 / (k + rank + 1))

    for rank, doc in enumerate(sparse_results):
        content = doc.page_content
        if content not in ranks:
            ranks[content] = {'doc': doc, 'scores': []}
        ranks[content]['scores'].append(1.0 / (k + rank + 1))

    fused_results = []
    for content, data in ranks.items():
        fused_score = sum(data['scores'])
        fused_results.append((data['doc'], fused_score))

    fused_results.sort(key=lambda x: x[1], reverse=True)

    return [doc for doc, _ in fused_results]


async def search_async(query: str, k: int = 5) -> list[Document]:
    loop = asyncio.get_event_loop()

    dense_task = vectorstore.asimilarity_search_with_relevance_scores(query, k=k)

    sparse_task = loop.run_in_executor(
        None,
        lambda: bm25_retriever.invoke(query)
    )

    dense_results, sparse_results = await asyncio.gather(dense_task, sparse_task)
    print("SEARCH INTERNAL", dense_results, sparse_results)

    hybrid_results = reciprocal_rank_fusion(dense_results, sparse_results)

    return hybrid_results[:k]
