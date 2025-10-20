// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// BlobTown URL
const BUTTON1_URL = "https://app.blobtown.com/?blobt=";

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
      padding: 20px;
      background: #f0f0f0;
    }
    h1 { color: #333; }
    button {
      padding: 12px 25px;
      margin: 10px;
      font-size: 16px;
      cursor: pointer;
    }
    input[type="text"] {
      padding: 8px;
      font-size: 14px;
      width: 250px;
      margin-right: 5px;
    }
    .iframeContainer {
      width: 100%;
      height: 90vh;
      margin: 20px 0;
      display: none;
      border: 2px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
    }
    .iframeContainer iframe {
      width: 100%;
      height: 100%;
      border: none;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <h1>Welcome to stickk's web browser mod for blobtown!</h1>
  <p>Click Inventory to open BlobTown, or enter any website below!</p>

  <button id="btn1">Inventory</button>

  <div id="iframe1Container" class="iframeContainer">
    <iframe id="iframe1" src=""></iframe>
  </div>

  <div>
    <input type="text" id="customUrl" placeholder="Enter a website URL (https://...)">
    <button id="goBtn">Go</button>
  </div>

  <div id="iframe2Container" class="iframeContainer">
    <iframe id="iframe2" src=""></iframe>
  </div>

  <script>
    // Save query in cookie
    document.cookie = "query=${q}; path=/; max-age=31536000";

    const btn1 = document.getElementById("btn1");
    const iframe1Container = document.getElementById("iframe1Container");
    const iframe1 = document.getElementById("iframe1");

    const goBtn = document.getElementById("goBtn");
    const customUrl = document.getElementById("customUrl");
    const iframe2Container = document.getElementById("iframe2Container");
    const iframe2 = document.getElementById("iframe2");

    // Inventory button
    btn1.onclick = () => {
      iframe2Container.style.display = "none"; // hide custom iframe
      iframe1Container.style.display = "block"; // show BlobTown iframe

      // Reset iframe to avoid broken state
      iframe1.src = "";
      setTimeout(() => {
        iframe1.src = "${BUTTON1_URL}" + "${q}";
      }, 10);
    };

    // Custom URL button
    goBtn.onclick = () => {
      let url = customUrl.value.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      iframe1Container.style.display = "none"; // hide BlobTown iframe
      iframe2Container.style.display = "block"; // show custom iframe
      iframe2.src = url; // reuse the same iframe
    };
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
