from thefuzz import fuzz

def match_score(poly_title, kalshi_title):
    return fuzz.token_set_ratio(poly_title, kalshi_title)

def is_match(poly, kalshi, threshold=85):
    score = match_score(poly["title"], kalshi["title"])
    return score >= threshold