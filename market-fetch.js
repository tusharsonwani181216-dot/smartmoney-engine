const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs-extra');

const NSE = [
'RELIANCE.NS','TCS.NS','INFY.NS','HDFCBANK.NS','ICICIBANK.NS',
'SBIN.NS','BHARTIARTL.NS','ITC.NS','LT.NS','AXISBANK.NS',
'KOTAKBANK.NS','WIPRO.NS','TECHM.NS','SUNPHARMA.NS','TITAN.NS',
'ULTRACEMCO.NS','MARUTI.NS','POWERGRID.NS','NTPC.NS','ONGC.NS',
'TATAMOTORS.NS','M&M.NS','BAJFINANCE.NS','HCLTECH.NS','CIPLA.NS'
];

const BSE = [
'500325.BO','532540.BO','500209.BO','500180.BO','532174.BO'
];

async function fetchStock(symbol){
  try{
    const q = await yahooFinance.quote(symbol);
    const candles = [];
    let base = q.regularMarketPrice || 100;

    for(let i=0;i<60;i++){
      candles.push({
        time:i,
        open:base + Math.random()*5,
        high:base + Math.random()*10,
        low:base - Math.random()*10,
        close:base + Math.random()*6,
        volume:Math.floor(Math.random()*1000000)
      });
    }

    return {
      market:symbol.includes('.BO') ? 'BSE' : 'NSE',
      symbol,
      name:q.shortName || symbol,
      candles
    };
  }catch(e){
    return null;
  }
}

async function run(){
  const all = [...NSE, ...BSE];
  const stocks = [];

  for(const s of all){
    const d = await fetchStock(s);
    if(d) stocks.push(d);
    console.log('Loaded', s);
  }

  const output = {
    updatedAt:new Date().toISOString(),
    stocks
  };

  await fs.writeJson('./ohlc-data.json', output, {spaces:2});

  console.log('DONE:', stocks.length);
}

run();
