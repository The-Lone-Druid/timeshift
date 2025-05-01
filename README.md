# TimeShift: Slack Timezone Converter

A Slack app that helps users convert times across different timezones directly within Slack. Convert any time reference in a message to your local timezone with a simple right-click.

## Features

- Right-click on any message containing a time to convert it to your local timezone
- Supports various time formats (12/24 hour, with/without timezone)
- Recognizes timezone abbreviations from around the world (EST, PST, CET, IST, SGT, etc.)
- Shows results in a clean modal dialog
- No message data is stored - all conversions happen in real-time

## Setup Instructions

### 1. Create a Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**
2. Choose **From an app manifest** and select your workspace
3. Copy the contents of `slack-manifest.json` in this repo and paste it into the manifest editor
4. Click **Create**

### 2. Install the App to Your Workspace

1. After creating the app, click **Install to Workspace**
2. Review the permissions and click **Allow**

### 3. Set Up Environment Variables

1. From your Slack app page, go to **Basic Information**
2. Copy the **Signing Secret** under **App Credentials**
3. Go to **OAuth & Permissions** and copy your **Bot User OAuth Token**
4. Create a `.env` file with these values:
   ```
   SLACK_BOT_TOKEN=xoxb-your-token
   SLACK_SIGNING_SECRET=your-signing-secret
   ```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository to Vercel
3. Set the environment variables (SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET)
4. Deploy your app

### 5. Update Request URL

1. Get your Vercel deployment URL (e.g., https://timeshift.vercel.app)
2. In your Slack app settings, go to **Interactivity & Shortcuts**
3. Set the Request URL to `https://your-vercel-url.app/slack/events`
4. Add the same URL to **OAuth & Permissions** > **Redirect URLs** as `https://your-vercel-url.app/slack/oauth_redirect`
5. Save the changes

## Testing the App

1. In your Slack workspace, send a message like "Let's meet at 2:30 PM EST tomorrow"
2. Right-click on the message
3. Select **Convert to Local Time** from the shortcuts menu
4. A modal should appear showing the time converted to your local timezone

## Supported Time Formats

TimeShift recognizes a wide variety of time formats, including:

### 24-hour format with timezone

- `1400 CET`, `14:00 CET`, `14.00 CET`

### 12-hour format with timezone

- `2:00 PM EST`, `2 PM EST`, `2:00PM EST`, `2PM EST`

### Mixed formats within text

- "The meeting starts at 3:30 PM PST on Friday"
- "Daily standup at 0900 IST"
- "Let's connect at 15:45 GMT tomorrow"

See [USAGE.md](USAGE.md) for a complete guide to using TimeShift.

## Local Development

### Setting Up Local Environment

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Slack app credentials:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Testing Locally with cloudflared

To test your local development server with Slack:

1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
2. Start your app with `npm run dev`
3. In another terminal, run:
   ```
   cloudflared tunnel --url http://localhost:3000
   ```
4. Copy the cloudflared HTTPS URL and update your Slack app's Request URL to `https://your-cloudflared-url/slack/events`

## Project Structure

- `/api`: Serverless API functions for Vercel deployment
  - `/api/slack.ts`: Main handler for Slack events
  - `/api/health.ts`: Health check endpoint
  - `/api/test.ts`: Test endpoint for diagnostics
- `/src`: Source code
  - `/src/app.ts`: Main application entry point
  - `/src/utils`: Utility functions for time parsing and conversion
  - `/src/slack`: Slack API interaction components
  - `/src/types`: TypeScript type definitions
- `/public`: Landing page and static assets

## Troubleshooting

If the app isn't working:

1. Check Vercel logs for errors (Vercel Dashboard → Deployments → Latest → Function Logs)
2. Visit the `/test` endpoint on your deployment to verify environment variables are set
3. Verify that your Request URL is correct and responding with a 200 status
4. Make sure your Slack app has the necessary scopes:
   - `chat:write`
   - `commands`
   - `users:read`
   - `users:read.email`

See [USAGE.md](USAGE.md) for more troubleshooting tips.

## Technology Stack

- TypeScript
- Node.js
- Slack Bolt API
- Luxon (for time manipulation)
- Spacetime (for timezone resolution)
- Vercel (for deployment)

## Contributing

We welcome contributions to TimeShift! Whether you want to fix a bug, add a feature, or improve documentation, your help is appreciated. Please check out our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

### Ways to Contribute

- Report bugs and suggest features by opening issues
- Submit pull requests for bug fixes and new features
- Improve documentation
- Help with testing
- Share your ideas and feedback

## License

MIT
