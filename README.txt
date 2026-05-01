SmartMoney Backend First Full Build

Fix:
- Backend first load: /api/summary-data
- Fallback: /api/ohlc-data
- Last fallback: local ohlc-data.json
- So dashboard can show 30/50/75/100 stocks from backend, not only 4 local sample stocks.
- Chart full candles load on click.

Deploy frontend:
firebase deploy

Deploy backend:
npm install
git add .
git commit -m "backend first full stocks"
git push
