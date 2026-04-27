const layout = ({ title, body }) => `
  <div style="font-family:Arial,sans-serif;background:#faf7f2;padding:32px;">
    <div style="max-width:620px;margin:auto;background:white;border-radius:18px;padding:32px;border:1px solid #eadfd2;">
      <h1 style="color:#3b2a1f;margin-bottom:12px;">${title}</h1>
      <div style="color:#4b4038;font-size:15px;line-height:1.7;">
        ${body}
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
      <p style="font-size:12px;color:#8a7c70;">
        GlowSuite · Premium Salon Booking
      </p>
    </div>
  </div>
`;

export const bookingConfirmedTemplate = (data) =>
  layout({
    title: "Your booking is confirmed",
    body: `
      <p>Hi ${data.customerName},</p>
      <p>Your appointment has been confirmed.</p>
      <p><strong>Service:</strong> ${data.serviceName}</p>
      <p><strong>Stylist:</strong> ${data.stylistName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p>We can’t wait to see you.</p>
    `,
  });

export const bookingCanceledTemplate = (data) =>
  layout({
    title: "Your booking was canceled",
    body: `
      <p>Hi ${data.customerName},</p>
      <p>Your appointment has been canceled.</p>
      <p><strong>Service:</strong> ${data.serviceName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p>You can book another time anytime from your dashboard.</p>
    `,
  });

export const classEnrolledTemplate = (data) =>
  layout({
    title: "You are enrolled in class",
    body: `
      <p>Hi ${data.customerName},</p>
      <p>Your class enrollment is confirmed.</p>
      <p><strong>Class:</strong> ${data.className}</p>
      <p><strong>Instructor:</strong> ${data.instructorName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
    `,
  });

export const bookingReminderTemplate = (data) =>
  layout({
    title: "Appointment reminder",
    body: `
      <p>Hi ${data.customerName},</p>
      <p>This is a friendly reminder for your upcoming appointment.</p>
      <p><strong>Service:</strong> ${data.serviceName}</p>
      <p><strong>Stylist:</strong> ${data.stylistName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
    `,
  });
