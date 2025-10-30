import os
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.core.embeddings import get_embedding_model


def create_or_load_chroma(chunks: list, embedding_model=None, persist_dir: str = "chroma_db"):
    """
    Create or load a Chroma vectorstore from a list of Document objects.
    Works with your current langchain-chroma version (auto persistence).
    """
    os.makedirs(persist_dir, exist_ok=True)

    if embedding_model is None:
        embedding_model = get_embedding_model()

    # ✅ Use 'embedding' for from_documents (not 'embedding_function')
    # ✅ No need to call db.persist(), Chroma auto-persists
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=persist_dir,
    )

    return db


def load_existing_chroma(persist_dir: str = "chroma_db", embedding_model=None):
    """
    Load a persisted Chroma DB using the same embedding model.
    """
    if embedding_model is None:
        embedding_model = get_embedding_model()

    # ✅ Use 'embedding_function' for the direct constructor
    return Chroma(
        persist_directory=persist_dir,
        embedding_function=embedding_model,
    )
