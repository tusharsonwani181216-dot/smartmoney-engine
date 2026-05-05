const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("SmartMoney Backend Running");
});

app.get("/api/ohlc-data", (req, res) => {

  try {

    const raw = fs.readFileSync("ohlc-data.json", "utf8");
    const data = JSON.parse(raw);

    res.json(data);

  } catch (e) {

    res.json({
      updated: Date.now(),
      stocks: []
    });

  }

});

app.get("/api/update-now", (req, res) => {

  exec("node market-fetch.js", (err, stdout, stderr) => {

    if (err) {

      return res.json({
        ok: false,
        error: stderr
      });

    }

    res.json({
      ok: true,
      output: stdout
    });

  });

});

app.listen(PORT, () => {
  console.log("SmartMoney Backend Running on port " + PORT);
});const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("SmartMoney Backend Running");
});

app.get("/api/ohlc-data", (req, res) => {

  try {

    const raw = fs.readFileSync("ohlc-data.json", "utf8");
    const data = JSON.parse(raw);

    res.json(data);

  } catch (e) {

    res.json({
      updated: Date.now(),
      stocks: []
    });

  }

});

app.get("/api/update-now", (req, res) => {

  exec("node market-fetch.js", (err, stdout, stderr) => {

    if (err) {

      return res.json({
        ok: false,
        error: stderr
      });

    }

    res.json({
      ok: true,
      output: stdout
    });

  });

});

app.listen(PORT, () => {
  console.log("SmartMoney Backend Running on port " + PORT);
});const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("SmartMoney Backend Running");
});

app.get("/api/ohlc-data", (req, res) => {

  try {

    const raw = fs.readFileSync("ohlc-data.json", "utf8");
    const data = JSON.parse(raw);

    res.json(data);

  } catch (e) {

    res.json({
      updated: Date.now(),
      stocks: []
    });

  }

});

app.get("/api/update-now", (req, res) => {

  exec("node market-fetch.js", (err, stdout, stderr) => {

    if (err) {

      return res.json({
        ok: false,
        error: stderr
      });

    }

    res.json({
      ok: true,
      output: stdout
    });

  });

});

app.listen(PORT, () => {
  console.log("SmartMoney Backend Running on port " + PORT);
});const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("SmartMoney Backend Running");
});

app.get("/api/ohlc-data", (req, res) => {

  try {

    const raw = fs.readFileSync("ohlc-data.json", "utf8");
    const data = JSON.parse(raw);

    res.json(data);

  } catch (e) {

    res.json({
      updated: Date.now(),
      stocks: []
    });

  }

});

app.get("/api/update-now", (req, res) => {

  exec("node market-fetch.js", (err, stdout, stderr) => {

    if (err) {

      return res.json({
        ok: false,
        error: stderr
      });

    }

    res.json({
      ok: true,
      output: stdout
    });

  });

});

app.listen(PORT, () => {
  console.log("SmartMoney Backend Running on port " + PORT);
});const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("SmartMoney Backend Running");
});

app.get("/api/ohlc-data", (req, res) => {

  try {

    const raw = fs.readFileSync("ohlc-data.json", "utf8");
    const data = JSON.parse(raw);

    res.json(data);

  } catch (e) {

    res.json({
      updated: Date.now(),
      stocks: []
    });

  }

});

app.get("/api/update-now", (req, res) => {

  exec("node market-fetch.js", (err, stdout, stderr) => {

    if (err) {

      return res.json({
        ok: false,
        error: stderr
      });

    }

    res.json({
      ok: true,
      output: stdout
    });

  });

});

app.listen(PORT, () => {
  console.log("SmartMoney Backend Running on port " + PORT);
});