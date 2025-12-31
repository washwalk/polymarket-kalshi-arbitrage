def has_min_liquidity(asks, min_usd: float) -> bool:
    """
    Checks if the BEST ASK level alone supports min_usd
    """
    if not asks:
        return False

    best = asks[0]
    available_usd = best["price"] * best["size"]

    return available_usd >= min_usd