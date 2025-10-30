from fastapi import APIRouter
import os, shutil

router = APIRouter()

@router.get("/status")
async def system_status():
    """Basic system status"""
    return {
        "status": "running",
        "indexed_docs": len(os.listdir("chroma_db")) if os.path.exists("chroma_db") else 0
    }

@router.delete("/clear")
async def clear_database():
    """Delete Chromachroma_chroma_db and cached embeddings"""
    if os.path.exists("chroma_db"):
        shutil.rmtree("chroma_db")
    os.makedirs("chroma_db", exist_ok=True)
    return {"status": "database cleared"}

@router.get("/docs")
async def list_docs():
    """List uploaded documents"""
    if not os.path.exists("uploads"):
        return {"documents": []}
    return {"documents": os.listdir("uploads")}
