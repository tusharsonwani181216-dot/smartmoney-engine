
// MARKET TIME BUY/SELL PATCH

function getMarketSession() {

  const now = new Date();

  const ist = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
    })
  );

  const day = ist.getDay();

  const h = ist.getHours();
  const m = ist.getMinutes();

  const mins = h * 60 + m;

  if (day === 0 || day === 6) {
    return {
      status: "MARKET CLOSED",
      action: "NO TRADE",
      cls: "avoid"
    };
  }

  if (mins < 9 * 60) {
    return {
      status: "BEFORE MARKET",
      action: "NO TRADE",
      cls: "avoid"
    };
  }

  if (mins >= 9 * 60 && mins < 9 * 60 + 15) {
    return {
      status: "PRE OPEN",
      action: "WAIT",
      cls: "wait"
    };
  }

  if (mins >= 9 * 60 + 15 && mins < 9 * 60 + 30) {
    return {
      status: "OPENING VOLATILE",
      action: "WAIT 15 MIN",
      cls: "wait"
    };
  }

  if (mins >= 9 * 60 + 30 && mins < 14 * 60 + 45) {
    return {
      status: "ACTIVE MARKET",
      action: "BUY/SELL ALLOWED",
      cls: "buy"
    };
  }

  if (mins >= 14 * 60 + 45 && mins < 15 * 60 + 15) {
    return {
      status: "LATE SESSION",
      action: "ONLY BEST SETUP",
      cls: "wait"
    };
  }

  if (mins >= 15 * 60 + 15 && mins < 15 * 60 + 30) {
    return {
      status: "SQUARE OFF TIME",
      action: "EXIT / BOOK PROFIT",
      cls: "sell"
    };
  }

  return {
    status: "MARKET CLOSED",
    action: "NO FRESH TRADE",
    cls: "avoid"
  };
}
