# Render Discord Query Forwarder

This Node.js service sends an optional Blobtown `_bt` blob/file ID and sanitized request headers to a Discord webhook as an embed, then redirects the browser to the matching Blobtown inventory URL.

Only use it to collect values that users have knowingly agreed to submit. Do not use it to collect credentials, session tokens, or other secrets.

## Run locally

Requires Node.js 20 or newer.

```powershell
npm install
$env:DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/...'
$env:INGEST_SECRET='choose-a-long-random-value'
npm start
```

Then call it with:

```powershell
curl.exe -H "x-ingest-secret: choose-a-long-random-value" "http://localhost:3000/collect?_bt=hello"
```

A successful request redirects to `https://app.blobtown.com/inventory/?_bt=...`.

## Deploy to Render

1. Push these files to a GitHub or GitLab repository.
2. In Render, create a **Blueprint** and select the repository. Render will read `render.yaml`.
3. Enter your Discord webhook URL when Render asks for `DISCORD_WEBHOOK_URL`.
4. Call `https://YOUR-SERVICE.onrender.com/collect?_bt=hello`.

For a private collector, add an `INGEST_SECRET` environment variable in Render and include the same value in the `x-ingest-secret` request header. If `INGEST_SECRET` is unset, the endpoint accepts requests without that header.

The webhook URL stays server-side. Authentication, cookie, token, key, session, credential, signature, referrer, and client-IP headers are redacted. Header values and total output are capped to fit Discord safely. The redirect destination is fixed to Blobtown, mention parsing is disabled, `_bt` is limited to 1,000 characters, and requests are rate-limited per client IP.

## Customize it

Open `config.js` to edit the header blacklist, size limits, rate limit, or fixed Blobtown destination. Add full header names to `blockedHeaderNames`, or add reusable fragments such as `token` to `blockedHeaderTerms`. Do not remove the authentication, cookie, or credential protections.
