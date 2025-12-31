def poly_price_to_prob(cents: int) -> float:
    return cents / 100.0

def kalshi_price_to_prob(price: float) -> float:
    return price