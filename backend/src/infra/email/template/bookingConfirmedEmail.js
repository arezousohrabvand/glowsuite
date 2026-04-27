export const bookingConfirmedEmail = (payload = {}) => {
  const {
    customerName = "there",
    serviceName = "your appointment",
    stylistName = "your stylist",
    date = "",
    time = "",
  } = payload;

  return `
    <div style="font-family: Arial, sans-serif; background:#faf7f2; padding:32px;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:16px; padding:28px;">
        <h1>Your GlowSuite booking is confirmed</h1>
        <p>Hi ${customerName},</p>
        <p>Your appointment has been confirmed.</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Stylist:</strong> ${stylistName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      </div>
    </div>
  `;
};
