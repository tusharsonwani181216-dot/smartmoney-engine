const fs = require("fs");
const path = require("path");

const WATCHLIST_FILE = path.join(__dirname, "watchlist.json");
const DATA_FILE = path.join(__dirname, "ohlc-data.json");

function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function avg(arr) {
  const clean = arr.filter(x => Number.isFinite(Number(x))).map(Number);
  if (!clean.length) return 0;
  return clean.reduce((a, b) => a + b, 0) / clean.length;
}
function calcRsi(closes, period = 14) {
  if (!closes || closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 70;
  const rs = gains / losses;
  return Math.round((100 - (100 / (1 + rs))) * 10) / 10;
}
async function fetchYahooOHLC(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=5m`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${symbol} fetch failed: ${res.status}`);
  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) throw new Error(`${symbol} no chart result`);
  const q = result.indicators.quote[0];
  const timestamps = result.timestamp || [];
  const candles = [];
  for (let i = 0; i < timestamps.length; i++) {
    const open = q.open?.[i], high = q.high?.[i], low = q.low?.[i], close = q.close?.[i];
    if (open == null || high == null || low == null || close == null) continue;
    candles.push({
      time: new Date(timestamps[i] * 1000).toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: safeNum(q.volume?.[i], 0)
    });
  }
  if (!candles.length) throw new Error(`${symbol} empty candles`);
  return candles;
}
async function updateOHLCData() {
  const watchlist = fs.existsSync(WATCHLIST_FILE)
    ? JSON.parse(fs.readFileSync(WATCHLIST_FILE, "utf8")).stocks || []
    : [];
  if (!watchlist.length) throw new Error("watchlist.json empty. Run npm run seed.");

  const stocks = [];
  const errors = [];
  for (const seed of watchlist) {
    try {
      const candles = await fetchYahooOHLC(seed.symbol);
      stocks.push({
        market: seed.market || "NSE",
        symbol: seed.symbol,
        name: seed.name || seed.symbol,
        candles
      });
      console.log("✅", seed.symbol, candles.length, "candles");
    } catch (err) {
      errors.push({ symbol: seed.symbol, error: err.message });
      console.log("⚠️", seed.symbol, err.message);
    }
  }
  if (!stocks.length) throw new Error("No OHLC data fetched. Check internet/API source.");

  fs.writeFileSync(DATA_FILE, JSON.stringify({
    updatedAt: new Date().toISOString(),
    source: "Yahoo Finance unofficial real 5m OHLC connector. Replace with authorized API for production.",
    stocks,
    errors
  }, null, 2));

  return { count: stocks.length, errors };
}

if (require.main === module) {
  updateOHLCData()
    .then(r => console.log(`\n✅ OHLC updated: ${r.count} stocks`))
    .catch(err => {
      console.error("\n❌ Update failed:", err.message);
      process.exit(1);
    });
}
module.exports = { updateOHLCData };
