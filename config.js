'use strict';

// Edit these lists to control which request headers are hidden from Discord.
// Matching is case-insensitive because HTTP header names are case-insensitive.
module.exports = {
  privacy: {
    // Full header-name matches.
    blockedHeaderNames: [

    ],

    // A header is also hidden when its name contains any term below.
    blockedHeaderTerms: [

    ],

    redactedText: '[redacted]',
  },

  limits: {
    maxBlobIdLength: 10000,
    maxHeaderValueLength: 30000,
    maxDiscordHeaderTextLength: 85000,
    requestsPerMinute: 30,
  },

  blobtownInventoryUrl: 'https://app.blobtown.com/inventory/',
};
