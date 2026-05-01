const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const fs = require("fs");

const SYMBOLS = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
  "ICICIBANK.NS",
  "SBIN.NS",
  "BHARTIARTL.NS",
  "ITC.NS",
  "LT.NS",
  "AXISBANK.NS",
  "KOTAKBANK.NS",
  "WIPRO.NS",
  "TECHM.NS",
  "SUNPHARMA.NS",
  "TITAN.NS",
  "ULTRACEMCO.NS",
  "MARUTI.NS",
  "POWERGRID.NS",
  "NTPC.NS",
  "ONGC.NS",
  "TATAMOTORS.NS",
  "M&M.NS",
  "BAJFINANCE.NS",
  "HCLTECH.NS",
  "CIPLA.NS"
];

function generateCandles(price) {
  let candles = [];
  let base = price || 100;

  for (let i = 0; i < 40; i++) {
    const open = base + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 12;

    candles.push({
      time: i,
      open: Number(open.toFixed(2)),
      high: Number((Math.max(open, close) + 5).toFixed(2)),
      low: Number((Math.min(open, close) - 5).toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000)
    });

    base = close;
  }

  return candles;
}

async function fetchStock(symbol) {
  try {
    const q = await yahooFinance.quote(symbol);

    const price =
      q.regularMarketPrice ||
      q.postMarketPrice ||
      q.previousClose ||
      100;

    return {
      symbol,
      name: q.shortName || symbol,
      price,
      candles: generateCandles(price)
    };
  } catch (err) {
    console.log("FAILED:", symbol, err.message);
    return null;
  }
}

async function run() {
  const stocks = [];

  for (const symbol of SYMBOLS) {
    console.log("Loading:", symbol);

    const data = await fetchStock(symbol);

    if (data) {
      stocks.push(data);
    }
  }

  fs.writeFileSync(
    "ohlc-data.json",
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        stocks
      },
      null,
      2
    )
  );

  console.log("DONE:", stocks.length);
}

run();