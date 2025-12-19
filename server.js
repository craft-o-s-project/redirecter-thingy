// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const SCRAMJET_URL = "https://scramjet.mercurywork.shop/";
const BLOBTOWN_URL = "https://app.blobtown.com/?blobt=";

app.get("/", (req, res) => {
  const query = req.query.q || "";

  // No-cache headers
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mini Browser</title>
<style>
  body { font-family: sans-serif; background: #fff; color: #000; margin: 0; overflow: hidden; }
  #navbar { display: flex; justify-content: space-between; align-items: center; background: #f0f0f0; padding: 10px; }
  #tabs { display: flex; gap: 10px; }
  .tab { background: #e0e0e0; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
  .tab.active { background: #0078ff; color: #fff; }
  iframe { width: 100%; height: calc(100vh - 50px); border: none; background: #fff; display: none; }
  #inventory {
    display: none;
    flex-direction: column;
    height: calc(100vh - 50px);
  }
  #refreshBtn {
    position: fixed;
    bottom: 15px;
    right: 15px;
    background: #0078ff;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }
</style>
</head>
<body>

<div id="navbar">
  <div id="tabs">
    <div class="tab active" onclick="openTab('browser')">Browser</div>
    <div class="tab" onclick="openTab('inventory')">Inventory</div>
  </div>
</div>

<iframe id="browser"></iframe>
<div id="inventory"></div>

<button id="refreshBtn" onclick="reloadActive()">⟳ Refresh</button>

<script>
  const SCRAMJET_URL = "${SCRAMJET_URL}";
  const BLOBTOWN_URL = "${BLOBTOWN_URL}";
  const query = "${query}";

  const browserIframe = document.getElementById("browser");
  const inventoryContainer = document.getElementById("inventory");

  let activeTab = "browser";

  function openTab(tab) {
    activeTab = tab;

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("iframe, #inventory").forEach(el => el.style.display = "none");

    if (tab === "browser") {
      document.querySelector(".tab:nth-child(1)").classList.add("active");
      browserIframe.style.display = "block";
      browserIframe.src = SCRAMJET_URL;
    }

    if (tab === "inventory") {
      document.querySelector(".tab:nth-child(2)").classList.add("active");
      inventoryContainer.style.display = "flex";

      inventoryContainer.innerHTML = "";
      if (query) {
        const invIframe = document.createElement("iframe");
        invIframe.src = BLOBTOWN_URL + query;
        invIframe.style.width = "100%";
        invIframe.style.height = "100%";
        invIframe.style.border = "none";
        inventoryContainer.appendChild(invIframe);
      }
    }
  }

  function reloadActive() {
    if (activeTab === "browser") {
      browserIframe.src = SCRAMJET_URL;
    } else {
      openTab("inventory");
    }
  }

  window.onload = () => {
    browserIframe.src = SCRAMJET_URL;
    browserIframe.style.display = "block";
  };
</script>

</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
