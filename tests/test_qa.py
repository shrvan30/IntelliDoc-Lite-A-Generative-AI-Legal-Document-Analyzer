from app.core.llm_client import ask_llm

def test_qa():
    response = ask_llm("Summarize: Artificial Intelligence in one line.")
    assert "intelligence" in response.lower()
