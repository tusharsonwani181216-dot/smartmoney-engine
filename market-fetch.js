const fs = require("fs");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

const symbols = [
  "RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ICICIBANK.NS","SBIN.NS",
  "BHARTIARTL.NS","ITC.NS","LT.NS","AXISBANK.NS","KOTAKBANK.NS","WIPRO.NS",
  "TECHM.NS","SUNPHARMA.NS","TITAN.NS","ULTRACEMCO.NS","MARUTI.NS",
  "POWERGRID.NS","NTPC.NS","ONGC.NS","TATASTEEL.NS","COALINDIA.NS",
  "JSWSTEEL.NS","HINDALCO.NS","ADANIENT.NS","ADANIPORTS.NS","M&M.NS",
  "BAJFINANCE.NS","HCLTECH.NS","CIPLA.NS","DRREDDY.NS","LUPIN.NS",
  "AUROPHARMA.NS","TORNTPHARM.NS","BANKBARODA.NS","PNB.NS","CANBK.NS",
  "FEDERALBNK.NS","IDFCFIRSTB.NS","EICHERMOT.NS","BAJAJ-AUTO.NS",
  "HEROMOTOCO.NS","TVSMOTOR.NS","ASHOKLEY.NS","LTIM.NS","MPHASIS.NS",
  "PERSISTENT.NS","COFORGE.NS","OFSS.NS","GAIL.NS","IOC.NS","BPCL.NS",
  "HINDPETRO.NS","OIL.NS","NHPC.NS","SJVN.NS","IRCTC.NS","RVNL.NS",
  "IRCON.NS","BHEL.NS","BEL.NS","HAL.NS","MAZDOCK.NS","COCHINSHIP.NS",
  "DMART.NS","TRENT.NS","VBL.NS","DABUR.NS","MARICO.NS","ACC.NS",
  "SHREECEM.NS","SAIL.NS","NMDC.NS","VEDL.NS","SUZLON.NS","IDEA.NS",
  "PAYTM.NS","NYKAA.NS","BSE.NS","CDSL.NS"
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

  name: symbol.replace(".NS",""),

  price: q.regularMarketPrice || 0,

  close: q.regularMarketPreviousClose || q.regularMarketPrice || 0,

  open: q.regularMarketOpen || 0,

  high: q.regularMarketDayHigh || 0,

  low: q.regularMarketDayLow || 0,

  vwap:
    (
      (
        (q.regularMarketDayHigh || 0) +
        (q.regularMarketDayLow || 0) +
        (q.regularMarketPrice || 0)
      ) / 3
    ).toFixed(2),

  volume: q.regularMarketVolume || 0,

  changePercent:
    q.regularMarketChangePercent || 0,

  rsi: 58,

  score: Math.floor(Math.random() * 25) + 48,

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

