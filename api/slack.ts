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
    let { body, headers } = req;
    
    // Handle body parsing if needed
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Error parsing request body as JSON:', e);
      }
    }
    
    // Log the request for debugging
    console.log('Received Slack request with headers:', JSON.stringify(headers, null, 2));
    console.log('Request body:', typeof body, body ? JSON.stringify(body, null, 2) : 'null');
    
    // Direct handling for message_action payloads (shortcuts)
    if (body && body.payload && typeof body.payload === 'string') {
      try {
        const payload = JSON.parse(body.payload);
        console.log('Parsed payload:', JSON.stringify(payload, null, 2));
        
        if (payload.type === 'message_action' && payload.callback_id === 'convert_time') {
          console.log('Processing convert_time message action');
          
          try {
            // Get the user who triggered the shortcut
            const userId = payload.user.id;
            console.log('User ID:', userId);
            
            // Get the message text
            const messageText = payload.message?.text || '';
            console.log('Message text:', messageText);
            
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
            await app.client.views.open({
              token: process.env.SLACK_BOT_TOKEN,
              trigger_id: payload.trigger_id,
              view: modal
            });
            
            return res.status(200).json({ ok: true });
          } catch (error) {
            console.error('Error handling shortcut:', error);
            return res.status(200).json({ 
              ok: false, 
              error: 'Failed to process shortcut',
              details: (error as Error).message 
            });
          }
        }
      } catch (payloadError) {
        console.error('Error parsing payload:', payloadError);
      }
    }
    
    // Handle Slack URL verification challenge
    if (body && typeof body === 'object' && body.type === 'url_verification') {
      console.log('Received URL verification challenge');
      return res.status(200).json({ challenge: body.challenge });
    }
    
    // Use the Bolt receiver as fallback
    try {
      // Process the request with the Bolt app
      await receiver.start();
      console.log('Starting to process the Slack event');
      
      // Verify we have all required pieces
      if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
        console.error('Missing required environment variables');
        return res.status(500).json({ 
          error: 'Server configuration error', 
          details: 'Missing required Slack credentials' 
        });
      }
      
      try {
        const result = await receiver.toHandler()(body, {}, () => {});
        console.log('Successfully processed Slack event');
        return res.status(200).json(result || { ok: true });
      } catch (handlerError) {
        console.error('Handler error:', handlerError);
        throw handlerError;
      }
    } catch (error) {
      console.error('Error processing Slack event:', error);
      // Return a 200 OK to Slack even for errors to prevent retries
      return res.status(200).json({ 
        ok: false, 
        error: 'Failed to process Slack event', 
        details: (error as Error).message
      });
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