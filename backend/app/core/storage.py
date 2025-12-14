from langchain_community.embeddings.yandex import YandexGPTEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents.base import Document
from langchain_community.retrievers import BM25Retriever
from natasha import MorphVocab, Doc, Segmenter, NewsMorphTagger, NewsEmbedding
import asyncio

from app.core import config

embeddings: YandexGPTEmbeddings
vectorstore: Chroma
bm25_retriever: BM25Retriever
bm25_documents: list[Document] = []
segmenter: Segmenter
morph_tagger: NewsMorphTagger
morph_vocab: MorphVocab


def setup():
    global embeddings
    global vectorstore
    global bm25_retriever
    global bm25_documents
    global segmenter
    global morph_tagger
    global morph_vocab

    embeddings = YandexGPTEmbeddings(
        api_key=config.API_KEY,
        model_uri=f"emb://{config.FOLDER}/text-search-query/latest",
        doc_model_uri=f"emb://{config.FOLDER}/text-search-doc/latest"
    )

    vectorstore = Chroma(
        persist_directory="./chroma",
        embedding_function=embeddings
    )

    segmenter = Segmenter()
    emb = NewsEmbedding()
    morph_tagger = NewsMorphTagger(emb)
    morph_vocab = MorphVocab()

    bm25_documents = _load_documents_from_chroma()
    rebuild_bm25()


def __normalize_text_natasha(text: str) -> list[str]:
    doc = Doc(text)
    doc.segment(segmenter)
    doc.tag_morph(morph_tagger)

    for token in doc.tokens:
        token.lemmatize(morph_vocab)

    lemmas = [
        token.lemma for token in doc.tokens
        if token.lemma and len(token.lemma) > 2
    ]
    return lemmas


def rebuild_bm25():
    global bm25_documents
    global bm25_retriever

    if not bm25_documents:
        docs = [Document("doc")]
    else:
        docs = bm25_documents

    bm25_retriever = BM25Retriever.from_documents(docs, k=10, preprocess_func=__normalize_text_natasha)


def _load_documents_from_chroma() -> list[Document]:
    all_data = vectorstore.get()
    ids = all_data["ids"]
    documents = all_data['documents']
    metadatas = all_data.get('metadatas', [{}] * len(documents))

    bm25_docs = []
    for i, (id, doc_text, metadata) in enumerate(zip(ids, documents, metadatas)):
        bm25_docs.append(Document(id=id,
            page_content=doc_text,
            metadata=metadata
        ))

    print(f"Loaded {len(bm25_docs)} fragments to BM25")
    return bm25_docs


async def update_document_async(doc: Document) -> str:
    global bm25_documents

    doc_id = (await vectorstore.aadd_documents([doc]))[0]

    bm25_documents.append(doc)
    rebuild_bm25()
    return doc_id


def hybrid_reranker(
        dense_results: list[tuple[Document, float]],
        sparse_results: list[Document],
        query: str,
        k: int = 60,
        boost_factor: float = 1.0
) -> list[Document]:
    query_keywords = set(__normalize_text_natasha(query.lower()))

    ranks = {}

    for rank, (doc, score) in enumerate(dense_results):
        content = doc.page_content
        if content not in ranks:
            ranks[content] = {'doc': doc, 'score': 0.0, 'keyword_matches': 0}
        ranks[content]['score'] = max(ranks[content]['score'], 1.0 / (k + rank + 1))

    for rank, doc in enumerate(sparse_results):
        content = doc.page_content
        content_lower = " ".join(__normalize_text_natasha(content.lower()))

        if content not in ranks:
            ranks[content] = {'doc': doc, 'score': 0.0, 'keyword_matches': 0}

        keyword_matches = sum(1 for keyword in query_keywords
                              if keyword in content_lower and len(keyword) > 2)

        ranks[content]['keyword_matches'] = keyword_matches

        base_score = 1.0 / (k + rank + 1)

        if keyword_matches > 0:
            boost = 1.0 + (boost_factor * keyword_matches / len(query_keywords))
            base_score *= boost

        ranks[content]['score'] = max(ranks[content]['score'], base_score)

    fused_results = []
    for content, data in ranks.items():
        fused_results.append((data['doc'], data['score']))

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
    print("SEARCH DENSE", dense_results)
    print("SEARCH SPARSE", sparse_results)

    hybrid_results = hybrid_reranker(dense_results, sparse_results, query, k=60)

    print("SEARCH RESULT", hybrid_results[:k])
    return hybrid_results[:k]
