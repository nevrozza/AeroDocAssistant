from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_core.documents.base import Document
from pathlib import Path
import re

from app.core.doc_manager import DocumentMetadata


class PDFLoader:

    def __init__(self):
        pass

    @staticmethod
    def __normalize_text(text: str) -> str:
        # склеиваем переносы слов через дефис, когда перенос на новую строку
        text = re.sub(r"(\S+)-\s*\n\s*(\S+)", r"\1\2", text)

        # склеиваем переносы строк внутри абзацев (кроме пустых)
        text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)

        # нормализуем пустые строки
        text = re.sub(r"\n{2,}", "\n\n", text)

        return text.strip()

    @staticmethod
    def __split_by_gost_sections(text: str) -> list[str]:
        parts = re.split(r"\n(?=\d+(\.\d+)+\s)", text)
        return [p.strip() for p in parts if p.strip()]

    @staticmethod
    def __merge_paragraphs_and_lists(docs: list[Document]) -> list[Document]:
        merged = []
        buffer = None
        pattern = re.compile(r"^\s*(−|-|•|–|\*|\d+[.)])\s+")

        for doc in docs:
            text = doc.page_content.strip()

            # если это элемент списка
            is_list_item = bool(pattern.match(text))

            if buffer is None:
                buffer = doc
                continue

            prev_text = buffer.page_content.strip()

            # условие склейки
            if prev_text.endswith(":") and is_list_item:
                buffer.page_content += "\n" + text
            else:
                merged.append(buffer)
                buffer = doc

        if buffer:
            merged.append(buffer)

        return merged

    @staticmethod
    def __merge_fragments(docs: list[Document]) -> list[Document]:
        if not docs:
            return []

        merged = []
        buffer = docs[0]

        for doc in docs[1:]:
            prev_text = buffer.page_content.strip()
            curr_text = doc.page_content.strip()

            # если предыдущий фрагмент заканчивается дефисом → склеиваем
            if prev_text.endswith("-"):
                buffer.page_content = prev_text[:-1] + curr_text
            # если предыдущий фрагмент не пустой и текущий начинается с маленькой буквы
            # можно считать, что это продолжение абзаца
            elif prev_text and curr_text and curr_text[0].islower():
                buffer.page_content = prev_text + " " + curr_text
            else:
                merged.append(buffer)
                buffer = doc

        merged.append(buffer)
        return merged

    @staticmethod
    def __merge_short_fragments(docs: list[Document], max_len=300) -> list[Document]:
        if not docs:
            return []

        merged = []
        buffer_text = ""
        buffer_meta = {"source": None, "fragment_id": 0}
        frag_id = 0

        for doc in docs:
            text = doc.page_content.strip()
            if not text:
                continue

            # склеиваем текст в буфер
            if buffer_text:
                buffer_text += " " + text
            else:
                buffer_text = text
                buffer_meta["source"] = doc.metadata.get("source")

            # если достигли max_len, фиксируем фрагмент
            if len(buffer_text) >= max_len:
                merged.append(Document(
                    page_content=buffer_text,
                    metadata={
                        "source": buffer_meta["source"],
                        "fragment_id": frag_id
                    }
                ))
                frag_id += 1
                buffer_text = ""

        # добавляем остаток, если есть
        if buffer_text:
            merged.append(Document(
                page_content=buffer_text,
                metadata={
                    "source": buffer_meta["source"],
                    "fragment_id": frag_id
                }
            ))

        return merged

    def load(self, file: Path, metadata: DocumentMetadata) -> list[Document]:
        loader = UnstructuredPDFLoader(
            file,
            strategy="fast",
            chunking_strategy="by_title",
        )
        docs = loader.load()

        result = []
        sections = []
        for doc in docs:
            text = self.__normalize_text(doc.page_content)
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

            for p in paragraphs:
                sections.extend(self.__split_by_gost_sections(p))

        for section in sections:
            result.append(Document(page_content=section))

        result = self.__merge_paragraphs_and_lists(result)
        result = self.__merge_fragments(result)
        result = self.__merge_short_fragments(result)

        for i in range(len(result)):
            result[i].metadata = {
                "source": metadata.doc_id,
                "fragment_id": i
            }

        return result
