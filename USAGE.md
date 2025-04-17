# TimeShift Usage Guide

Welcome to TimeShift, the seamless timezone conversion tool for Slack! This guide will walk you through everything you need to know to start using TimeShift effectively in your workspace.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Converting Time References](#converting-time-references)
3. [Supported Time Formats](#supported-time-formats)
4. [Supported Timezones](#supported-timezones)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

## Getting Started

TimeShift is already installed in your Slack workspace and ready to use. There's no configuration needed on your part - the app will automatically detect your timezone based on your Slack profile settings.

**To verify your timezone settings in Slack:**

1. Click on your profile picture in the top-right corner of Slack
2. Select "Edit profile"
3. Check that your timezone is set correctly
4. Click "Save changes" if you made any updates

## Converting Time References

TimeShift works with any message that contains a time reference. Here's how to use it:

1. Find a message in any channel that contains a time reference (e.g., "Let's meet at 3:00 PM EST tomorrow")
2. Right-click on the message to open the context menu
3. Select "Convert to Local Time" from the shortcuts menu
4. A modal will appear showing the original time and the converted time in your local timezone

The conversion happens instantly, and only you can see the result - it doesn't change the original message or notify other users.

## Supported Time Formats

TimeShift recognizes a wide variety of time formats, including:

### 24-hour format with timezone
- `1400 CET`
- `14:00 CET`
- `14.00 CET`

### 12-hour format with timezone
- `2:00 PM EST`
- `2 PM EST`
- `2:00PM EST`
- `2PM EST`

### Mixed formats within text
TimeShift can identify time references embedded within longer messages, such as:
- "The meeting starts at 3:30 PM PST on Friday"
- "Daily standup at 0900 IST"
- "Let's connect at 15:45 GMT tomorrow"

## Supported Timezones

TimeShift supports a comprehensive list of timezone abbreviations from around the world, including:

### North America
- EST (Eastern Standard Time)
- EDT (Eastern Daylight Time)
- CST (Central Standard Time)
- CDT (Central Daylight Time)
- MST (Mountain Standard Time)
- MDT (Mountain Daylight Time)
- PST (Pacific Standard Time)
- PDT (Pacific Daylight Time)
- AST (Atlantic Standard Time)

### Europe
- GMT (Greenwich Mean Time)
- BST (British Summer Time)
- CET (Central European Time)
- CEST (Central European Summer Time)
- EET (Eastern European Time)
- EEST (Eastern European Summer Time)

### Asia/Pacific
- IST (Indian Standard Time)
- SGT (Singapore Time)
- SST (Singapore Standard Time)
- HKT (Hong Kong Time)
- JST (Japan Standard Time)
- KST (Korean Standard Time)
- PHT (Philippine Time)
- MYT (Malaysia Time)
- WIB (Western Indonesian Time)

And many others. If you're using a common timezone abbreviation, TimeShift should be able to recognize and convert it.

## Troubleshooting

### Time Not Being Detected

If TimeShift doesn't detect the time in your message, try these solutions:

1. **Format your time more clearly**: Ensure there's a space between the time and the timezone abbreviation (e.g., "3:00 PM EST" rather than "3:00PM EST")
2. **Use a recognized timezone abbreviation**: Use standard abbreviations like EST, PST, CET, etc.
3. **Include both time and timezone**: Make sure both the time and timezone are specified

### Incorrect Conversion

If you believe the conversion is incorrect:

1. **Verify your Slack profile timezone**: Make sure your timezone is set correctly in your Slack profile
2. **Check for ambiguous timezone abbreviations**: Some abbreviations like "CST" could refer to different timezones (Central Standard Time or China Standard Time)
3. **Consider Daylight Saving Time**: Be aware that during transition periods, timezone calculations can be tricky

### Other Issues

If you're experiencing other issues:

1. Try refreshing your Slack application
2. Check if your Slack app is up to date
3. Contact your workspace administrator if problems persist

## FAQ

**Q: Does TimeShift store or track the messages I convert?**
A: No. TimeShift performs the conversion in real-time and doesn't store any message content or conversion history.

**Q: Can other people see when I use TimeShift on a message?**
A: No, the conversion is only visible to you. Other users won't be notified when you use TimeShift.

**Q: Do I need to install TimeShift on my device?**
A: No, TimeShift is a Slack app that runs in the cloud. Once it's added to your workspace, it's available to all members without any installation on individual devices.

**Q: Can I use TimeShift in direct messages and private channels?**
A: Yes, TimeShift works in all Slack conversations, including direct messages, group DMs, private channels, and public channels.

**Q: Is there a limit to how many times I can use TimeShift?**
A: No, you can use TimeShift as frequently as needed without any limits.

**Q: Can TimeShift convert dates as well as times?**
A: Currently, TimeShift focuses on time conversion only. Date references are maintained as they are in the original message.

---

For additional support or to provide feedback, please contact your workspace administrator or reach out to us at [support@timeshift.app](mailto:support@timeshift.app). 