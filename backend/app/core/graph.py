from __future__ import annotations

from dataclasses import dataclass
from collections import defaultdict
from typing import Dict, List, Set, Tuple, Iterable
import json
from pathlib import Path
import re

from langchain_core.documents.base import Document

from app.core import search, config


# --------- helpers: ID extraction (signal #3) ---------

_ID_PATTERNS = [
    # ГОСТ / ОСТ / ТУ / СТП / etc + number-like tokens
    r"\b(ГОСТ|ОСТ|ТУ|СТП|СТО)\s*[A-ZА-Я0-9\-–—/.]+\b",
    r"\b(Стандарт)\s*(?:для\s+\S+\s+)?№\s*\d+\b",
    r"\b№\s*\d{2,}\b",
]

def extract_identifiers(text: str) -> Set[str]:
    found: Set[str] = set()
    for pat in _ID_PATTERNS:
        for m in re.findall(pat, text, flags=re.IGNORECASE):
            # re.findall can return tuples for grouped patterns; normalize:
            if isinstance(m, tuple):
                m = " ".join([x for x in m if x])
            found.add(str(m).strip())
    return {x for x in found if x and len(x) >= 3}


# --------- core graph build ---------

@dataclass
class GraphBuildConfig:
    # how many related fragments to fetch per fragment
    k_related: int = 6
    # cap fragments per document to avoid huge runtime 
    max_frags_per_doc: int = 80
    # ignore links with same doc_id (optional)
    skip_same_document: bool = True


def _all_fragments_from_chroma() -> List[Document]:
    """
    Loads ALL fragments from chroma via search.vectorstore.get().
    Requires search.setup() already called.
    """
    all_data = search.vectorstore.get()
    ids = all_data["ids"]
    docs = all_data["documents"]
    metas = all_data.get("metadatas", [{}] * len(docs))

    out: List[Document] = []
    for fid, content, meta in zip(ids, docs, metas):
        out.append(Document(id=fid, page_content=content, metadata=meta or {}))
    return out


def build_reference_indexes(cfg: GraphBuildConfig) -> Dict[str, object]:
    """
    Offline:
    - For each doc -> for each fragment -> find related fragments via hybrid search
    - Build:
        fragment_links: frag_id -> set(related_frag_id)
        document_links: doc_id -> set(related_doc_id)
    """
    fragments = _all_fragments_from_chroma()

    # group fragments by document id (metadata["source"])
    frags_by_doc: Dict[str, List[Document]] = defaultdict(list)
    for f in fragments:
        doc_id = f.metadata.get("source")
        if doc_id:
            frags_by_doc[str(doc_id)].append(f)

    # indexes
    fragment_links: Dict[str, Set[str]] = defaultdict(set)
    document_links: Dict[str, Set[str]] = defaultdict(set)

    # optional: doc identifiers extracted from content 
    doc_identifiers: Dict[str, Set[str]] = defaultdict(set)

    for doc_id, frags in frags_by_doc.items():
        # cap
        frags = frags[: cfg.max_frags_per_doc]

        # pre-extract identifiers from the first N frags 
        for f in frags[:20]:
            doc_identifiers[doc_id].update(extract_identifiers(f.page_content))

        for f in frags:
            query = f.page_content
            if not query or len(query) < 15:
                continue

            # hybrid search across ALL base
            related = asyncio_run(search.search_async(query, k=cfg.k_related, document_ids=None))

            for r in related:
                rid = getattr(r, "id", None)
                if not rid:
                    continue

                fragment_links[str(f.id)].add(str(rid))

                r_doc = r.metadata.get("source")
                if not r_doc:
                    continue
                r_doc = str(r_doc)

                if cfg.skip_same_document and r_doc == doc_id:
                    continue

                document_links[doc_id].add(r_doc)

        

    # serialize sets -> lists
    return {
        "document_links": {k: sorted(list(v)) for k, v in document_links.items()},
        "fragment_links": {k: sorted(list(v)) for k, v in fragment_links.items()},
        "doc_identifiers": {k: sorted(list(v)) for k, v in doc_identifiers.items()},
    }


# --------- minimal async bridge (since build_reference_indexes is sync) ---------

import asyncio

def asyncio_run(coro):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # running inside async context (rare for offline builder) -> create new loop task
            return asyncio.get_event_loop().run_until_complete(coro)  # may fail if loop running
        return loop.run_until_complete(coro)
    except RuntimeError:
        # no event loop
        return asyncio.run(coro)


def save_graph_index(payload: Dict[str, object], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
