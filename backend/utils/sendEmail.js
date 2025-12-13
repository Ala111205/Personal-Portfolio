const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendNewMessageEmail({ name, email, subject, message }) {
  await sgMail.send({
    to: process.env.ADMIN_EMAIL,
    from: process.env.ADMIN_EMAIL,
    subject: subject || "New Contact Form Message",
    html: `
      <h3>New Message Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  });
}

module.exports = sendNewMessageEmail;