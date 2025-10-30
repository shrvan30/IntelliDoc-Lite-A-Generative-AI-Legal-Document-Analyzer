# backend/app/routes/compare.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..core.llm_client import _llm_call  # or use run_qa with custom prompt
import logging

LOG = logging.getLogger("intellidoc.compare")
router = APIRouter()

class CompareRequest(BaseModel):
    doc1_text: str
    doc2_text: str

@router.post("/compare")
def compare(req: CompareRequest):
    prompt = f"Compare and list differing clauses between doc1 and doc2.\n\nDoc1:\n{req.doc1_text}\n\nDoc2:\n{req.doc2_text}\n\nProvide a concise bullet list of differences."
    try:
        resp = _llm_call(prompt)
        return {"comparison": resp}
    except Exception as e:
        LOG.exception("Compare failed")
        raise HTTPException(status_code=500, detail=str(e))
