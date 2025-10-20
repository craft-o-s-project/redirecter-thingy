// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Button URLs
const BUTTON1_URL = "https://app.blobtown.com/?blobt=";
const BUTTON2_URL = "https://duckduckgo.com";

app.get("/", (req, res) => {
  const q = req.query.q || "";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to stickk's web browser mod for blobtown!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
      background: #f0f0f0;
    }
    h1 { color: #333; }
    button {
      padding: 15px 30px;
      margin: 10px;
      font-size: 16px;
      cursor: pointer;
    }
    .iframeContainer {
      width: 80%;
      height: 500px;
      margin: 20px auto;
      display: none;
      border: 2px solid #ccc;
      border-radius: 8px;
    }
    .iframeContainer iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Welcome to stickk's web browser mod for blobtown!</h1>
  <p>You can make your way back to this page by closing the inventory and re-opening it! (audio works btw so you can watch YouTube!)</p>
  <p>You can click the inventory button or the DuckDuckGo button below! Uh, happy tracing!</p>

  <button id="btn1">Inventory</button>
  <button id="btn2">Go to DuckDuckGo</button>

  <div id="iframe1Container" class="iframeContainer">
    <iframe id="iframe1" src=""></iframe>
  </div>

  <div id="iframe2Container" class="iframeContainer">
    <iframe id="iframe2" src=""></iframe>
  </div>

  <script>
    // Save query in cookie
    document.cookie = "query=${q}; path=/; max-age=31536000";

    // Elements
    const btn1 = document.getElementById("btn1");
    const btn2 = document.getElementById("btn2");
    const iframe1Container = document.getElementById("iframe1Container");
    const iframe2Container = document.getElementById("iframe2Container");
    const iframe1 = document.getElementById("iframe1");
    const iframe2 = document.getElementById("iframe2");

    // Button actions
    btn1.onclick = () => {
      iframe1.src = "${BUTTON1_URL}" + "${q}";
      iframe1Container.style.display = "block";
      iframe2Container.style.display = "none";
    };

    btn2.onclick = () => {
      iframe2.src = "${BUTTON2_URL}";
      iframe2Container.style.display = "block";
      iframe1Container.style.display = "none";
    };
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
