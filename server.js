'use strict';

const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const config = require('./config');

const app = express();
const port = Number(process.env.PORT) || 3000;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const ingestSecret = process.env.INGEST_SECRET;

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(rateLimit({
  windowMs: 60_000,
  limit: config.limits.requestsPerMinute,
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

  const value = typeof request.query._bt === 'string' ? request.query._bt.trim() : '';
  if (value.length > config.limits.maxBlobIdLength) {
    return response.status(400).json({
      error: `_bt cannot exceed ${config.limits.maxBlobIdLength} characters`,
    });
  }

  const safeHeaders = sanitizeHeaders(request.headers);
  const headerText = Object.entries(safeHeaders)
    .map(([name, headerValue]) => `${name}: ${headerValue}`)
    .join('\n') || '(none)';

  const message = buildDiscordMessage(value, headerText);

  try {
    const webhookResponse = await sendToDiscord(message);

    if (!webhookResponse.ok) {
      console.error(`Discord webhook returned HTTP ${webhookResponse.status}`);
      return response.status(502).json({ error: 'Discord rejected the message' });
    }

    return response.redirect(302, buildBlobtownUrl(value));
  } catch (error) {
    console.error('Discord webhook request failed:', error.message);
    return response.status(502).json({ error: 'Could not reach Discord' });
  }
});

function escapeDiscordCode(value) {
  return value.replaceAll('`', '\u02cb');
}

function sanitizeHeaders(headers) {
  const result = {};
  let totalLength = 0;

  for (const [name, rawValue] of Object.entries(headers).sort(([a], [b]) => a.localeCompare(b))) {
    const value = isBlockedHeader(name)
      ? config.privacy.redactedText
      : cleanHeaderValue(rawValue);
    const entryLength = name.length + value.length + 2;
    if (totalLength + entryLength > config.limits.maxDiscordHeaderTextLength) {
      result['additional-headers'] = '[omitted: Discord size limit]';
      break;
    }
    result[name] = value;
    totalLength += entryLength;
  }

  return result;
}

function isBlockedHeader(headerName) {
  const normalizedName = headerName.toLowerCase();
  const exactMatch = config.privacy.blockedHeaderNames.includes(normalizedName);
  const partialMatch = config.privacy.blockedHeaderTerms.some((term) =>
    normalizedName.includes(term.toLowerCase()));

  return exactMatch || partialMatch;
}

function cleanHeaderValue(value) {
  return String(value)
    .replace(/[\r\n]+/g, ' ')
    .slice(0, config.limits.maxHeaderValueLength);
}

function buildDiscordMessage(blobId, headerText) {
  return {
    username: 'Render Query Forwarder',
    embeds: [
      {
        title: 'New request',
        color: 0x5865f2,
        fields: [
          {
            name: '_bt',
            value: blobId ? `\`${escapeDiscordCode(blobId)}\`` : '(not provided)',
          },
          {
            name: 'Sanitized request headers',
            value: `\`\`\`text\n${escapeDiscordCode(headerText)}\n\`\`\``,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
    allowed_mentions: { parse: [] },
  };
}

function sendToDiscord(message) {
  return fetch(discordWebhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10_000),
  });
}

function buildBlobtownUrl(blobId) {
  const redirectUrl = new URL(config.blobtownInventoryUrl);
  redirectUrl.searchParams.set('_bt', blobId);
  return redirectUrl.toString();
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
