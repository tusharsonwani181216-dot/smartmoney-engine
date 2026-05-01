const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

function loadOHLC() {
  try {
    return JSON.parse(fs.readFileSync("./ohlc-data.json", "utf8"));
  } catch (err) {
    return { error: "OHLC file load failed", details: err.message, stocks: [] };
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
  fs.writeFileSync("./ohlc-data.json", JSON.stringify(data, null, 2));
  res.json({ ok: true, updatedAt: data.updatedAt, count: data.stocks?.length || 0 });
});

app.listen(PORT, () => {
  console.log("✅ SmartMoney Backend Running on port " + PORT);
});