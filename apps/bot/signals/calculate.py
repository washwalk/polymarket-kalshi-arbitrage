def kalshi_fee(profit: float) -> float:
    return profit * 0.07

def calculate_arb(poly_ask, kalshi_ask):
    gross_cost = poly_ask + kalshi_ask

    if gross_cost >= 1.0:
        return None

    gross_profit = 1.0 - gross_cost
    fee = kalshi_fee(gross_profit)
    net_profit = gross_profit - fee

    roi = net_profit / gross_cost

    return {
        "gross_cost": round(gross_cost, 4),
        "net_profit": round(net_profit, 4),
        "roi": round(roi * 100, 2)
    }