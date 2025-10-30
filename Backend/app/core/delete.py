# app/core/delete.py
from app.core.vectorstore import load_existing_chroma, create_or_load_chroma
from langchain_core.documents import Document
import shutil, os

VECTORSTORE_DIR = "chroma_db"
FILE_TO_DELETE = "Signed Offer letter_Ola Electric.pdf"

# Load existing Chroma
vectorstore = load_existing_chroma(persist_dir=VECTORSTORE_DIR)

# Get all documents except the one to delete
all_docs = []
collection_data = vectorstore._collection.get()
for metadata in collection_data["metadatas"]:
    if metadata.get("source") != FILE_TO_DELETE:
        # Recreate Document object (keep metadata; content can be empty)
        all_docs.append(Document(page_content="", metadata=metadata))

# Delete the entire Chroma folder
shutil.rmtree(VECTORSTORE_DIR, ignore_errors=True)
os.makedirs(VECTORSTORE_DIR, exist_ok=True)

# Recreate Chroma without the deleted file
create_or_load_chroma(all_docs, persist_dir=VECTORSTORE_DIR)

print(f"Deleted embeddings for '{FILE_TO_DELETE}' from Chroma vectorstore.")
