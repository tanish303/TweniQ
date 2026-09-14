/**
 * Send transactional email via Brevo's HTTPS REST API (Port 443)
 * This avoids outbound SMTP port blocks (587/465/25) on cloud hosts like Render.
 */
async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY environment variable is not configured.");
  }

  const senderEmail = process.env.BREVO_SENDER || "tweniq@gmail.com";
  const senderName = "TweniQ";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to send email: HTTP ${response.status}`
    );
  }

  return data;
}

module.exports = { sendEmail };
