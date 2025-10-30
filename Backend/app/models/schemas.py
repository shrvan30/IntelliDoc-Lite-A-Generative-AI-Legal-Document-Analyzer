from pydantic import BaseModel
from typing import List, Optional

class UploadResponse(BaseModel):
    status: str
    filename: str

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    context: List[str]

class CompareRequest(BaseModel):
    doc1: str
    doc2: str
    query: Optional[str] = None

class CompareResponse(BaseModel):
    difference_summary: str

class LegalCheckResponse(BaseModel):
    found: List[str]
    missing: List[str]
    suggestions: List[str]

class RiskScoreResponse(BaseModel):
    score: float
    rationale: str
