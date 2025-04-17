import { App } from '@slack/bolt';
import { View } from '@slack/bolt';
import { UserTimezone, TimeConversionResult } from '../types';
import { parseTimeString, formatTime } from '../utils/timeParser';

/**
 * Fetches a user's timezone from Slack's users.info API
 * @param app The Slack app instance
 * @param userId The user ID to fetch timezone for
 * @returns The user's timezone information, or null if not found
 */
export async function getUserTimezone(app: App, userId: string): Promise<UserTimezone | null> {
  try {
    const result = await app.client.users.info({
      user: userId
    });
    
    if (result.ok && result.user && result.user.tz_offset) {
      return {
        timezone: result.user.tz || 'UTC',
        offset: result.user.tz_offset
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user timezone:', error);
    return null;
  }
}

/**
 * Converts a time string to the user's local timezone
 * @param text The text containing a time reference
 * @param userTimezone The user's timezone
 * @returns Result of the time conversion
 */
export function convertTimeToUserTimezone(text: string, userTimezone: UserTimezone | null): TimeConversionResult {
  console.log(`Converting time string: "${text}" for user timezone:`, userTimezone);
  
  if (!userTimezone) {
    console.log('No user timezone available');
    return {
      success: false,
      error: "Could not determine your timezone. Please make sure it's set in your Slack profile."
    };
  }
  
  const parsedTime = parseTimeString(text);
  
  if (!parsedTime) {
    console.log('Failed to parse time string');
    return {
      success: false,
      error: "Could not parse a valid time from the selected text. Please ensure it contains a time format like '1400 CET' or '2:30 PM PST'."
    };
  }
  
  try {
    console.log(`Converting parsed time:`, parsedTime);
    const convertedTime = formatTime(parsedTime, userTimezone.timezone);
    console.log(`Converted time: ${convertedTime}`);
    
    return {
      success: true,
      originalTime: parsedTime.originalString,
      convertedTime,
      userTimezone: userTimezone.timezone
    };
  } catch (error) {
    console.error('Error converting time:', error);
    return {
      success: false,
      error: "Error converting the time. Please try again with a different format."
    };
  }
}

/**
 * Builds a modal view to display the time conversion result
 * @param result The time conversion result
 * @returns A Slack view object for the modal
 */
export function buildTimeConversionModal(result: TimeConversionResult): View {
  console.log('Building modal with result:', result);
  
  if (!result.success) {
    return {
      type: 'modal' as const,
      title: {
        type: 'plain_text' as const,
        text: 'Time Conversion Error',
        emoji: true
      },
      close: {
        type: 'plain_text' as const,
        text: 'Close',
        emoji: true
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn' as const,
            text: `:warning: ${result.error}`
          }
        }
      ]
    };
  }
  
  return {
    type: 'modal' as const,
    callback_id: 'time_conversion_modal',
    title: {
      type: 'plain_text' as const,
      text: 'Time Conversion',
      emoji: true
    },
    close: {
      type: 'plain_text' as const,
      text: 'Close',
      emoji: true
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn' as const,
          text: `*Original Time:* ${result.originalTime}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn' as const,
          text: `*Your Local Time:* ${result.convertedTime}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn' as const,
            text: `Your timezone is set to: ${result.userTimezone}`
          }
        ]
      }
    ]
  };
} 