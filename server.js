// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BLOBTOWN_URL = "https://app.blobtown.com/?blobt=";

app.get("/", (req, res) => {
  const query = req.query.q || "";

  // Full no-cache headers
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
  iframe { width: 100%; height: calc(100vh - 50px); border: none; display: none; background: #fff; }
  #inventory { display: none; flex-direction: column; align-items: center; justify-content: center; background: #fff; height: calc(100vh - 50px); }
  #refreshBtn { position: fixed; bottom: 15px; right: 15px; background: #0078ff; border: none; border-radius: 8px; padding: 8px 12px; color: white; font-size: 14px; cursor: pointer; }
</style>
</head>
<body>

<div id="navbar">
  <div id="tabs">
    <div class="tab active" onclick="openTab('browser')">Browser</div>
    <div class="tab" onclick="openTab('inventory')">Inventory</div>
  </div>
  <div>
    <input type="text" id="urlInput" placeholder="Enter website..." style="width:200px; padding:5px;">
    <button onclick="loadSite()">Go</button>
  </div>
</div>

<iframe id="browser"></iframe>
<div id="inventory"></div>

<button id="refreshBtn" onclick="location.reload(true)">⟳ Refresh</button>

<script>
  const BLOBTOWN_URL = "${BLOBTOWN_URL}";
  const query = "${query}";
  const browserIframe = document.getElementById("browser");
  const inventoryContainer = document.getElementById("inventory");

  function openTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("iframe, #inventory").forEach(el => el.style.display = "none");

    if (tab === "browser") {
      document.querySelector(".tab:nth-child(1)").classList.add("active");
      browserIframe.style.display = "block";
    } else if (tab === "inventory") {
      document.querySelector(".tab:nth-child(2)").classList.add("active");
      inventoryContainer.style.display = "flex";

      // Remove previous iframe if exists to fix reload issue
      inventoryContainer.innerHTML = '';
      if (query) {
        const invIframe = document.createElement("iframe");
        invIframe.src = BLOBTOWN_URL + query;
        invIframe.style.width = "100%";
        invIframe.style.height = "100%";
        invIframe.style.border = "none";
        invIframe.style.background = "#fff";
        inventoryContainer.appendChild(invIframe);
      }
    }
  }

  function loadSite() {
    let url = document.getElementById("urlInput").value.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    browserIframe.src = url;
    document.cookie = "lastSite=" + url + "; path=/; max-age=31536000";
  }

  window.onload = function() {
    if (!query) {
      const cookieSite = document.cookie.split("; ").find(r => r.startsWith("lastSite="));
      if (cookieSite) browserIframe.src = cookieSite.split("=")[1];
      else browserIframe.src = "about:blank";
    } else {
      browserIframe.src = "about:blank";
    }
    browserIframe.style.display = "block";
  };
</script>

</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
