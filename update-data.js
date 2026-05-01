
const fs = require("fs");

function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function avg(arr) {
  const clean = arr.filter(x => Number.isFinite(Number(x))).map(Number);
  return clean.length ? clean.reduce((a,b)=>a+b,0)/clean.length : 0;
}
function makeFallbackCandles(seed, i) {
  const base = 100 + (i * 37) % 2500;
  const candles = [];
  let price = base;
  const now = Date.now();
  const dir = i % 3 === 0 ? 1 : i % 3 === 1 ? -1 : 0.2;
  for (let k=0;k<36;k++) {
    const wave = Math.sin(k/3) * 0.003;
    const drift = dir * 0.0012;
    const open = price;
    const close = open * (1 + drift + wave);
    const high = Math.max(open, close) * 1.003;
    const low = Math.min(open, close) * 0.997;
    candles.push({
      time: new Date(now - (36-k)*5*60*1000).toISOString(),
      open: Math.round(open*100)/100,
      high: Math.round(high*100)/100,
      low: Math.round(low*100)/100,
      close: Math.round(close*100)/100,
      volume: Math.round(50000 + k*2500 + i*1000)
    });
    price = close;
  }
  return candles;
}
async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=5m`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${symbol} ${res.status}`);
  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) throw new Error(`${symbol} no data`);
  const q = result.indicators.quote[0];
  const timestamps = result.timestamp || [];
  const candles = [];
  for (let i=0;i<timestamps.length;i++) {
    const open=q.open?.[i], high=q.high?.[i], low=q.low?.[i], close=q.close?.[i];
    if(open==null||high==null||low==null||close==null) continue;
    candles.push({
      time: new Date(timestamps[i]*1000).toISOString(),
      open: Math.round(open*100)/100,
      high: Math.round(high*100)/100,
      low: Math.round(low*100)/100,
      close: Math.round(close*100)/100,
      volume: safeNum(q.volume?.[i], 0)
    });
  }
  if(!candles.length) throw new Error(`${symbol} empty candles`);
  return candles;
}
async function updateOHLCData(options = {}) {
  const market = options.market || "ALL";
  const limit = Math.max(1, Math.min(Number(options.limit || 30), 100));
  const watch = JSON.parse(fs.readFileSync("./watchlist.json","utf8")).stocks || [];
  const selected = watch.filter(s => market === "ALL" || s.market === market).slice(0, limit);
  const stocks = [], errors = [];
  for (let i=0;i<selected.length;i++) {
    const seed = selected[i];
    try {
      const candles = await fetchYahoo(seed.symbol);
      stocks.push({ market: seed.market, symbol: seed.symbol, name: seed.name, candles });
      console.log("✅", seed.symbol);
    } catch (err) {
      errors.push({ symbol: seed.symbol, error: err.message });
      stocks.push({ market: seed.market, symbol: seed.symbol, name: seed.name, candles: makeFallbackCandles(seed, i), fallback: true });
      console.log("⚠️ fallback", seed.symbol, err.message);
    }
  }
  const payload = { updatedAt: new Date().toISOString(), market, count: stocks.length, stocks, errors };
  fs.writeFileSync("./ohlc-data.json", JSON.stringify(payload, null, 2));
  return { count: stocks.length, errors };
}
if (require.main === module) {
  updateOHLCData({ market: process.env.MARKET || "ALL", limit: process.env.LIMIT || 30 })
    .then(r => console.log("✅ updated", r.count))
    .catch(e => { console.error(e); process.exit(1); });
}
module.exports = { updateOHLCData };
