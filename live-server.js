require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const SYMBOLS = [
  "NSE_EQ|INE002A01018",
  "NSE_EQ|INE009A01021",
  "NSE_EQ|INE467B01029"
];

async function fetchMarket() {

  try {

    const url =
      "https://api.upstox.com/v2/market-quote/quotes";

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`
      },
      params: {
        instrument_key: SYMBOLS.join(",")
      }
    });

    const data = response.data;

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });

  } catch (e) {
    console.log("LIVE ERROR", e.message);
  }
}

setInterval(fetchMarket, 3000);

app.get("/", (req, res) => {
  res.send("SmartMoney Live API Running");
});

server.listen(10000, () => {
  console.log("LIVE SERVER RUNNING 10000");
});
