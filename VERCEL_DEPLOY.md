# Deploying TimeShift to Vercel

This guide explains how to deploy the TimeShift Slack app to Vercel's serverless platform.

## Prerequisites

1. A GitHub account with your TimeShift code repository
2. A Vercel account (sign up at https://vercel.com)
3. Your Slack app credentials:
   - SLACK_BOT_TOKEN
   - SLACK_SIGNING_SECRET

## Deployment Steps

### 1. Push Your Code to GitHub

Ensure your code is pushed to a GitHub repository, including:

- The `api/slack.ts` serverless handler
- The `api/health.ts` and `api/test.ts` utility endpoints
- The `vercel.json` configuration file
- The `public` directory with landing page assets

### 2. Connect Vercel to Your GitHub Repository

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Select the TimeShift repository

### 3. Configure the Project

1. In the configuration screen:

   - Framework Preset: Leave as "Other"
   - Build Command: `npm run build`
   - Output Directory: Leave default
   - Install Command: `npm install`
2. Add environment variables:

   - SLACK_BOT_TOKEN: Your Slack bot token (xoxb-...)
   - SLACK_SIGNING_SECRET: Your Slack signing secret
3. Click "Deploy"

### 4. Update Your Slack App Configuration

1. Wait for the deployment to complete
2. Copy your Vercel deployment URL (e.g., https://timeshift.vercel.app)
3. Go to your Slack App configuration at https://api.slack.com/apps
4. Navigate to "Interactivity & Shortcuts"
5. Set the Request URL to `https://your-vercel-url.app/slack/events`
6. Navigate to "OAuth & Permissions"
7. Add a Redirect URL: `https://your-vercel-url.app/slack/oauth_redirect`
8. Save the changes

## Testing Your Deployment

1. Visit `https://your-vercel-url.app/test` to verify your deployment and environment variables
2. Go to your Slack workspace
3. Type a message with a time reference like "Meeting at 2:30 PM EST"
4. Right-click on the message and select "Convert to Local Time"
5. The TimeShift app should display a modal with the converted time

## Troubleshooting

If your deployment isn't working:

1. Check Vercel logs:

   - Go to your Vercel project
   - Click on "Deployments"
   - Select the latest deployment
   - View the Function Logs
2. Visit the test endpoints:

   - `/health`: Should return a simple health check response
   - `/test`: Shows information about your environment variables (without revealing sensitive data)
3. Common issues:

   - Environment variables not set correctly
   - Incorrect Request URL in Slack app settings
   - Permission scopes not properly configured in Slack
   - Missing OAuth redirect URL

## Benefits of Serverless Deployment

- Automatic scaling to handle any traffic load
- No server maintenance required
- Free tier sufficient for most Slack apps
- Quick deployments with GitHub integration
- Landing page served from the same domain
