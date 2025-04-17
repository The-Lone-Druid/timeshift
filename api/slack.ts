import { App, AwsLambdaReceiver } from '@slack/bolt';
import dotenv from 'dotenv';
import { getUserTimezone, convertTimeToUserTimezone, buildTimeConversionModal } from '../src/slack/api';

// Load environment variables
dotenv.config();

// Initialize the receiver
const receiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

// Initialize the app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver,
  processBeforeResponse: true
});

// Interface for the message action payload
interface MessageActionPayload {
  trigger_id: string;
  user: {
    id: string;
  };
  message: {
    text: string;
  };
  callback_id: string;
}

// Listen for the "Convert to Local Time" message action
app.shortcut('convert_time', async ({ ack, shortcut, client, logger }) => {
  console.log('Received convert_time shortcut');
  // Acknowledge the action request immediately
  await ack();
  console.log('Acknowledged shortcut');
  
  try {
    console.log('Shortcut payload:', JSON.stringify(shortcut, null, 2));
    
    // Get the message text if this is a message shortcut
    let messageText = '';
    
    // Check if this is a message shortcut (has message property)
    if ('message' in shortcut && shortcut.message) {
      messageText = shortcut.message.text || '';
    }
    
    console.log('Message text:', messageText);
    
    // Get the user who triggered the shortcut
    const userId = shortcut.user.id;
    console.log('User ID:', userId);
    
    // Fetch the user's timezone from Slack API
    const userTimezone = await getUserTimezone(app, userId);
    console.log('User timezone:', userTimezone);
    
    // Convert the selected time to user's timezone
    const conversionResult = convertTimeToUserTimezone(messageText, userTimezone);
    console.log('Conversion result:', conversionResult);
    
    // Build the modal with conversion result
    const modal = buildTimeConversionModal(conversionResult);
    console.log('Modal view to open:', JSON.stringify(modal, null, 2));
    
    // Show the modal with conversion result
    console.log('Opening modal view with trigger_id:', shortcut.trigger_id);
    const viewResponse = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: modal
    });
    
    console.log('Modal view opened with response:', JSON.stringify(viewResponse, null, 2));
    
    if (!viewResponse.ok) {
      console.error('Error opening view:', viewResponse.error);
    }
  } catch (error) {
    console.error('Error handling convert_time shortcut:', error);
    
    try {
      // Show an error modal
      const errorModal = buildTimeConversionModal({
        success: false,
        error: 'An unexpected error occurred. Please try again later.'
      });
      
      console.log('Opening error modal with trigger_id:', shortcut.trigger_id);
      const viewResponse = await client.views.open({
        trigger_id: shortcut.trigger_id,
        view: errorModal
      });
      
      if (!viewResponse.ok) {
        console.error('Error opening error view:', viewResponse.error);
      }
    } catch (modalError) {
      console.error('Error showing error modal:', modalError);
    }
  }
});

// Error handler
app.error(async (error) => {
  console.error('Global error handler:', error);
});

// Handler for serverless function
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    // Process the Slack request
    const { body, headers } = req;
    
    // Log the request for debugging
    console.log('Received Slack request with headers:', JSON.stringify(headers, null, 2));
    
    try {
      // Process the request with the Bolt app
      await receiver.start();
      console.log('Starting to process the Slack event');
      const result = await receiver.toHandler()(body, {}, () => {});
      console.log('Successfully processed Slack event');
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error processing Slack event:', error);
      return res.status(500).json({ error: 'Failed to process Slack event', details: (error as Error).message });
    }
  } else if (req.method === 'GET') {
    // Handle GET request - can be used for health checks or OAuth redirect
    if (req.url?.includes('oauth')) {
      // This would handle OAuth redirects if needed
      return res.status(200).json({ status: 'ok', message: 'OAuth flow not implemented yet' });
    }
    // Basic health check
    return res.status(200).json({ status: 'ok', message: 'TimeShift API is running', timestamp: new Date().toISOString() });
  } else {
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 