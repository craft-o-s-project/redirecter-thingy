// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// First button URL — just write it here
const BUTTON1_URL = "https://app.blobtown.com/?blobt="; // we'll append the query to this
const BUTTON2_URL = "https://www.google.com"; // second button

app.get("/", (req, res) => {
  const q = req.query.q || "";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to stickk's web browser mod for blobtown!</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f0f0; }
    h1 { color: #333; }
    button { padding: 15px 30px; margin: 10px; font-size: 16px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Welcome to stickk's web browser mod for blobtown!</h1>
  <p>You can make your way back to this page by closing the inventory and re opening it! (audio works btw so you can watch youtube!)</p>
  <p>You can click the inventory button or the google button below! uh happy tracing!</p>

  <button id="btn1">Inventory</button>
  <button id="btn2">Go to Google</button>

  <script>
    // Save query in cookie
    document.cookie = "query=${q}; path=/; max-age=31536000";

    // Button actions
    document.getElementById("btn1").onclick = () => {
      window.location.href = "${BUTTON1_URL}" + "${q}";
    };

    document.getElementById("btn2").onclick = () => {
      window.location.href = "${BUTTON2_URL}";
    };
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
