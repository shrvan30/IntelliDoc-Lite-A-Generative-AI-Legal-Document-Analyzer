# backend/app/core/llm_client.py
import logging
from langchain_ollama import OllamaLLM  # keep if you use Ollama
from typing import List

LOG = logging.getLogger("intellidoc.llm")

llm = OllamaLLM(model="llama3:8b", temperature=0.0)  # adjust as needed

QA_PROMPT = """
You are a contract analysis assistant. You must base your answer only on the context provided below.

If the context does not contain an answer, respond with:
"Not enough information found in the given document."

Context (from the document):
{context}

Question:
{question}

Give a concise, factual answer using only relevant text from the context.
Always include the document name and chunk number (e.g., [Shravan.pdf, chunk 2]).
"""


def _llm_call(prompt: str) -> str:
    """
    Unified llm call: support .predict(), .generate(), or callable llm.
    """
    try:
        if hasattr(llm, "predict"):
            return llm.predict(prompt)
        if hasattr(llm, "generate"):
            gen = llm.generate([prompt])
            # Retrieval depends on LLM object; try to extract text
            try:
                # langchain LLMResult -> .generations[0][0].text
                return gen.generations[0][0].text
            except Exception:
                return str(gen)
        # fallback: try direct call
        return llm(prompt)
    except Exception as e:
        LOG.exception("LLM call failed")
        raise

def run_qa(context_texts: List[str], question: str) -> str:
    context = "\n\n---\n\n".join(context_texts)
    prompt = QA_PROMPT.format(context=context, question=question)
    return _llm_call(prompt)

def ask_llm(prompt: str):
    return _llm_call(prompt)
