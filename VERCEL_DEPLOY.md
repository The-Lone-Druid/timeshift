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
- The `vercel.json` configuration file

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
5. Set the Request URL to `https://timeshift.vercel.app/slack/events`
6. Save the changes

## Testing Your Deployment

1. Go to your Slack workspace
2. Type a message with a time reference like "Meeting at 2:30 PM EST"
3. Right-click on the message and select "Convert to Local Time"
4. The TimeShift app should display a modal with the converted time

## Troubleshooting

If your deployment isn't working:

1. Check Vercel logs:
   - Go to your Vercel project
   - Click on "Deployments"
   - Select the latest deployment
   - View the Function Logs

2. Common issues:
   - Environment variables not set correctly
   - Incorrect Request URL in Slack app settings
   - Permission scopes not properly configured in Slack

## Benefits of Serverless Deployment

- Automatic scaling to handle any traffic load
- No server maintenance required
- Free tier sufficient for most Slack apps
- Quick deployments with GitHub integration 