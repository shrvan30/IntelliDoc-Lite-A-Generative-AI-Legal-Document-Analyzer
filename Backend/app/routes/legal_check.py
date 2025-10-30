from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from app.core.parser import load_pdf_bytes
from app.core.legal_check import run_rule_check
from app.core.vectorstore import create_or_load_chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

import logging

LOG = logging.getLogger("intellidoc.legal_check")
router = APIRouter()


@router.post("/")
async def legal_check_route(
    document_type: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # 1️⃣ Read PDF bytes
        content = await file.read()

        # 2️⃣ Extract text (OCR if needed)
        docs = load_pdf_bytes(content, ocr_if_needed=True)
        full_text = "\n\n".join([d.page_content for d in docs])

        # 3️⃣ Run rule-based check (fast feedback)
        rule_results = run_rule_check(full_text, document_type)

        # 4️⃣ Split text into chunks for vectorstore
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        chunks = splitter.split_text(full_text)
        doc_chunks = [Document(page_content=c, metadata={"source": file.filename}) for c in chunks]

        # 5️⃣ Save chunks to Chroma vectorstore
        create_or_load_chroma(doc_chunks)

        return {
            "status": "ok",
            "document_type": document_type,
            "legal_check": rule_results
        }

    except Exception as e:
        LOG.exception("Legal check failed")
        raise HTTPException(status_code=500, detail=str(e))
