# Sample Messages for Testing TimeShift

Copy and paste these sample messages into your Slack workspace to test the TimeShift app functionality. Right-click on the time portion of any message and select "Convert to Local Time" from the context menu.

## 24-hour Format Examples

1. We need to schedule a call for 1400 CET tomorrow.
2. The deployment is scheduled for 0900 GMT on Friday.
3. Our Tokyo team will be online at 1630 JST.
4. Let's have a review meeting at 13:45 PST.

## 12-hour Format Examples

1. The presentation starts at 2:30 PM EST next Tuesday.
2. I'll be available starting 9AM PST tomorrow.
3. The system maintenance begins at 11:00 PM UTC.
4. We have a client call scheduled for 10:30 AM AEST.

## Edge Cases

1. Is 3PM CET good for everyone?
2. Let's start at 8 AM EST (that's 5AM for the west coast team).
3. 1400EST works for me, does that work for you?

## Expected Behavior

When testing, you should be able to:

1. Right-click on a time reference (like "1400 CET" or "2:30 PM EST")
2. Select "Convert to Local Time" from the context menu
3. See a modal displaying:
   - The original time as it appeared in the message
   - The converted time in your local timezone
   - Your current timezone setting
