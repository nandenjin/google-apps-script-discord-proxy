# google-apps-script-discord-proxy

Enabling Google Apps Script to make HTTP requests to Discord API.

>[!CAUTION]
> Make sure to set authorization when you deploy this online.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port to listen on |
| `VERSION` | `0.0.0` | Version string used in User-Agent header |

## Example usage with Google Cloud Run

### Setup Google Cloud Run

- Build and deploy the proxy server to Google Cloud Run.
- **Make sure to set authorization when deploy.**

### Setup Google Apps Script

- **OAuth Scopes**: Following two scopes are required. Make sure to **set them manually** in `appsscript.json`, or `ScriptApp.getIdentityToken()` simply returns `null`.
  - `https://www.googleapis.com/auth/script.external_request`
  - `openid`
- **Headers**: Use `Authorization` for Cloud Run and `Discord-Authorization` for Discord API.
- **Set GCP project for GAS**: Open settings of Apps Script and set GCP project same as deployed server.

>[!IMPORTANT]
> Every time you add new script to project, you have to **re-deploy Cloud Run service in order to activate new OAuth client on it.**

## Sample Code

### appsscript.json
```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request",
    "openid"
  ]
}
```

### index.gs
```javascript
const discordToken = PropertiesService.getScriptProperties().getProperty("DISCORD_BOT_TOKEN");
const channelId = PropertiesService.getScriptProperties().getProperty("DISCORD_CHANNEL_ID");
const discordProxyHost = PropertiesService.getScriptProperties().getProperty("DISCORD_PROXY_HOST");

if (!discordToken) {
    throw new Error("DISCORD_BOT_TOKEN is not set.");
}

if (!channelId) {
    throw new Error("DISCORD_CHANNEL_ID is not set.");
}

if (!discordProxyHost) {
    throw new Error("DISCORD_PROXY_HOST is not set.");
}

const url = `https://${discordProxyHost}/v10/channels/${channelId}/messages`;

const idToken = ScriptApp.getIdentityToken();
if (!idToken) {
  throw new Error("Cannot get identity token.");
}
console.log(idToken);

const response = UrlFetchApp.fetch(url, {
  method: "get",
  headers: {
    Authorization: `Bearer ${idToken}`,
    "Discord-Authorization": `Bot ${discordToken}`,
  },
});
const messages = JSON.parse(response.getContentText());
console.log(messages);
```
