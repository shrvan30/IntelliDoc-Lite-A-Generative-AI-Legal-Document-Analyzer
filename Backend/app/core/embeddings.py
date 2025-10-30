# backend/app/core/embeddings.py
from langchain_community.embeddings import HuggingFaceEmbeddings


def get_embedding_model(model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
    """
    Return a HuggingFaceEmbeddings instance (works locally with sentence-transformers).
    """
    return HuggingFaceEmbeddings(model_name=model_name)
