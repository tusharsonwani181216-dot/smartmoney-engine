const express=require("express");
const cors=require("cors");
const fs=require("fs");
const app=express();
app.use(cors());
app.use(express.json({limit:"20mb"}));
app.use(express.static(__dirname));
const PORT=process.env.PORT||10000;
function readJSON(file, fallback){try{return JSON.parse(fs.readFileSync(file,"utf8"))}catch{return fallback}}
app.get("/",(req,res)=>res.send("SmartMoney Backend Running"));
app.get("/api/ohlc-data",(req,res)=>res.json(readJSON("./ohlc-data.json",{updatedAt:null,stocks:[]})));

app.get("/api/summary-data",(req,res)=>{
  const data=readJSON("./ohlc-data.json",{updatedAt:null,stocks:[]});
  const stocks=(data.stocks||[]).map(s=>{
    const candles=s.candles||[];
    const last=candles[candles.length-1]||{};
    const recent=candles.slice(-25);
    const closes=recent.map(c=>Number(c.close)).filter(Number.isFinite);
    const highs=recent.map(c=>Number(c.high)).filter(Number.isFinite);
    const lows=recent.map(c=>Number(c.low)).filter(Number.isFinite);
    const first=candles[0]||last;
    const avg=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
    return {
      market:s.market,
      symbol:s.symbol,
      name:s.name,
      price:Number(last.close||0),
      open:Number(first.open||last.open||0),
      vwap:Number(avg(closes).toFixed(2)),
      high:Number((highs.length?Math.max(...highs):last.high||0).toFixed(2)),
      low:Number((lows.length?Math.min(...lows):last.low||0).toFixed(2)),
      candleCount:candles.length
    };
  });
  res.json({updatedAt:data.updatedAt,stocks});
});

app.post("/api/update-now",(req,res)=>{
  const data=readJSON("./ohlc-data.json",{stocks:[]});
  data.updatedAt=new Date().toISOString();
  fs.writeFileSync("./ohlc-data.json",JSON.stringify(data,null,2));
  res.json({ok:true,count:data.stocks.length,updatedAt:data.updatedAt});
});
app.listen(PORT,()=>console.log("SmartMoney Backend Running on port "+PORT));
