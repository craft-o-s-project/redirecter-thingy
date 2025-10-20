// server.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BLOBTOWN_URL = "https://app.blobtown.com/?blobt=";

app.get("/", (req, res) => {
  const query = req.query.q || "";

  // Add full no-cache headers
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
  body { font-family: sans-serif; background: #1a1a1a; color: #fff; margin: 0; overflow: hidden; }
  #navbar { display: flex; justify-content: space-between; align-items: center; background: #2a2a2a; padding: 10px; }
  #tabs { display: flex; gap: 10px; }
  .tab { background: #3a3a3a; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
  .tab.active { background: #0078ff; }
  iframe { width: 100%; height: calc(100vh - 50px); border: none; display: none; }
  #inventory, #traceImage { display: none; flex-direction: column; align-items: center; justify-content: center; background: #111; height: calc(100vh - 50px); }
  #traceImage { background: #fff; color: #000; }
  img { max-width: 80%; max-height: 70vh; object-fit: contain; }
  #refreshBtn { position: fixed; bottom: 15px; right: 15px; background: #0078ff; border: none; border-radius: 8px; padding: 8px 12px; color: white; font-size: 14px; cursor: pointer; }
</style>
</head>
<body>

<div id="navbar">
  <div id="tabs">
    <div class="tab active" onclick="openTab('browser')">Browser</div>
    <div class="tab" onclick="openTab('inventory')">Inventory</div>
    <div class="tab" onclick="openTab('traceImage')">Trace Image</div>
  </div>
  <div>
    <input type="text" id="urlInput" placeholder="Enter website..." style="width:200px; padding:5px;">
    <button onclick="loadSite()">Go</button>
  </div>
</div>

<iframe id="browser"></iframe>
<div id="inventory">
  <iframe id="inventoryIframe"></iframe>
</div>
<div id="traceImage">
  <input type="file" id="fileInput" accept="image/*"><br>
  <img id="uploadedImage" alt="">
</div>

<button id="refreshBtn" onclick="location.reload(true)">⟳ Refresh</button>

<script>
  const BLOBTOWN_URL = "${BLOBTOWN_URL}";
  const query = "${query}";
  const browserIframe = document.getElementById("browser");
  const inventoryIframe = document.getElementById("inventoryIframe");

  function openTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("iframe, #inventory, #traceImage").forEach(el => el.style.display = "none");

    if (tab === "browser") {
      document.querySelector(".tab:nth-child(1)").classList.add("active");
      browserIframe.style.display = "block";
    } else if (tab === "inventory") {
      document.querySelector(".tab:nth-child(2)").classList.add("active");
      document.getElementById("inventory").style.display = "flex";
      inventoryIframe.src = BLOBTOWN_URL + query;
      inventoryIframe.style.display = "block";
    } else if (tab === "traceImage") {
      document.querySelector(".tab:nth-child(3)").classList.add("active");
      document.getElementById("traceImage").style.display = "flex";
    }
  }

  function loadSite() {
    let url = document.getElementById("urlInput").value.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    browserIframe.src = url;
    document.cookie = "lastSite=" + url + "; path=/; max-age=31536000";
  }

  document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById("uploadedImage");
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  window.onload = function() {
    if (!query) {
      const cookieSite = document.cookie.split("; ").find(r => r.startsWith("lastSite="));
      if (cookieSite) browserIframe.src = cookieSite.split("=")[1];
    } else {
      browserIframe.src = "about:blank";
    }
  };
</script>

</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
