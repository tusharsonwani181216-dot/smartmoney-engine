const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { updateOHLCData } = require("./update-data");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "ohlc-data.json");
const WATCHLIST_FILE = path.join(__dirname, "watchlist.json");

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.static(__dirname));

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

app.get("/api/ohlc-data", (req, res) => {
  res.json(readJson(DATA_FILE, { updatedAt: null, stocks: [] }));
});

app.get("/api/watchlist", (req, res) => {
  res.json(readJson(WATCHLIST_FILE, { stocks: [] }));
});

app.post("/api/watchlist", (req, res) => {
  const stocks = Array.isArray(req.body.stocks) ? req.body.stocks : [];
  writeJson(WATCHLIST_FILE, { stocks });
  res.json({ ok: true, count: stocks.length });
});

app.post("/api/update-now", async (req, res) => {
  try {
    const result = await updateOHLCData();
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ SmartMoney Real OHLC running: http://localhost:${PORT}`);
  console.log("👉 Commands: npm run seed, npm start");
});
