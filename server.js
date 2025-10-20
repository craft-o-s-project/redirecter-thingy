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
<title>BlobTown Tabs + Custom URL + Image</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; background: #f0f0f0; }
  h1 { text-align: center; padding: 10px; margin: 0; }
  .tabs { display: flex; background: #ddd; }
  .tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; border-right: 1px solid #bbb; }
  .tab:last-child { border-right: none; }
  .tab.active { background: #fff; font-weight: bold; }
  .container { width: 90%; margin: 10px auto; height: 60vh; border: 2px solid #ccc; border-radius: 8px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; background: #fff; }
  iframe { width: 100%; height: 100%; border: none; }
  #uploadedImageContainer { display: none; width: 100%; height: 100%; align-items: center; justify-content: center; display: flex; }
  #uploadedImageContainer img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; }
  #customUrlBar { text-align: center; margin-top: 5px; }
  input[type="text"], input[type="file"] { padding: 6px; font-size: 14px; margin: 5px; }
  button { padding: 6px 12px; margin: 0 5px; }
</style>
</head>
<body>
<h1>hi this is my browser mod!</h1>

<div class="tabs">
  <div class="tab active" id="tab1">Inventory</div>
  <div class="tab" id="tab2">Custom URL</div>
  <div class="tab" id="tab3">Local Image</div>
</div>

<div id="customUrlBar">
  <input type="text" id="customUrl" placeholder="Enter website URL">
  <button id="goBtn">Go</button>
</div>

<div class="container">
  <iframe id="iframe1" src=""></iframe>
  <iframe id="iframe2" src="" style="display:none;"></iframe>
  <div id="uploadedImageContainer"></div>
</div>

<div style="text-align:center; margin-top:10px;">
  <input type="file" id="imageInput" accept="image/*">
</div>

<script>
const tab1 = document.getElementById("tab1");
const tab2 = document.getElementById("tab2");
const tab3 = document.getElementById("tab3");

const iframe1 = document.getElementById("iframe1");
const iframe2 = document.getElementById("iframe2");
const uploadedImageContainer = document.getElementById("uploadedImageContainer");

const customUrl = document.getElementById("customUrl");
const goBtn = document.getElementById("goBtn");
const imageInput = document.getElementById("imageInput");

function showTab(tab) {
  tab1.classList.remove("active");
  tab2.classList.remove("active");
  tab3.classList.remove("active");

  iframe1.style.display = "none";
  iframe2.style.display = "none";
  uploadedImageContainer.style.display = "none";

  if(tab === "tab1") {
    tab1.classList.add("active");
    iframe1.style.display = "block";
    iframe1.src = "${BUTTON1_URL}" + "${q}";
  } else if(tab === "tab2") {
    tab2.classList.add("active");
    iframe2.style.display = "block";
  } else if(tab === "tab3") {
    tab3.classList.add("active");
    uploadedImageContainer.style.display = "flex";
  }
}

// Tab click handlers
tab1.onclick = () => showTab("tab1");
tab2.onclick = () => showTab("tab2");
tab3.onclick = () => showTab("tab3");

// Custom URL Go button
goBtn.onclick = () => {
  let url = customUrl.value.trim();
  if(!url) return;
  if(!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  iframe2.src = url;
  showTab("tab2");
}

// Local image upload
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement("img");
    img.src = e.target.result;
    uploadedImageContainer.innerHTML = "";
    uploadedImageContainer.appendChild(img);
    showTab("tab3");
  };
  reader.readAsDataURL(file);
});
</script>

</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
