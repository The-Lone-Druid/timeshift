import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req: any, res: any) {
  // Get the hostname from the request
  const host = req.headers.host || 'unknown';
  
  // Check if environment variables are set (don't show actual values for security)
  const botTokenSet = !!process.env.SLACK_BOT_TOKEN;
  const signingSecretSet = !!process.env.SLACK_SIGNING_SECRET;
  
  // Return environment and configuration info
  return res.status(200).json({
    status: 'ok',
    message: 'TimeShift API Test Page',
    timestamp: new Date().toISOString(),
    hostname: host,
    environment: {
      botTokenSet,
      signingSecretSet,
      node_env: process.env.NODE_ENV || 'not set'
    },
    requestInfo: {
      method: req.method,
      url: req.url,
      headersReceived: Object.keys(req.headers)
    }
  });
} 