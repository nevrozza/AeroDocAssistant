from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import UUID4

from app.core.container import Container


router = APIRouter(prefix="/document")


@router.get("/{doc_id}", response_class=FileResponse)
async def download_doc_file(doc_id: UUID4) -> FileResponse:
    doc = Container.doc_manager.get_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {doc_id} not found")

    path = Container.doc_manager.get_abs_path(doc.filepath)
    return FileResponse(
        path,
        media_type="application/pdf",
        filename=f"{doc.doc_id}.pdf"
    )