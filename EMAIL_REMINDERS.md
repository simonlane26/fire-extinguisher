# Email Reminder System

Automated email notifications for upcoming inspections and maintenance schedules.

## Features

- **Automated Inspection Reminders**: Emails sent 30, 14, 7, and 1 days before inspection due date
- **Maintenance Reminders**: Emails sent 60, 30, 14, and 7 days before maintenance due date
- **Beautiful HTML Templates**: Professional, branded emails with color-coded urgency
- **Smart Recipient Selection**: Automatically sent to admins and managers for each tenant
- **Scheduled Execution**: Runs daily at 9:00 AM (inspections) and 9:30 AM (maintenance)

## Setup

### 1. Configure SMTP Settings

Add the following to your `.env` file:

```env
# Gmail Example (Recommended for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Fire Safety System <noreply@yourcompany.com>"

# Frontend URL (for email links)
FRONTEND_URL=https://yourdomain.com
```

### 2. Gmail App Password Setup

If using Gmail:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

### 3. Alternative SMTP Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgunorg
SMTP_PASS=your-mailgun-password
```

#### AWS SES
```env
SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## Email Templates

### Inspection Reminder Email

**Sent when**: 30, 14, 7, or 1 days before `nextInspection` date

**Sent to**: All active admin and manager users for the tenant

**Email content**:
- Fire safety header with company branding
- Urgency badge (color-coded)
- Extinguisher details (ID, location, building, due date)
- Call-to-action button linking to dashboard
- Professional footer

### Maintenance Reminder Email

**Sent when**: 60, 30, 14, or 7 days before `nextMaintenance` date

**Sent to**: All active admin and manager users for the tenant

**Email content**:
- Maintenance header (orange themed)
- Urgency badge (color-coded)
- Extinguisher details
- CTA button to dashboard
- Company footer

## Schedule

The reminder system runs automatically via cron jobs:

| Task | Schedule | Cron Expression | Description |
|------|----------|-----------------|-------------|
| Inspection Reminders | Daily at 9:00 AM | `0 9 * * *` | Checks for upcoming inspections |
| Maintenance Reminders | Daily at 9:30 AM | `30 9 * * *` | Checks for upcoming maintenance |

## Urgency Levels

Emails are color-coded based on how soon the task is due:

| Days Until Due | Urgency | Color | Subject Prefix |
|----------------|---------|-------|----------------|
| ≤ 7 days | **URGENT** | 🔴 Red (#ef4444) | "URGENT:" |
| 8-14 days | **Important** | 🟠 Orange (#f59e0b) | "Important:" |
| ≥ 15 days | **Upcoming** | 🔵 Blue (#3b82f6) | "Upcoming:" |

## Testing

### Option 1: Wait for Scheduled Run

Reminders will automatically run at 9:00 AM and 9:30 AM daily.

### Option 2: Manual Trigger (Coming Soon)

We can add an API endpoint to manually trigger reminders for testing:

```bash
# Trigger inspection reminders manually
curl -X POST http://localhost:3000/api/v1/reminders/trigger-inspections \
  -H "Authorization: Bearer YOUR_TOKEN"

# Trigger maintenance reminders manually
curl -X POST http://localhost:3000/api/v1/reminders/trigger-maintenance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 3: Create Test Data

Add extinguishers with `nextInspection` dates set to exactly 7, 14, or 30 days from today to test the email delivery.

## Logs

The reminder system logs all activity:

```
🔍 Checking for inspection reminders...
📋 Found 5 extinguishers with upcoming inspections
📧 Sent inspection reminder for FE001 (Main Lobby) - 7 days until due
✅ Inspection reminder check complete. Sent 12 emails.
```

To view logs:
```bash
# In development
npm run backend

# In production
pm2 logs fire-extinguisher-backend
```

## Troubleshooting

### Emails not being sent

**Check 1**: Verify SMTP configuration
```bash
# In your .env file, ensure all SMTP_* variables are set
grep SMTP .env
```

**Check 2**: Check server logs for errors
```
❌ Failed to send email: Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Check 3**: Test SMTP connection
If using Gmail, ensure:
- 2-Step Verification is enabled
- App Password is generated (not your regular password)
- "Less secure app access" is NOT needed with App Passwords

### Emails going to spam

- Configure SPF records for your domain
- Set up DKIM signing
- Use a reputable SMTP provider (SendGrid, Mailgun, AWS SES)
- Avoid spam trigger words in subject lines

### Wrong recipients

The system sends emails to all users with `role` = 'admin' or 'manager' and `status` = 'active'.

To change recipient logic, edit:
```typescript
// src/scheduler/reminder.scheduler.ts
users: {
  where: {
    status: 'active',
    role: {
      in: ['admin', 'manager'], // Modify this array
    },
  },
}
```

## Customization

### Change Email Templates

Edit `src/email/email.service.ts`:

```typescript
// Modify the HTML in sendInspectionReminder()
// Modify the HTML in sendMaintenanceReminder()
```

### Change Reminder Schedule

Edit `src/scheduler/reminder.scheduler.ts`:

```typescript
// Change from 9:00 AM to 8:00 AM
@Cron('0 8 * * *')
async checkInspectionReminders() {
  // ...
}
```

### Add Custom Reminder Types

1. Add method to `EmailService`:
```typescript
async sendCustomReminder(params) {
  // Your custom email template
}
```

2. Add scheduler in `ReminderScheduler`:
```typescript
@Cron('0 10 * * *')
async checkCustomReminders() {
  // Your logic
}
```

## Production Considerations

### Email Delivery Limits

Most SMTP providers have rate limits:

| Provider | Free Tier Limit | Recommended For |
|----------|----------------|-----------------|
| Gmail | 500/day | Testing only |
| SendGrid | 100/day | Small deployments |
| Mailgun | 5,000/month | Medium deployments |
| AWS SES | 62,000/month | Large deployments |

### Monitoring

Track email delivery success:

1. Add logging to database:
```typescript
await prisma.emailLog.create({
  data: {
    recipient: email,
    subject: subject,
    status: 'sent',
    sentAt: new Date(),
  },
});
```

2. Monitor failed deliveries
3. Set up alerts for high failure rates

### Scalability

For large deployments (1000+ extinguishers):

1. **Batch Processing**: Send emails in batches to avoid rate limits
2. **Queue System**: Use Bull or BullMQ for job queuing
3. **Dedicated Email Service**: Use transactional email APIs (SendGrid API, Postmark)
4. **Database Indexing**: Add indexes on `nextInspection` and `nextMaintenance` columns

## Compliance

Email reminders help maintain compliance with:

- UK Regulatory Reform (Fire Safety) Order 2005
- BS 5306 standards (fire extinguisher maintenance)
- Insurance requirements for regular inspections

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Test SMTP credentials manually
3. Verify extinguisher data has valid `nextInspection` and `nextMaintenance` dates
4. Ensure tenant has active admin/manager users

---

**Next Steps**: Consider adding SMS reminders using Twilio for critical alerts!
