# IntelliDoc-Lite-A-Generative-AI-Legal-Document-Analyzer
🧠 Generative AI Legal Document Analyzer | FastAPI + Streamlit + ChromaDB + LLMs for automated legal compliance checks

# 🧾 IntelliDoc Lite — Gen AI Legal Document Analyzer

> ⚖️ **AI-powered legal document analyzer** that combines Generative AI, rule-based logic, and vector search to perform intelligent legal compliance checks.

---

## 🚀 Overview
**IntelliDoc Lite** is a Generative AI–driven platform that analyzes and validates legal documents using **LLMs** and **vector databases**.  
It automates clause extraction, risk detection, and compliance verification — offering instant, explainable insights for legal and financial workflows.

---

## 🧠 Core Features
- 🪶 **LLM-based clause extraction** and contextual validation  
- 📑 **Rule-based legal compliance engine** using customizable JSON rules  
- 🔍 **Semantic retrieval** via **ChromaDB vector database**  
- ⚙️ **FastAPI backend** for document parsing and inference endpoints  
- 🧰 **Streamlit UI** for intuitive, interactive user experience  
- 🧾 **Multi-document support** for batch analysis and reporting  
- 🔒 Modular **LLM layer** supporting both **OpenAI** and **local models (Llama 3 7B via Ollama)**  

---

## 🧩 Architecture

![Architecture](docs/architecture.png)

### 🧱 Model Stack
| Component | Description |
|------------|-------------|
| **LLM Backbone** | Meta **Llama 3 (7B)** integrated locally via **Ollama** for document reasoning |
| **Vector Store** | **ChromaDB** for semantic embedding-based retrieval |
| **API Layer** | **FastAPI** handles file parsing, model inference, and rule validation |
| **Frontend** | **Streamlit** UI for interactive clause analysis and visualization |
| **Persistence** | Local or Dockerized setup for reproducible deployment |

## 🧠 Tech Stack

### 🧩 Backend
- **Framework:** FastAPI — high-performance async web framework for APIs  
- **Server:** Uvicorn (ASGI server with hot-reload)  
- **Language:** Python 3.11  
- **Middleware:** `python-multipart` for file uploads  
- **Document Parsing:** `pdf2image`, `pytesseract`, `Pillow` for OCR and image processing  
- **Report Generation:** `reportlab` for creating analysis PDFs  

---

### 🧠 LLM & AI Layer
- **LangChain Core:** `langchain`, `langchain-community`, `langchain-ollama`  
  - Enables prompt chaining, retrieval-augmented generation (RAG), and multi-model pipelines  
- **Model Engines:**  
  - **Llama 3 (7B)** via **Ollama** — for local legal reasoning  
  - Optional: **OpenAI GPT models** (configurable through `.env`)  
- **Embeddings:** `sentence-transformers` & `transformers` for text embeddings  
- **ML Backend:** `torch` (PyTorch) for deep learning inference  

---

### 🧮 Vector Database & Semantic Search
- **Vector Store:** `ChromaDB` — efficient similarity search for document embeddings  
- **Usage:** Semantic retrieval for clause-level matching and compliance context  

---

### 💻 Frontend
- **Framework:** Streamlit — intuitive, lightweight UI for LLM output visualization  
- **Integration:** Direct API calls to FastAPI backend for real-time inference  

---

## ⚙️ Setup & Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/IntelliDoc_Lite.git
cd IntelliDoc_Lite

# 2️⃣ Create a virtual environment
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows

# 3️⃣ Install dependencies
pip install -r requirements.txt

# 4️⃣ Start the FastAPI backend
uvicorn app.routes.main:app --reload

# 5️⃣ Launch the Streamlit UI
streamlit run ui/streamlit_app.py

