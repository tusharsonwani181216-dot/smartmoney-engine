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
app.post("/api/update-now",(req,res)=>{
  const data=readJSON("./ohlc-data.json",{stocks:[]});
  data.updatedAt=new Date().toISOString();
  fs.writeFileSync("./ohlc-data.json",JSON.stringify(data,null,2));
  res.json({ok:true,count:data.stocks.length,updatedAt:data.updatedAt});
});

const { exec } = require("child_process");

function runMarketUpdater() {
  exec("node market-fetch.js", (err, stdout, stderr) => {
    if (err) {
      console.log("Market update failed:", err.message);
      return;
    }
    console.log(stdout);
  });
}

runMarketUpdater();
setInterval(runMarketUpdater, 5 * 60 * 1000);
\napp.listen(PORT,()=>console.log("SmartMoney Backend Running on port "+PORT));
