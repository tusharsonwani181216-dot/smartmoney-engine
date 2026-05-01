
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { updateOHLCData } = require("./update-data");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

app.get("/", (req, res) => res.send("✅ SmartMoney Backend Running"));

app.get("/api/ohlc-data", (req, res) => {
  res.json(readJson("./ohlc-data.json", { updatedAt: null, stocks: [], errors: [] }));
});

app.get("/api/watchlist", (req, res) => {
  res.json(readJson("./watchlist.json", { stocks: [] }));
});

app.post("/api/watchlist", (req, res) => {
  const stocks = Array.isArray(req.body.stocks) ? req.body.stocks : [];
  writeJson("./watchlist.json", { stocks });
  res.json({ ok: true, count: stocks.length });
});

app.post("/api/update-now", async (req, res) => {
  try {
    const result = await updateOHLCData(req.body || {});
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => console.log("✅ SmartMoney Backend Running on port " + PORT));
