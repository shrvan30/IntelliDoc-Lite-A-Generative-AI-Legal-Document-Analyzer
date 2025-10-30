from app.core.parser import parse_pdf

def test_parse_pdf():
    docs = parse_pdf("ui/assets/sample.pdf")
    assert isinstance(docs, list)
    assert len(docs) > 0
    assert hasattr(docs[0], "page_content")
