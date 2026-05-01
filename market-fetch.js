const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const fs = require("fs");

const SYMBOLS = [

  // NIFTY / LARGE CAP
  "RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ICICIBANK.NS",
  "SBIN.NS","BHARTIARTL.NS","ITC.NS","LT.NS","AXISBANK.NS",
  "KOTAKBANK.NS","WIPRO.NS","TECHM.NS","SUNPHARMA.NS","TITAN.NS",
  "ULTRACEMCO.NS","MARUTI.NS","POWERGRID.NS","NTPC.NS","ONGC.NS",
  "TATAMOTORS.NS","M&M.NS","BAJFINANCE.NS","BAJAJFINSV.NS","HCLTECH.NS",
  "CIPLA.NS","DRREDDY.NS","DIVISLAB.NS","APOLLOHOSP.NS","ADANIENT.NS",
  "ADANIPORTS.NS","COALINDIA.NS","JSWSTEEL.NS","TATASTEEL.NS","HINDALCO.NS",
  "GRASIM.NS","NESTLEIND.NS","HINDUNILVR.NS","ASIANPAINT.NS","BRITANNIA.NS",

  // BANKS
  "BANKBARODA.NS","PNB.NS","CANBK.NS","FEDERALBNK.NS","IDFCFIRSTB.NS",
  "AUBANK.NS","INDUSINDBK.NS","BANDHANBNK.NS","RBLBANK.NS","YESBANK.NS",
  "HDFCLIFE.NS","SBILIFE.NS","ICICIPRULI.NS","LICHSGFIN.NS","CHOLAFIN.NS",
  "MUTHOOTFIN.NS","MANAPPURAM.NS","RECLTD.NS","PFC.NS","IRFC.NS",

  // AUTO
  "EICHERMOT.NS","BAJAJ-AUTO.NS","HEROMOTOCO.NS","TVSMOTOR.NS","ASHOKLEY.NS",
  "BOSCHLTD.NS","MOTHERSON.NS","BALKRISIND.NS","MRF.NS","ESCORTS.NS",

  // IT
  "LTIM.NS","MPHASIS.NS","PERSISTENT.NS","COFORGE.NS","OFSS.NS",
  "TATAELXSI.NS","ZENSARTECH.NS","SONATSOFTW.NS","KPITTECH.NS","CYIENT.NS",

  // PHARMA
  "LUPIN.NS","AUROPHARMA.NS","TORNTPHARM.NS","ALKEM.NS","BIOCON.NS",
  "GLENMARK.NS","ZYDUSLIFE.NS","IPCALAB.NS","LAURUSLABS.NS","ABBOTINDIA.NS",

  // PSU / ENERGY
  "GAIL.NS","IOC.NS","BPCL.NS","HINDPETRO.NS","OIL.NS",
  "NHPC.NS","SJVN.NS","IRCTC.NS","RVNL.NS","IRCON.NS",
  "BHEL.NS","BEL.NS","HAL.NS","MAZDOCK.NS","COCHINSHIP.NS",

  // FMCG
  "DMART.NS","TRENT.NS","VBL.NS","DABUR.NS","MARICO.NS",
  "COLPAL.NS","GODREJCP.NS","UBL.NS","MCDOWELL-N.NS","JUBLFOOD.NS",

  // METALS / CEMENT / CHEMICAL
  "AMBUJACEM.NS","ACC.NS","SHREECEM.NS","DALBHARAT.NS","JINDALSTEL.NS",
  "SAIL.NS","NMDC.NS","VEDL.NS","PIIND.NS","UPL.NS",
  "TATACHEM.NS","SRF.NS","AARTIIND.NS","DEEPAKNTR.NS","NAVINFLUOR.NS",

  // MIDCAP / SMALLCAP
  "SUZLON.NS","IDEA.NS","PAYTM.NS","ZOMATO.NS","NYKAA.NS",
  "POLICYBZR.NS","IRB.NS","NBCC.NS","HUDCO.NS","IEX.NS",
  "KPIL.NS","KAYNES.NS","BSE.NS","CDSL.NS","ANGELONE.NS",

  // BSE
  "500325.BO","532540.BO","500209.BO","500180.BO","532174.BO",
  "500875.BO","500112.BO","532454.BO","500510.BO","500570.BO"
];

function generateCandles(price) {

  let candles = [];
  let base = price || 100;

  for (let i = 0; i < 60; i++) {

    const open = base + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 12;

    candles.push({
      time: i,

      open: Number(open.toFixed(2)),

      high: Number(
        (Math.max(open, close) + Math.random() * 5).toFixed(2)
      ),

      low: Number(
        (Math.min(open, close) - Math.random() * 5).toFixed(2)
      ),

      close: Number(close.toFixed(2)),

      volume: Math.floor(
        100000 + Math.random() * 900000
      )
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

      market: symbol.includes(".BO")
        ? "BSE"
        : "NSE",

      symbol,

      name:
        q.shortName ||
        q.longName ||
        symbol,

      price,

      candles: generateCandles(price)
    };

  } catch (err) {

    console.log(
      "FAILED:",
      symbol,
      err.message
    );

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