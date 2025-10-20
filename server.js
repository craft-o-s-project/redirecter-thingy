const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BLOBTOWN_URL = "https://app.blobtown.com/?blobt=";

// No-cache headers
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

app.get("/", (req, res) => {
  const query = req.query.q || "";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
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
#iframeContainer, #inventory, #traceImage { display: none; flex-direction: column; align-items: center; justify-content: center; background: #111; height: calc(100vh - 50px); }
iframe { width: 100%; height: calc(100vh - 50px); border: none; }
#uploadBox { display: none; margin-top: 20px; }
img { max-width: 100%; max-height: 100%; object-fit: contain; }
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

<div id="iframeContainer">
  <iframe id="browser" src="${query ? BLOBTOWN_URL + query : ''}" sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
</div>

<div id="inventory">
  <iframe id="inventoryIframe" src="${query ? BLOBTOWN_URL + query : ''}"></iframe>
</div>

<div id="traceImage">
  <button onclick="toggleUpload()">Toggle Image Upload</button>
  <div id="uploadBox">
    <input type="file" id="fileInput" accept="image/*"><br>
    <img id="uploadedImage" alt="">
  </div>
</div>

<button id="refreshBtn" onclick="fullRefresh()">⟳ Refresh</button>

<script>
const tabs = document.querySelectorAll(".tab");
const browserIframe = document.getElementById("browser");
const iframeContainer = document.getElementById("iframeContainer");
const inventoryDiv = document.getElementById("inventory");
const traceDiv = document.getElementById("traceImage");

function openTab(name) {
  tabs.forEach(t => t.classList.remove("active"));
  [iframeContainer, inventoryDiv, traceDiv].forEach(el => el.style.display = "none");

  if (name === "browser") {
    tabs[0].classList.add("active");
    iframeContainer.style.display = "flex";
  } else if (name === "inventory") {
    tabs[1].classList.add("active");
    inventoryDiv.style.display = "flex";
    document.getElementById("inventoryIframe").src = document.getElementById("inventoryIframe").src;
  } else if (name === "traceImage") {
    tabs[2].classList.add("active");
    traceDiv.style.display = "flex";
  }
}

function loadSite() {
  let url = document.getElementById("urlInput").value.trim();
  if (!url.startsWith("http")) url = "https://" + url;
  browserIframe.src = url;
  document.cookie = "lastSite=" + encodeURIComponent(url) + "; path=/; max-age=31536000";
}

function toggleUpload() {
  const box = document.getElementById("uploadBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

document.getElementById("fileInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById("uploadedImage").src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function fullRefresh() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  window.location.href = window.location.pathname + (q ? "?q=" + encodeURIComponent(q) : "");
}

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (!q) {
    const cookieSite = document.cookie.split("; ").find(c => c.trim().startsWith("lastSite="));
    if (cookieSite) browserIframe.src = decodeURIComponent(cookieSite.split("=")[1]);
  }
  openTab("browser"); // start on browser tab
};
</script>

</body>
</html>`);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
