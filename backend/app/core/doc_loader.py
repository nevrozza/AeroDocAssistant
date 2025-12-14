from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_core.documents.base import Document
from pathlib import Path
import re
from dataclasses import dataclass
import json

from app.core.doc_manager import DocumentMetadata


class PDFLoader:

    def __init__(self):
        pass

    @staticmethod
    def __normalize_text(text: str) -> str:
        # переносы слов через дефис, когда перенос на новую строку
        text = re.sub(r"(\S+)-\s*\n\s*(\S+)", r"\1\2", text)

        # переносы строк внутри абзацев
        text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)

        # пустые строки
        text = re.sub(r"\n{2,}", "\n\n", text)

        return text.strip()

    @staticmethod
    def __split_by_gost_sections(text: str) -> list[str]:
        parts = re.split(r"\n(?=\d+(\.\d+)+\s)", text)
        return [p.strip() for p in parts if p.strip()]

    @staticmethod
    def __merge_fragments(docs: list[Document]) -> list[Document]:
        if not docs:
            return []

        merged = []
        buffer = docs[0]

        for doc in docs[1:]:
            prev_text = buffer.page_content.strip()
            curr_text = doc.page_content.strip()

            if prev_text.endswith("-"):
                buffer.page_content = prev_text[:-1] + curr_text
                buffer.metadata["source_element_ids"].extend(doc.metadata["source_element_ids"])

            elif prev_text and curr_text and curr_text[0].islower():
                buffer.page_content = prev_text + " " + curr_text
                buffer.metadata["source_element_ids"].extend(doc.metadata["source_element_ids"])
            else:
                merged.append(buffer)
                buffer = doc

        merged.append(buffer)
        return merged

    @staticmethod
    def __merge_short_fragments(docs: list[Document], max_len=400) -> list[Document]:
        if not docs:
            return []

        merged = []
        buffer = docs[0]

        for doc in docs[1:]:
            text = doc.page_content.strip()
            if not text:
                continue

            new_len = len(buffer.page_content) + len(text)
            if new_len < max_len:
                buffer.page_content += " " + text
                buffer.metadata["source_element_ids"].extend(doc.metadata["source_element_ids"])
            else:
                merged.append(buffer)
                buffer = doc

        merged.append(buffer)
        return merged

    def load(self, file: Path, metadata: DocumentMetadata) -> list[Document]:
        loader = UnstructuredPDFLoader(
            file,
            mode="elements",
            strategy="fast",
            chunking_strategy="by_title",
        )
        docs = loader.load()

        result = []
        for doc in docs:
            text = self.__normalize_text(doc.page_content)
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

            for p in paragraphs:
                for sec in self.__split_by_gost_sections(p):
                    result.append(Document(page_content=sec, metadata={
                        "source_page_number": doc.metadata["page_number"],
                        "source_element_ids": [doc.metadata["element_id"]]
                    }))

        result = self.__merge_fragments(result)
        result = self.__merge_short_fragments(result)

        for i in range(len(result)):
            result[i].metadata.update({
                "source": str(metadata.doc_id),
                "fragment_id": i,
                "source_element_ids": json.dumps(list(set(result[i].metadata["source_element_ids"])))
            })

        return result
