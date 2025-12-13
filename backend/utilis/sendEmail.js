const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendNewMessageEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📩 New Contact Form Message",
    html: `
      <h3>New Message Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr />
      <small>Sent from your portfolio website</small>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendNewMessageEmail;