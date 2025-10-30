from app.core.vectorstore import load_existing_chroma
from app.core.embeddings import get_embedding_model


def list_sources(persist_dir: str = "chroma_db"):
    """
    List all unique document sources indexed in the Chroma vectorstore.
    """
    embedding_model = get_embedding_model()
    db = load_existing_chroma(persist_dir, embedding_model)

    # ✅ Safely access Chroma collection
    try:
        collection = db._collection.get(include=["metadatas"])
    except AttributeError:
        # Fallback for future API versions
        collection = db.get(include=["metadatas"])

    sources = set()
    for meta in collection.get("metadatas", []):
        if meta and "source" in meta:
            sources.add(meta["source"])

    if sources:
        print("📄 Indexed sources:\n" + "\n".join(sorted(sources)))
    else:
        print("⚠️ No sources found in the Chroma database.")


if __name__ == "__main__":
    list_sources()

