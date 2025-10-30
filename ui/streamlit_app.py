import streamlit as st
import requests

API = "http://localhost:8000"

st.title("⚖️ IntelliDoc Lite — Local Document Assistant")

tab = st.sidebar.radio("Section", ["Upload", "Ask", "Legal Check", "Compare"])

# ----------------------------- UPLOAD TAB -----------------------------
if tab == "Upload":
    uploaded_file = st.file_uploader("📄 Upload PDF Document", type=["pdf"])
    if uploaded_file and st.button("📤 Index Document"):
        files = {"file": (uploaded_file.name, uploaded_file.getvalue(), "application/pdf")}
        with st.spinner("Uploading and indexing..."):
            r = requests.post(f"{API}/upload", files=files)
        st.success("✅ Upload complete!")
        st.json(r.json())

# ----------------------------- ASK TAB -----------------------------
if tab == "Ask":
    st.subheader("💬 Ask a Question about Indexed Documents")

    # User input
    q = st.text_input("Enter your question:")
    k = st.slider("Number of chunks to retrieve", 1, 6, 3)

    # Optional filter by document name or ID
    source_filter = st.text_input("Filter by document name (optional)", placeholder="e.g., contract_1.pdf")

    if st.button("🔍 Ask"):
        if not q.strip():
            st.warning("Please enter a question.")
        else:
            with st.spinner("Thinking..."):
                payload = {
                    "question": q,
                    "k": k,
                    "source_filter": source_filter.strip() if source_filter else None
                }
                r = requests.post(f"{API}/query/ask", json=payload)


            # Display response
            if r.status_code == 200:
                st.json(r.json())
            else:
                st.error(f"Error {r.status_code}: {r.text}")


# ----------------------------- LEGAL CHECK TAB -----------------------------
if tab == "Legal Check":
    st.subheader("📑 Run Document-Type Specific Legal Compliance Check")

    doc_type = st.selectbox(
        "Select Document Type",
        [
            "loan_agreement",
            "credit_card_agreement",
            "mortgage_deed",
            "promissory_note",
            "bank_terms",
            "msa",
            "nda",
            "consultancy_agreement",
            "employment_contract",
            "shareholder_agreement"
        ]
    )

    uploaded_file = st.file_uploader("Upload a Legal Document", type=["pdf"])

    if uploaded_file and st.button("⚖️ Run Legal Check"):
        files = {"file": (uploaded_file.name, uploaded_file.getvalue(), "application/pdf")}
        data = {"document_type": doc_type}

        with st.spinner(f"Analyzing {doc_type.replace('_', ' ').title()}..."):
            r = requests.post(f"{API}/legal", data=data, files=files)

        if r.status_code == 200:
            result = r.json()
            st.success("✅ Legal check completed successfully!")

            if "legal_check" in result:
                results = result["legal_check"]["results"]
                for clause, info in results.items():
                    with st.expander(f"📘 {clause.replace('_', ' ').title()}"):
                        st.write(f"**Status:** {info['status'].capitalize()}")
                        if info.get("summary"):
                            st.write(f"**Summary:** {info['summary']}")
                        if info.get("recommendation"):
                            st.write(f"**Recommendation:** {info['recommendation']}")
            else:
                st.warning("No structured results returned. Check backend output.")
        else:
            st.error(f"❌ Error: {r.status_code}")
            st.text(r.text)

# ----------------------------- COMPARE TAB -----------------------------
if tab == "Compare":
    st.info("Use `/compare` API endpoint directly or integrate here later.")
