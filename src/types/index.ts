/**
 * Represents a parsed time with timezone
 */
export interface ParsedTime {
  /** The original time string that was parsed */
  originalString: string;
  /** The datetime object parsed from the string */
  dateTime: Date;
  /** The timezone identifier (e.g., 'America/Los_Angeles') */
  timezone: string;
  /** Whether the timezone was specified in the original string */
  hasTimezone: boolean;
}

/**
 * Result of a time conversion
 */
export interface TimeConversionResult {
  /** Whether the conversion was successful */
  success: boolean;
  /** Error message if conversion failed */
  error?: string;
  /** The original time string */
  originalTime?: string;
  /** The converted time in the user's timezone */
  convertedTime?: string;
  /** The user's timezone */
  userTimezone?: string;
}

/**
 * User timezone information
 */
export interface UserTimezone {
  /** The timezone identifier (e.g., 'America/Los_Angeles') */
  timezone: string;
  /** The timezone offset in seconds */
  offset: number;
} 