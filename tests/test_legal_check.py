from Backend.app.core.legal_check import run_legal_check

def test_loan_agreement_check():
    sample_text = """
    This Loan Agreement is made between ABC Bank and John Doe. 
    The interest rate is fixed at 9.5% per annum and payments are due monthly.
    """
    result = run_legal_check(sample_text, "loan_agreement")
    print(result)
