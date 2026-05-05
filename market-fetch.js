const fs = require("fs");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

const symbols = [
  "TATASTEEL.NS",
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "SBIN.NS",
  "ICICIBANK.NS",
  "HDFCBANK.NS",
  "COALINDIA.NS"
];

let running = false;

async function loadMarket() {

  if (running) return;

  running = true;

  try {

    let stocks = [];

    for (const symbol of symbols) {

      try {

        console.log("Loading:", symbol);

        const q = await yahooFinance.quote(symbol);

        stocks.push({
          symbol,
          price: q.regularMarketPrice || 0,
          open: q.regularMarketOpen || 0,
          high: q.regularMarketDayHigh || 0,
          low: q.regularMarketDayLow || 0,
          volume: q.regularMarketVolume || 0,
          time: new Date().toLocaleString("en-IN")
        });

      } catch (e) {

        console.log("FAILED:", symbol);

      }
    }

    fs.writeFileSync(
      "ohlc-data.json",
      JSON.stringify({
        updated: Date.now(),
        stocks
      }, null, 2)
    );

    console.log("MARKET UPDATED");

  } finally {

    running = false;

  }
}

loadMarket();

