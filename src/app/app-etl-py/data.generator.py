import csv
import random

portfolio_codes = [f"P{str(i).zfill(3)}" for i in range(1, 4)]
stock_codes = [f"STK{str(i).zfill(4)}" for i in range(1, 21)]
countries = ["US", "HK", "JP", "CN", "DE"]
security_types = ["Equity", "Bond", "Commodity", "Currency", "REIT"]

with open("etf_portfolio_sample.csv", "w", newline="") as csvfile:
    fieldnames = [
        "portfolio_code", "stock_code", "country", "security_type",
        "unit", "average_price", "current_price", "market_value"
    ]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for i in range(50):
        portfolio_code = random.choice(portfolio_codes)
        stock_code = random.choice(stock_codes)
        country = random.choice(countries)
        security_type = random.choice(security_types)
        unit = random.randint(10, 1000)
        average_price = round(random.uniform(10, 200), 2)
        current_price = round(average_price * random.uniform(0.8, 1.2), 2)
        market_value = round(unit * current_price, 2)
        writer.writerow({
            "portfolio_code": portfolio_code,
            "stock_code": stock_code,
            "country": country,
            "security_type": security_type,
            "unit": unit,
            "average_price": average_price,
            "current_price": current_price,
            "market_value": market_value
        })