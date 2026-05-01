const fs = require("fs");
const path = require("path");

const watchlist = {
  stocks: [
    { market: "NSE", symbol: "RELIANCE.NS", name: "Reliance Industries" },
    { market: "NSE", symbol: "TCS.NS", name: "Tata Consultancy Services" },
    { market: "NSE", symbol: "INFY.NS", name: "Infosys" },
    { market: "NSE", symbol: "HDFCBANK.NS", name: "HDFC Bank" },
    { market: "NSE", symbol: "ICICIBANK.NS", name: "ICICI Bank" },
    { market: "NSE", symbol: "SBIN.NS", name: "State Bank of India" },
    { market: "NSE", symbol: "MARUTI.NS", name: "Maruti Suzuki" },
    { market: "NSE", symbol: "SUNPHARMA.NS", name: "Sun Pharma" }
  ]
};

function makeCandles(base, trend = "bullish") {
  const candles = [];
  let price = base * 0.99;
  const now = Date.now();
  for (let i = 0; i < 36; i++) {
    const drift = trend === "bullish" ? 0.0016 : trend === "bearish" ? -0.0014 : 0.0001;
    const wave = Math.sin(i / 3) * 0.002;
    const open = price;
    const close = open * (1 + drift + wave);
    const high = Math.max(open, close) * (1 + 0.0025);
    const low = Math.min(open, close) * (1 - 0.0025);
    candles.push({
      time: new Date(now - (36 - i) * 5 * 60 * 1000).toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(100000 + i * 3500)
    });
    price = close;
  }
  return candles;
}

const stocks = [
  { market:"NSE", symbol:"RELIANCE.NS", name:"Reliance Industries", candles: makeCandles(2860, "bullish") },
  { market:"NSE", symbol:"TCS.NS", name:"Tata Consultancy Services", candles: makeCandles(3950, "bearish") },
  { market:"NSE", symbol:"HDFCBANK.NS", name:"HDFC Bank", candles: makeCandles(1560, "bullish") }
];

fs.writeFileSync(path.join(__dirname, "watchlist.json"), JSON.stringify(watchlist, null, 2));
fs.writeFileSync(path.join(__dirname, "ohlc-data.json"), JSON.stringify({
  updatedAt: new Date().toISOString(),
  source: "Seed OHLC sample. Click Update Now for real OHLC from connector.",
  stocks,
  errors: []
}, null, 2));
console.log("✅ Seed complete: watchlist.json + ohlc-data.json");
