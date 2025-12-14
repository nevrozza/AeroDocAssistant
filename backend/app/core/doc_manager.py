from pathlib import Path
from typing import Generator
from pydantic import BaseModel, UUID4
from uuid import uuid4, UUID
import traceback
import json


class DocumentMetadata(BaseModel):
    doc_id: UUID4
    filepath: Path


class _IndexSchema(BaseModel):
    documents: list[DocumentMetadata]


class DocumentManager:

    __directory: Path
    __documents: dict[str, DocumentMetadata]

    def __init__(self, directory: Path):
        if not directory.exists():
            directory.mkdir()

        if not directory.is_dir():
            raise RuntimeError(f"{directory} is not a directory")

        self.__directory = directory
        self.__documents = {}

    def list(self) -> Generator[DocumentMetadata]:
        yield from self.__documents.values()

    def get_by_id(self, doc_id: str) -> DocumentMetadata | None:
        return self.__documents.get(doc_id)

    def get_abs_path(self, loca_path: Path) -> Path:
        return self.__directory.joinpath(loca_path).resolve()

    def load(self):
        try:
            self.__load_index()
        except Exception as e:
            if isinstance(e, FileNotFoundError):
                print("Failed to find index. Creating...")
            else:
                traceback.print_exc()
                print("Failed to load document index. Rebuilding...")

            self.update_index()

    def __load_index(self):
        index_path = self.__directory / 'index.json'
        if not index_path.is_file():
            raise FileNotFoundError

        with open(index_path, 'r') as f:
            raw = f.read()

        validated = _IndexSchema.model_validate_json(raw)
        for doc in validated.documents:
            self.__documents[doc.doc_id] = doc

    def update_index(self):
        self.__documents.clear()

        patterns = ("*.pdf", "*.docx", "*.doc")
        files = [path for pat in patterns for path in self.__directory.rglob(pat)]
        for path in files:
            rel_path = path.relative_to(self.__directory)

            doc = DocumentMetadata(doc_id=uuid4().hex, filepath=rel_path)
            self.__documents[doc.doc_id] = doc

        print(f"Indexed {len(self.__documents)} documents")

        self.__save_index()

    def __save_index(self):
        index_path = self.__directory / 'index.json'
        index = _IndexSchema(documents=self.__documents.values())
        with open(index_path, 'w') as f:
            json.dump(index.model_dump(mode="json"), f)
