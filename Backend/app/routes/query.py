from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ..core.llm_client import run_qa
from ..core.vectorstore import load_existing_chroma
from ..core.reranker import rerank
from langchain_core.documents import Document
import logging

LOG = logging.getLogger("intellidoc.query")
router = APIRouter()


class QARequest(BaseModel):
    question: str
    k: int = 3
    source_filter: Optional[str] = None  # Allows querying only from a specific PDF


@router.post("/ask")
def ask(req: QARequest):
    """
    Handles question-answering over document embeddings.
    Optionally restricts to a single PDF using 'source_filter'.
    """
    try:
        # Load existing Chroma vector DB
        db = load_existing_chroma("chroma_db")

        # Create retriever with top-k results
        retriever = db.as_retriever(search_kwargs={"k": req.k})

        # Apply document filter if provided
        if req.source_filter:
            retriever.search_kwargs["filter"] = {"source": req.source_filter}

        # Retrieve relevant document chunks
        docs = retriever.invoke(req.question)

        if not docs:
            return {"answer": "No relevant information found in the selected document.",
                    "sources": []}

        # Ensure all docs are Document objects
        docs = [d if isinstance(d, Document) else Document(page_content=d) for d in docs]

        # Rerank Document objects
        reranked_docs = rerank(docs, req.question)

        # Extract text strings for LLM
        reranked_contexts = [d.page_content for d in reranked_docs]

        # Run question-answering LLM
        answer = run_qa(reranked_contexts, req.question)

        # Collect metadata (source info)
        sources = [d.metadata for d in reranked_docs]

        return {"answer": answer, "sources": sources}

    except Exception as e:
        LOG.exception("Query failed")
        raise HTTPException(status_code=500, detail=str(e))
