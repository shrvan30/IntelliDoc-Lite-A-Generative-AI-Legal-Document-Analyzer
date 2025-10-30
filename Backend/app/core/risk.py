# risk.py
def score_risk(missing_clauses, severity_map=None):
    # severity_map is optional dict mapping clause->weight
    if severity_map is None:
        severity_map = {"termination": 3, "liability": 5, "confidentiality": 4, "jurisdiction":2}
    score = 0
    for m in missing_clauses:
        score += severity_map.get(m, 1)
    # map to 1-10 scale (higher means more risky)
    max_possible = sum(severity_map.values())
    scaled = int((score / max_possible) * 10)
    return min(max(scaled,1),10)
