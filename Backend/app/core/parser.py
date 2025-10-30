# backend/app/core/parser.py
import io
import logging
import os
import tempfile
from typing import List

from langchain_core.documents import Document


# Optional dependencies
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None

try:
    from PIL import Image
    import pytesseract
except ImportError:
    Image = None
    pytesseract = None

LOG = logging.getLogger("intellidoc.parser")


def load_pdf_bytes(file_bytes: bytes, ocr_if_needed: bool = True) -> List[Document]:
    """
    Load PDF from bytes:
    1. Try PyMuPDF for text extraction.
    2. If PyMuPDF fails, fallback to PyPDF2.
    3. If still empty and ocr_if_needed=True, run OCR via pytesseract.
    """
    # --- PyMuPDF first ---
    if fitz:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text("text") or ""
            doc.close()
            if text.strip():
                return [Document(page_content=text, metadata={"source": "pymupdf"})]
            LOG.debug("PyMuPDF returned empty text, trying fallback.")
        except Exception as e:
            LOG.debug("PyMuPDF failed: %s", e, exc_info=True)

    # --- PyPDF2 fallback ---
    if PdfReader:
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            if text.strip():
                return [Document(page_content=text, metadata={"source": "pypdf2"})]
            LOG.debug("PyPDF2 returned empty text, trying OCR if enabled.")
        except Exception as e:
            LOG.debug("PyPDF2 failed: %s", e, exc_info=True)

    # --- OCR fallback ---
    if ocr_if_needed and Image and pytesseract:
        try:
            from pdf2image import convert_from_bytes
            images = convert_from_bytes(file_bytes)
            text_pieces = [pytesseract.image_to_string(img) for img in images]
            text = "\n\n".join(text_pieces).strip()
            if text:
                return [Document(page_content=text, metadata={"source": "ocr"})]
        except Exception as e:
            LOG.exception("OCR fallback failed")
            raise ValueError(f"OCR fallback failed: {e}")

    raise ValueError("Could not parse PDF: PyMuPDF/PyPDF2 failed and OCR disabled or failed.")


def parse_pdf(path: str, ocr_if_needed: bool = True):
    with open(path, "rb") as f:
        return load_pdf_bytes(f.read(), ocr_if_needed=ocr_if_needed)
