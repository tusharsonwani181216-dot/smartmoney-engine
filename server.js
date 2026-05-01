const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

function loadOHLC() {
  try {
    const raw = fs.readFileSync("ohlc-data.json");
    return JSON.parse(raw);
  } catch {
    return { stocks: [] };
  }
}

app.get("/", (req, res) => {
  res.send("✅ SmartMoney Backend Running");
});

app.get("/api/ohlc-data", (req, res) => {
  res.json(loadOHLC());
});

app.post("/api/update-now", (req, res) => {
  const data = loadOHLC();

  data.updatedAt = new Date().toISOString();
  data.lastUpdateIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });

  fs.writeFileSync("ohlc-data.json", JSON.stringify(data, null, 2));

  res.json({
    ok: true,
    updated: data.lastUpdateIST,
    count: data.stocks?.length || 0
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on ${PORT}`);
});