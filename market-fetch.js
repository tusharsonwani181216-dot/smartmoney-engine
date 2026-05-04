const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
const fs = require("fs");

const SYMBOLS = [
  "RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ICICIBANK.NS",
  "SBIN.NS","BHARTIARTL.NS","ITC.NS","LT.NS","AXISBANK.NS",
  "KOTAKBANK.NS","WIPRO.NS","TECHM.NS","SUNPHARMA.NS","TITAN.NS",
  "ULTRACEMCO.NS","MARUTI.NS","POWERGRID.NS","NTPC.NS","ONGC.NS",
  "TATAMOTORS.NS","M&M.NS","BAJFINANCE.NS","BAJAJFINSV.NS","HCLTECH.NS",
  "CIPLA.NS","DRREDDY.NS","DIVISLAB.NS","APOLLOHOSP.NS","ADANIENT.NS",
  "ADANIPORTS.NS","COALINDIA.NS","JSWSTEEL.NS","TATASTEEL.NS","HINDALCO.NS",
  "GRASIM.NS","NESTLEIND.NS","HINDUNILVR.NS","ASIANPAINT.NS","BRITANNIA.NS",

  "BANKBARODA.NS","PNB.NS","CANBK.NS","FEDERALBNK.NS","IDFCFIRSTB.NS",
  "AUBANK.NS","INDUSINDBK.NS","BANDHANBNK.NS","RBLBANK.NS","YESBANK.NS",
  "HDFCLIFE.NS","SBILIFE.NS","ICICIPRULI.NS","LICHSGFIN.NS","CHOLAFIN.NS",
  "MUTHOOTFIN.NS","MANAPPURAM.NS","RECLTD.NS","PFC.NS","IRFC.NS",

  "EICHERMOT.NS","BAJAJ-AUTO.NS","HEROMOTOCO.NS","TVSMOTOR.NS","ASHOKLEY.NS",
  "BOSCHLTD.NS","MOTHERSON.NS","BALKRISIND.NS","MRF.NS","ESCORTS.NS",

  "LTIM.NS","MPHASIS.NS","PERSISTENT.NS","COFORGE.NS","OFSS.NS",
  "TATAELXSI.NS","ZENSARTECH.NS","SONATSOFTW.NS","KPITTECH.NS","CYIENT.NS",

  "LUPIN.NS","AUROPHARMA.NS","TORNTPHARM.NS","ALKEM.NS","BIOCON.NS",
  "GLENMARK.NS","ZYDUSLIFE.NS","IPCALAB.NS","LAURUSLABS.NS","ABBOTINDIA.NS",

  "GAIL.NS","IOC.NS","BPCL.NS","HINDPETRO.NS","OIL.NS",
  "NHPC.NS","SJVN.NS","IRCTC.NS","RVNL.NS","IRCON.NS",
  "BHEL.NS","BEL.NS","HAL.NS","MAZDOCK.NS","COCHINSHIP.NS",

  "DMART.NS","TRENT.NS","VBL.NS","DABUR.NS","MARICO.NS",
  "COLPAL.NS","GODREJCP.NS","UBL.NS","JUBLFOOD.NS","AMBUJACEM.NS",

  "ACC.NS","SHREECEM.NS","DALBHARAT.NS","JINDALSTEL.NS","SAIL.NS",
  "NMDC.NS","VEDL.NS","PIIND.NS","UPL.NS","TATACHEM.NS",
  "SRF.NS","AARTIIND.NS","DEEPAKNTR.NS","NAVINFLUOR.NS","SUZLON.NS",

  "IDEA.NS","PAYTM.NS","NYKAA.NS","POLICYBZR.NS","IRB.NS",
  "NBCC.NS","HUDCO.NS","IEX.NS","KPIL.NS","KAYNES.NS",
  "BSE.NS","CDSL.NS","ANGELONE.NS"
];

function makeCandles(q) {
  const price = Number(q.regularMarketPrice || q.previousClose || 100);
  const open = Number(q.regularMarketOpen || q.previousClose || price);
  const high = Number(q.regularMarketDayHigh || price);
  const low = Number(q.regularMarketDayLow || price);
  const volume = Number(q.regularMarketVolume || 100000);

  const candles = [];

  for (let i = 0; i < 40; i++) {
    const close = open + ((price - open) * i / 39);

    candles.push({
      time: i,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume
    });
  }

  candles[candles.length - 1].close = +price.toFixed(2);

  return candles;
}

async function run() {
  const stocks = [];

  for (const symbol of SYMBOLS) {
    try {
      console.log("Loading:", symbol);

      const q = await yahooFinance.quote(symbol);

      if (!q || !q.regularMarketPrice) {
        console.log("SKIP:", symbol);
        continue;
      }

      stocks.push({
        market: symbol.includes(".BO") ? "BSE" : "NSE",
        symbol,
        name: q.shortName || q.longName || symbol,
        price: q.regularMarketPrice,
        open: q.regularMarketOpen,
        high: q.regularMarketDayHigh,
        low: q.regularMarketDayLow,
        volume: q.regularMarketVolume,
        candles: makeCandles(q)
      });
    } catch (e) {
      console.log("FAILED:", symbol, e.message);
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