import { DateTime } from 'luxon';
import spacetime from 'spacetime';
import { ParsedTime } from '../types';

// Explicit mapping for timezone abbreviations that might not be well-supported
const TIMEZONE_MAPPING: Record<string, string> = {
  // Asia Pacific
  'SGT': 'Asia/Singapore',  // Singapore Time
  'SST': 'Asia/Singapore',  // Singapore Standard Time
  'HKT': 'Asia/Hong_Kong',  // Hong Kong Time
  'PHT': 'Asia/Manila',     // Philippine Time
  'MYT': 'Asia/Kuala_Lumpur', // Malaysia Time
  'WIB': 'Asia/Jakarta',    // Western Indonesian Time
  'KST': 'Asia/Seoul',      // Korean Standard Time
  // India/Middle East
  'IST': 'Asia/Kolkata',    // Indian Standard Time
  'GST': 'Asia/Dubai',      // Gulf Standard Time
  // Others that might be problematic
  'CST': 'America/Chicago', // Central Standard Time (could be China Standard Time too)
  'EST': 'America/New_York', // Eastern Standard Time
  'MST': 'America/Denver',  // Mountain Standard Time
  'PST': 'America/Los_Angeles', // Pacific Standard Time
  'AST': 'America/Halifax', // Atlantic Standard Time
};

/**
 * Try to resolve a timezone abbreviation to an IANA timezone identifier
 */
function resolveTimezone(timezoneAbbr: string): string | null {
  console.log(`Attempting to resolve timezone: ${timezoneAbbr}`);
  
  // Check our explicit mapping first
  const upperAbbr = timezoneAbbr.toUpperCase();
  if (TIMEZONE_MAPPING[upperAbbr]) {
    console.log(`Found explicit mapping for ${timezoneAbbr}: ${TIMEZONE_MAPPING[upperAbbr]}`);
    return TIMEZONE_MAPPING[upperAbbr];
  }
  
  // Try using spacetime
  try {
    const now = new Date();
    const s = spacetime(now);
    const withTz = s.goto(timezoneAbbr);
    const timezone = withTz.timezone().name;
    
    // Check if we got a valid timezone
    if (!timezone || timezone === 'etc/UTC') {
      console.log(`Spacetime couldn't resolve ${timezoneAbbr} to a specific timezone`);
      return null;
    }
    
    console.log(`Spacetime resolved ${timezoneAbbr} to ${timezone}`);
    return timezone;
  } catch (error) {
    console.error(`Error resolving timezone ${timezoneAbbr}:`, error);
    return null;
  }
}

/**
 * Regular expressions for matching different time formats
 */
const TIME_PATTERNS = [
  // 24-hour format with possible timezone: 1400 CET, 14:00 CET
  {
    regex: /\b([01]?\d|2[0-3])[:.]?([0-5]\d)\s*([A-Z]{1,5})\b/i,
    parse: (match: RegExpMatchArray): ParsedTime | null => {
      const [, hours, minutes, timezoneAbbr] = match;

      try {
        // Try to resolve the timezone
        const timezone = resolveTimezone(timezoneAbbr);
        
        if (!timezone) {
          console.log(`Timezone abbreviation not recognized: ${timezoneAbbr}`);
          return null;
        }
        
        // Set the time in the correct timezone
        const now = new Date();
        const st = spacetime({
          hour: parseInt(hours, 10),
          minute: parseInt(minutes, 10),
          date: now.getDate(),
          month: now.getMonth(),
          year: now.getFullYear()
        }, timezone);
        
        return {
          originalString: match[0],
          dateTime: st.toNativeDate(),
          timezone,
          hasTimezone: true
        };
      } catch (error) {
        console.error(`Error parsing time with timezone ${timezoneAbbr}:`, error);
        return null;
      }
    }
  },
  
  // 12-hour format with AM/PM and possible timezone: 2:00 PM PST, 2PM PST
  {
    regex: /\b(1[0-2]|0?[1-9])[:.]?([0-5]\d)?\s*(am|pm)\s*([A-Z]{1,5})?\b/i,
    parse: (match: RegExpMatchArray): ParsedTime | null => {
      const [, hours, minutes = '00', ampm, timezoneAbbr] = match;
      
      try {
        const isPM = ampm.toLowerCase() === 'pm';
        const hour = parseInt(hours, 10);
        const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
        
        // Default to UTC if no timezone specified
        let timezone = 'UTC';
        
        if (timezoneAbbr) {
          // Try to resolve the timezone
          const resolvedTz = resolveTimezone(timezoneAbbr);
          
          if (!resolvedTz) {
            console.log(`Timezone abbreviation not recognized: ${timezoneAbbr}`);
            return null;
          }
          
          timezone = resolvedTz;
        }
        
        // Set the time in the correct timezone
        const now = new Date();
        const st = spacetime({
          hour: hour24,
          minute: parseInt(minutes, 10),
          date: now.getDate(),
          month: now.getMonth(),
          year: now.getFullYear()
        }, timezone);
        
        return {
          originalString: match[0],
          dateTime: st.toNativeDate(),
          timezone,
          hasTimezone: !!timezoneAbbr
        };
      } catch (error) {
        console.error(`Error parsing time with AM/PM and timezone:`, error);
        return null;
      }
    }
  }
];

/**
 * Extracts and parses time references from a message
 * @param text The full message text
 * @returns A ParsedTime object if successful, null otherwise
 */
export function parseTimeString(text: string): ParsedTime | null {
  console.log(`Attempting to parse time string: "${text}"`);
  
  // Try each pattern until one matches
  for (const pattern of TIME_PATTERNS) {
    // Check the entire text for any matches of the pattern
    const matches = text.match(new RegExp(pattern.regex, 'gi'));
    console.log(`Pattern ${pattern.regex} matches:`, matches);
    
    if (matches && matches.length > 0) {
      // Get the first match (usually the most relevant time in the message)
      const firstMatch = matches[0];
      
      // Get the capture groups from the match
      const groupMatch = new RegExp(pattern.regex, 'i').exec(firstMatch);
      
      if (groupMatch) {
        console.log(`Match groups:`, groupMatch);
        
        const result = pattern.parse(groupMatch);
        
        if (result) {
          console.log(`Successfully parsed time: ${JSON.stringify(result)}`);
          return result;
        } else {
          console.log(`Pattern matched but parsing failed`);
        }
      }
    }
  }
  
  console.log(`Failed to parse time string: "${text}"`);
  return null;
}

/**
 * Convert a time to a different timezone
 * @param time The parsed time to convert
 * @param targetTimezone The timezone to convert to
 * @returns A formatted string representation of the time in the target timezone
 */
export function convertTime(time: ParsedTime, targetTimezone: string): string {
  const dt = DateTime.fromJSDate(time.dateTime, { zone: time.timezone });
  const converted = dt.setZone(targetTimezone);
  
  return converted.toLocaleString(DateTime.DATETIME_FULL);
}

/**
 * Format a parsed time for display in the UI
 * @param time The parsed time
 * @param timezone The timezone to display in
 * @returns A formatted string
 */
export function formatTime(time: ParsedTime, timezone: string): string {
  const dt = DateTime.fromJSDate(time.dateTime, { zone: time.timezone });
  const converted = dt.setZone(timezone);
  
  return `${converted.toLocaleString(DateTime.TIME_SIMPLE)} ${converted.toFormat('ZZZZ')} (${converted.zoneName})`;
} 