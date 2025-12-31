def effective_price(asks, target_usd: float) -> float | None:
    """
    Walks the order book to simulate buying target_usd.
    Returns avg price or None if insufficient depth.
    """
    remaining = target_usd
    cost = 0.0
    shares = 0.0

    for level in asks:
        level_price = level["price"]
        level_shares = level["size"]
        level_usd = level_price * level_shares

        take_usd = min(level_usd, remaining)
        take_shares = take_usd / level_price

        cost += take_usd
        shares += take_shares
        remaining -= take_usd

        if remaining <= 0:
            break

    if remaining > 0:
        return None  # Not enough liquidity

    return cost / shares