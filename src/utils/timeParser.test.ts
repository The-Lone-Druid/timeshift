import { parseTimeString, convertTime, formatTime } from './timeParser';

describe('timeParser utilities', () => {
  describe('parseTimeString', () => {
    it('should parse 24-hour format with timezone', () => {
      const result = parseTimeString('Meeting at 1400 CET');
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.originalString).toBe('1400 CET');
        expect(result.timezone).toBe('Europe/Paris');
        expect(result.hasTimezone).toBe(true);
      }
    });
    
    it('should parse 24-hour format with colon and timezone', () => {
      const result = parseTimeString('Call scheduled for 14:00 PST');
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.originalString).toBe('14:00 PST');
        expect(result.timezone).toBe('America/Los_Angeles');
        expect(result.hasTimezone).toBe(true);
      }
    });
    
    it('should parse 12-hour format with AM/PM and timezone', () => {
      const result = parseTimeString('Meeting tomorrow at 2:30 PM EST');
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.originalString).toBe('2:30 PM EST');
        expect(result.timezone).toBe('America/New_York');
        expect(result.hasTimezone).toBe(true);
      }
    });
    
    it('should parse 12-hour format without colon', () => {
      const result = parseTimeString('Call at 9AM PST');
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.originalString).toBe('9AM PST');
        expect(result.timezone).toBe('America/Los_Angeles');
        expect(result.hasTimezone).toBe(true);
      }
    });
    
    it('should return null for text without time information', () => {
      const result = parseTimeString('Let\'s have a meeting soon');
      
      expect(result).toBeNull();
    });
    
    it('should return null for text with unrecognized timezone', () => {
      const result = parseTimeString('Call at 14:00 XYZ');
      
      expect(result).toBeNull();
    });
  });
  
  describe('formatTime', () => {
    it('should format time correctly for display', () => {
      const parsedTime = parseTimeString('1400 CET');
      
      if (parsedTime) {
        const formatted = formatTime(parsedTime, 'America/New_York');
        
        // The exact string will depend on the date the test is run,
        // so we just check that it includes expected format elements
        expect(formatted).toContain(':00');
        expect(formatted).toContain('(America/New_York)');
      }
    });
  });
}); 