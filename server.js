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
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mini Browser</title>
<style>
  body {
    font-family: sans-serif;
    background: #1a1a1a;
    color: #fff;
    margin: 0;
    overflow: hidden;
  }
  #navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2a2a2a;
    padding: 10px;
  }
  #tabs {
    display: flex;
    gap: 10px;
  }
  .tab {
    background: #3a3a3a;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
  }
  .tab.active {
    background: #0078ff;
  }
  #inventory {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #111;
    height: calc(100vh - 50px);
  }
  iframe {
    width: 100%;
    height: calc(100vh - 50px);
    border: none;
  }
  #uploadBox {
    display: none;
    margin-top: 20px;
  }
  img {
    max-width: 80%;
    max-height: 70vh;
    object-fit: contain;
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
  <div>
    <input type="text" id="urlInput" placeholder="Enter website..." style="width:200px; padding:5px;">
    <button onclick="loadSite()">Go</button>
  </div>
</div>

<iframe id="browser" src="https://duckduckgo.com" sandbox="allow-same-origin allow-scripts allow-forms"></iframe>

<div id="inventory">
  <h2>Inventory</h2>
  <button onclick="toggleUpload()">Toggle Image Upload</button>
  <div id="uploadBox">
    <input type="file" id="fileInput" accept="image/*">
    <br>
    <img id="uploadedImage" alt="">
  </div>
</div>

<button id="refreshBtn" onclick="window.location.reload(true)">⟳ Refresh</button>

<script>
  let currentTab = "browser";
  let iframe = document.getElementById("browser");

  function openTab(tabName) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("iframe, #inventory").forEach(el => el.style.display = "none");

    if (tabName === "inventory") {
      document.querySelector(`.tab:nth-child(2)`).classList.add("active");
      document.getElementById("inventory").style.display = "flex";
    } else {
      document.querySelector(`.tab:nth-child(1)`).classList.add("active");
      iframe.style.display = "block";
      iframe.src = iframe.src; // Fixes the white screen bug
    }
  }

  function loadSite() {
    const urlInput = document.getElementById("urlInput");
    let url = urlInput.value.trim();

    if (!url.startsWith("http")) url = "https://" + url;
    iframe.src = url;
    document.cookie = `lastSite=${url}; path=/; max-age=31536000`;
  }

  // Only load cookie if query is null
  window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (!query) {
      const cookieSite = document.cookie.split("; ").find(r => r.startsWith("lastSite="));
      if (cookieSite) iframe.src = cookieSite.split("=")[1];
    }
  };

  function toggleUpload() {
    const box = document.getElementById("uploadBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
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
</script>

</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
