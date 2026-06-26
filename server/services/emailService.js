const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"EventAI" <${process.env.SMTP_USER || 'noreply@eventai.com'}>`,
      to, subject, html
    });
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
}

async function sendInvitation(email, eventName, eventDate, eventLocation) {
  return sendEmail(email, `Invitation: ${eventName}`,
    `<h2>You're invited to ${eventName}</h2>
     <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
     <p><strong>Location:</strong> ${eventLocation}</p>
     <p>Click <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">here</a> to RSVP.</p>`
  );
}

async function sendReminder(email, eventName, eventDate, eventLocation) {
  return sendEmail(email, `Reminder: ${eventName} is coming up`,
    `<h2>Reminder: ${eventName}</h2>
     <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
     <p><strong>Location:</strong> ${eventLocation}</p>
     <p>Don't forget to attend!</p>`
  );
}

module.exports = { sendEmail, sendInvitation, sendReminder };
