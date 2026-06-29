# Credit Elite Boost — Browser Extension

A lightweight Chrome / Edge / Brave (Manifest V3) extension for
[cpncreditboost.com](https://cpncreditboost.com). It puts two things one click away:

1. **Credit Utilization Calculator** — enter your total balances and total
   credit limits to instantly see your utilization ratio, a color-coded
   rating, and a tip. Utilization is roughly 30% of a FICO score, so it's the
   fastest lever for boosting it. Your last entry is remembered locally.
2. **Quick links** — jump straight to the Tradeline Marketplace, Tradeline
   Calculator, Credit Repair, and the blog/guides on the main site.

Everything runs locally in the popup. No analytics, no external calls — the only
network activity is opening pages on `cpncreditboost.com` when you click a link.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | MV3 manifest (action popup, `storage` permission) |
| `popup.html` / `popup.css` / `popup.js` | The popup UI and logic |
| `icons/` | 16 / 48 / 128 px action icons |

## Load it locally (unpacked)

1. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Pin **Credit Elite Boost** from the puzzle-piece menu and click it to open the popup.

To reload after edits, hit the refresh icon on the extension card.

## Permissions

- `storage` — saves your last calculator inputs locally (`chrome.storage.local`).
- `host_permissions: https://cpncreditboost.com/*` — lets the links open the site.

## Package for the Chrome Web Store

Zip the contents of this folder (not the parent) so `manifest.json` is at the
root of the archive:

```sh
cd extension
zip -r ../credit-elite-boost-extension.zip . -x '*.DS_Store'
```

Then upload `credit-elite-boost-extension.zip` in the Chrome Web Store
Developer Dashboard. Bump `version` in `manifest.json` for each new upload.
