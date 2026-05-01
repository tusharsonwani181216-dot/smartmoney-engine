
SMARTMONEY MARKET TIME PATCH

1. Open index.html
2. Paste getMarketSession() above analyze()
3. Add session logic inside analyze()

Deploy:
firebase deploy

Features:
- Market open/close logic
- Buy/Sell only in active session
- Opening wait logic
- Exit/square-off logic
- Weekend no-trade
