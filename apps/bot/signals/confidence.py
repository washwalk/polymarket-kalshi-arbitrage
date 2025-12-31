def confidence_score(age_seconds: int) -> float:
    return min(1.0, age_seconds / 10.0)