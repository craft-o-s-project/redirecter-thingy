// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Button URLs
const BUTTON1_URL = "https://app.blobtown.com/?blobt=";
const BUTTON2_URL = "https://www.google.com";

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
    #showQueryBtn, #lastQueryBox {
      position: fixed;
      bottom: 10px;
      left: 10px;
      font-size: 14px;
      font-family: monospace;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      transition: opacity 0.3s ease;
    }
    #showQueryBtn {
      background: #007bff;
      color: white;
      cursor: pointer;
    }
    #lastQueryBox {
      background: rgba(0,0,0,0.7);
      color: white;
      display: none;
    }
    #iframeContainer {
      width: 80%;
      height: 500px;
      margin: 20px auto;
      display: none;
      border: 2px solid #ccc;
      border-radius: 8px;
    }
    #iframeContainer iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Welcome to stickk's web browser mod for blobtown!</h1>
  <p>(audio works btw so you can watch YouTube!)</p>
  <p>You can click the inventory button or the Google button below! Uh, happy tracing!</p>

  <button id="btn1">Inventory</button>
  <button id="btn2">Google</button>

  <button id="showQueryBtn">Show BlobToken (dont show to anyone!)</button>
  <div id="lastQueryBox"></div>

  <div id="iframeContainer">
    <iframe id="contentFrame" src=""></iframe>
  </div>

  <script>
    // Save query in cookie
    document.cookie = "query=${q}; path=/; max-age=31536000";

    // Cookie reader
    function getCookie(name) {
      const value = "; " + document.cookie;
      const parts = value.split("; " + name + "=");
      if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // Elements
    const btn1 = document.getElementById("btn1");
    const btn2 = document.getElementById("btn2");
    const showBtn = document.getElementById("showQueryBtn");
    const lastQueryBox = document.getElementById("lastQueryBox");
    const iframeContainer = document.getElementById("iframeContainer");
    const contentFrame = document.getElementById("contentFrame");

    // Button actions
    btn1.onclick = () => {
      contentFrame.src = "${BUTTON1_URL}" + "${q}";
      iframeContainer.style.display = "block";
    };

    btn2.onclick = () => {
      contentFrame.src = "${BUTTON2_URL}";
      iframeContainer.style.display = "block";
    };

    showBtn.onclick = () => {
      const lastQuery = getCookie("query");
      if (lastQuery) {
        lastQueryBox.textContent = " Your BlobToken: " + decodeURIComponent(lastQuery);
      } else {
        lastQueryBox.textContent = "BlobToken not found";
      }

      // Animate transition
      showBtn.style.opacity = "0";
      setTimeout(() => {
        showBtn.style.display = "none";
        lastQueryBox.style.display = "block";
        lastQueryBox.style.opacity = "0";
        setTimeout(() => {
          lastQueryBox.style.opacity = "1";
        }, 10);
      }, 300);
    };
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
