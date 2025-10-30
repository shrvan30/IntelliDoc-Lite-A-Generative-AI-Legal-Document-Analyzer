# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, query, compare, admin, legal_check  # include new router

app = FastAPI(title="IntelliDoc Lite", version="1.0")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(query.router, prefix="/query", tags=["Query"])
app.include_router(compare.router, prefix="/compare", tags=["Compare"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(legal_check.router, prefix="/legal", tags=["Legal"])  # new

@app.get("/")
async def root():
    return {"message": "IntelliDoc Lite backend is running"}
