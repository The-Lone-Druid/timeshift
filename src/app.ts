import { App, BlockAction } from '@slack/bolt';
import dotenv from 'dotenv';
import { getUserTimezone, convertTimeToUserTimezone, buildTimeConversionModal } from './slack/api';

// Load environment variables
dotenv.config();

// Initialize the Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Using Socket Mode
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Log all incoming requests
app.use(async ({ logger, body, next }) => {
  console.log('Received request with body:', JSON.stringify(body, null, 2));
  await next();
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

// Also listen for message action at the app level (backup)
app.action('convert_time', async ({ ack, body, client, logger }) => {
  console.log('Received convert_time action (deprecated)');
  await ack();
  console.log('Acknowledged action');
  console.log('Action payload:', JSON.stringify(body, null, 2));
});

// Error handler
app.error(async (error) => {
  console.error('Global error handler:', error);
});

// Start the app
(async () => {
  await app.start();
  console.log(`⚡️ TimeShift app is running with Socket Mode!`);
  console.log(`Bot Token: ${process.env.SLACK_BOT_TOKEN ? 'Set' : 'Not Set'}`);
  console.log(`App Token: ${process.env.SLACK_APP_TOKEN ? 'Set' : 'Not Set'}`);
  console.log(`Signing Secret: ${process.env.SLACK_SIGNING_SECRET ? 'Set' : 'Not Set'}`);
})();

export default app; 