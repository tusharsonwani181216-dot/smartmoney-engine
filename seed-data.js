
const fs = require("fs");
const watchlist = require("./watchlist.json");
function makeCandles(base, dir=1) {
  const candles=[]; let price=base; const now=Date.now();
  for(let i=0;i<36;i++){
    const open=price, close=open*(1+dir*0.0015+Math.sin(i/3)*0.002);
    const high=Math.max(open,close)*1.003, low=Math.min(open,close)*0.997;
    candles.push({time:new Date(now-(36-i)*5*60*1000).toISOString(),open:+open.toFixed(2),high:+high.toFixed(2),low:+low.toFixed(2),close:+close.toFixed(2),volume:100000+i*3000});
    price=close;
  }
  return candles;
}
const stocks = watchlist.stocks.slice(0,30).map((s,i)=>({ ...s, candles: makeCandles(100+(i*53)%3000, i%3===1?-1:1) }));
fs.writeFileSync("./ohlc-data.json", JSON.stringify({updatedAt:new Date().toISOString(),market:"ALL",count:stocks.length,stocks,errors:[]}, null, 2));
console.log("✅ Seed complete", stocks.length);
