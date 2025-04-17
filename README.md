# TimeShift

A Slack app that allows users to convert times in messages to their local timezone by right-clicking the time and selecting "Convert to Local Time" from the context menu.

## Features

- Convert time strings like "1400 CET" or "4:30 PM PST" to user's local timezone
- Display converted times in a Slack modal
- Support for various time formats and timezone abbreviations
- Handles edge cases like times without colons and ambiguous timezone abbreviations
- Comprehensive support for global timezones including Asian timezones (SGT, SST, HKT, etc.)
- Extracts time references from anywhere in the message, not just exact matches

## Technology Stack

- TypeScript
- Node.js
- Slack Bolt API
- Luxon (for time manipulation)
- Spacetime (for timezone resolution)

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your Slack app credentials:
   ```
   cp .env.example .env
   ```
4. Set the following environment variables in your `.env` file:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token (for Socket Mode)
   ```
5. Build the TypeScript code:
   ```
   npm run build
   ```
6. Start the server:
   ```
   npm start
   ```

For development, you can use:

```
npm run dev
```

## Slack App Configuration

1. Create a new Slack App at https://api.slack.com/apps
2. Under "OAuth & Permissions", add the following bot token scopes:
   - `users:read` (to get user timezone info)
   - `chat:write` (to send messages)
3. Install the app to your workspace
4. Navigate to "Interactivity & Shortcuts"
   - Enable Interactivity
   - Add a Message Shortcut with:
     - Name: "Convert to Local Time"
     - Short Description: "Convert the selected time to your local timezone"
     - Callback ID: `convert_time`
5. For Socket Mode:
   - Go to "Socket Mode" and enable it
   - Generate an App-Level Token with `connections:write` scope
   - Copy the token to your `.env` file as `SLACK_APP_TOKEN`
6. For HTTP Mode:
   - Disable Socket Mode
   - Set the Request URL to your server URL (e.g., https://timeshift.yourdomain.com/slack/events)
   - Copy the Bot User OAuth Token and Signing Secret to your `.env` file

## Supported Time Formats

The app can recognize and convert various time formats, including:

1. 24-hour format with timezone: `1400 CET`, `14:00 CET`
2. 12-hour format with timezone: `2:30 PM EST`, `2PM PST`
3. Times embedded in longer messages: "Let's meet at 3:00 PM SST tomorrow"

Supported timezone abbreviations include:
- North American: EST, EDT, CST, CDT, MST, MDT, PST, PDT, AST
- European: GMT, BST, CET, CEST, EET, EEST
- Asian/Oceanian: IST, JST, SGT, SST, HKT, PHT, MYT, WIB, KST
- And many others through the Spacetime library

## Local Development with ngrok

1. Install ngrok: https://ngrok.com/download
2. Start your app with `npm run dev`
3. In another terminal, run:
   ```
   ngrok http 3000
   ```
4. Copy the ngrok HTTPS URL and update your Slack app's Request URL

## Local Development with Cloudflare Tunnel

As an alternative to ngrok, you can use Cloudflare Tunnel for secure, persistent tunneling:

1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
2. Start your app with `npm run dev`
3. In another terminal, run:
   ```
   cloudflared tunnel --url http://localhost:3000
   ```
4. This creates a temporary tunnel with a public URL like `https://random-words.trycloudflare.com`
5. Copy the Cloudflare HTTPS URL and update your Slack app's Request URL

For persistent tunnels with custom domains, see the [Cloudflare Tunnel documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/).

## Project Structure

- `/src`: Source code
  - `/src/app.ts`: Main application entry point
  - `/src/utils`: Utility functions for time parsing and conversion
    - `/src/utils/timeParser.ts`: Logic for parsing and converting times
  - `/src/slack`: Slack API interaction components
    - `/src/slack/api.ts`: Functions for interacting with Slack's API
  - `/src/types`: TypeScript type definitions

## License

MIT
