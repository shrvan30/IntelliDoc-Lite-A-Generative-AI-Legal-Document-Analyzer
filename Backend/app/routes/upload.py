from fastapi import APIRouter, File, UploadFile
from ..core.parser import load_pdf_bytes
from ..core.chunker import chunk_documents
from ..core.embeddings import get_embedding_model
from ..core.vectorstore import create_or_load_chroma
import traceback

router = APIRouter()

@router.post("/")
async def upload_doc(file: UploadFile = File(...)):
    try:
        content = await file.read()

        docs = load_pdf_bytes(content, ocr_if_needed=True)
        if not docs:
            return {"status": "error", "detail": "No text extracted from PDF"}

        for d in docs:
            d.metadata["source"] = file.filename
        chunks = chunk_documents(docs)
        for c in chunks:
            c.metadata["source"] = file.filename
        embed_model = get_embedding_model()
        db = create_or_load_chroma(chunks, embed_model, persist_dir="chroma_db")

        return {"status": "ok", "num_chunks": len(chunks)}

    except Exception as e:
        return {
            "status": "error",
            "detail": str(e),
            "traceback": traceback.format_exc()
        }
