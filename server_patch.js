// Add this inside server.js

setInterval(()=>{
  require('child_process').exec('node market-fetch.js');
}, 300000);
