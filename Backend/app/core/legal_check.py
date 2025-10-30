import json
import re
from pathlib import Path
from langchain_core.documents import Document
from .llm_client import ask_llm as query_llm
from .vectorstore import create_or_load_chroma, get_embedding_model

# -----------------------------
# Global Constants
# -----------------------------
RULES_PATH = Path(__file__).parent / "rules"


# -----------------------------
# Step 1: Load Rules
# -----------------------------
def load_rules(document_type: str):
    """
    Loads the JSON rule file for a given document type.
    """
    rule_file = RULES_PATH / f"{document_type}.json"
    if not rule_file.exists():
        raise FileNotFoundError(f"No rules found for document type: {document_type}")
    with open(rule_file, "r", encoding="utf-8") as f:
        return json.load(f)


# -----------------------------
# Step 2: Clause Value Extraction (generalized)
# -----------------------------
def extract_values(clause_name: str, text: str) -> str:
    """
    Extract actual clause values for any document type using semantic regex heuristics.
    Supports loan, NDA, employment, consultancy, and MSA document types.
    """
    text_lower = text.lower()

    # ---- Financial / Loan Documents ----
    if clause_name in {"interest_rate", "apr"}:
        match = re.search(r"(\d{1,2}\.\d{1,2}%|\d{1,2}%)(\s*(p\.?a\.?|per annum)?)", text_lower)
        return match.group(0) if match else "N/A"

    elif clause_name in {"repayment", "tenure", "installment"}:
        months = re.findall(r"(\d{1,3}\s*months?)", text_lower)
        emis = re.findall(r"inr\s?[\d,]+", text_lower)
        return ", ".join(months + emis) if (months or emis) else "N/A"

    elif clause_name in {"loan_amount", "principal_amount"}:
        match = re.search(r"inr\s?[\d,]+", text_lower)
        return match.group(0) if match else "N/A"

    elif clause_name in {"collateral", "security"}:
        if "security" in text_lower and "na" in text_lower:
            return "No collateral required"
        if any(x in text_lower for x in ["mortgage", "pledge", "guarantee", "lien"]):
            return "Collateral/security clause mentioned"
        return "N/A"

    elif clause_name in {"default", "termination"}:
        if any(x in text_lower for x in ["default", "non-payment", "breach", "terminate", "repayable on demand"]):
            return "Default or termination conditions mentioned"
        return "N/A"

    # ---- Contractual / Corporate Documents ----
    elif clause_name in {"confidentiality", "confidential_information"}:
        if any(x in text_lower for x in ["confidential", "non-disclosure", "proprietary"]):
            return "Confidentiality clause present"
        return "N/A"

    elif clause_name in {"payment_terms", "fees"}:
        if any(x in text_lower for x in ["payment", "invoice", "fees", "charges", "compensation"]):
            return "Payment terms mentioned"
        return "N/A"

    elif clause_name in {"intellectual_property", "ip"}:
        if any(x in text_lower for x in ["intellectual property", "copyright", "ownership"]):
            return "IP ownership clause found"
        return "N/A"

    elif clause_name in {"scope_of_work", "services"}:
        if "scope" in text_lower or "services" in text_lower:
            return "Scope/services clause found"
        return "N/A"

    elif clause_name in {"governing_law", "jurisdiction"}:
        match = re.search(r"(jurisdiction|court of|governing law)[^.\n]+", text_lower)
        return match.group(0) if match else "Missing"

    elif clause_name in {"liability", "indemnity"}:
        if any(x in text_lower for x in ["liability", "indemnify", "damages", "loss"]):
            return "Liability/indemnity clause present"
        return "N/A"

    return "N/A"


# -----------------------------
# Step 3: Rule-based Clause Check
# -----------------------------
def keyword_check(text: str, clause_rules: dict):
    """
    Performs keyword-based clause presence detection + value extraction.
    """
    results = {}
    for clause, info in clause_rules.items():
        found = any(kw.lower() in text.lower() for kw in info["keywords"])
        if found:
            value = extract_values(clause, text)
            results[clause] = {
                "status": "found",
                "value": value,
                "summary": info["description"],
                "recommendation": f"'{clause}' clause appears to be covered."
            }
        else:
            results[clause] = {
                "status": "missing",
                "value": None,
                "summary": info["description"],
                "recommendation": f"'{clause}' clause appears to be missing."
            }
    return results


def run_rule_check(text: str, document_type: str):
    """
    Perform rule-based keyword & regex value extraction for any document type.
    """
    rules = load_rules(document_type)
    keyword_results = keyword_check(text, rules["clauses"])
    return {"document_type": document_type, "results": keyword_results}


# -----------------------------
# Step 4: Save Document to Vectorstore
# -----------------------------
def save_document_to_vectorstore(file_name: str, text: str):
    """
    Stores document text & metadata into Chroma vectorstore.
    """
    doc = Document(page_content=text, metadata={"source": file_name})
    embedding_model = get_embedding_model()
    db = create_or_load_chroma([doc], embedding_model=embedding_model)
    return db


# -----------------------------
# Step 5: Query Document with LLM
# -----------------------------
def query_document(db, user_query: str):
    """
    Hybrid retrieval: vectorstore context + LLM-based response generation.
    """
    docs = db.similarity_search(user_query, k=3)
    context = "\n\n".join([d.page_content for d in docs])

    prompt = (
        "You are a legal document assistant.\n"
        "Answer the question strictly using the provided document context.\n\n"
        f"Context:\n{context}\n\nQuestion: {user_query}"
    )

    response = query_llm(prompt)
    if isinstance(response, str):
        response = {"answer": response}
    return response
