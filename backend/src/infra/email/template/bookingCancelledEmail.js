export const bookingCancelledEmail = ({
  customerName,
  serviceName,
  date,
  time,
}) => {
  return `
    <div style="font-family:Arial,sans-serif;background:#faf7f2;padding:32px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:18px;padding:28px;">
        <h1 style="color:#3b2a1e;">Your booking was cancelled</h1>
        <p>Hi ${customerName},</p>
        <p>Your appointment has been cancelled.</p>

        <div style="background:#faf7f2;padding:18px;border-radius:14px;margin:20px 0;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>

        <p>You can book a new appointment anytime.</p>
        <p style="color:#8a6a3f;">GlowSuite Team</p>
      </div>
    </div>
  `;
};
