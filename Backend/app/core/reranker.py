from sentence_transformers import CrossEncoder
from langchain_core.documents import Document

# Lightweight reranker using cross-encoder
model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank(docs, question, top_k=3):
    """
    Re-rank a list of documents (Document objects or strings) by relevance to a question.

    Args:
        docs (list): List of Document objects or plain text strings.
        question (str): The query string.
        top_k (int): Number of top documents to return.

    Returns:
        List[Document]: Top-k reranked Document objects.
    """
    # Ensure all docs are Document objects
    docs = [d if isinstance(d, Document) else Document(page_content=d) for d in docs]

    # Prepare input pairs for CrossEncoder scoring
    pairs = [(question, d.page_content) for d in docs]

    # Get relevance scores
    scores = model.predict(pairs)

    # Rank documents by score (descending)
    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)

    # Return top-k Document objects
    return [d for d, _ in ranked[:top_k]]
