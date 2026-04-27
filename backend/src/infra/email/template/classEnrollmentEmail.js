export const classEnrollmentEmail = ({
  studentName,
  className,
  date,
  time,
}) => {
  return `
    <div style="font-family:Arial,sans-serif;background:#faf7f2;padding:32px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:18px;padding:28px;">
        <h1 style="color:#3b2a1e;">You’re enrolled 🎓</h1>
        <p>Hi ${studentName},</p>
        <p>Your class enrollment is confirmed.</p>

        <div style="background:#faf7f2;padding:18px;border-radius:14px;margin:20px 0;">
          <p><strong>Class:</strong> ${className}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>

        <p>We’re excited to have you.</p>
        <p style="color:#8a6a3f;">GlowSuite Team</p>
      </div>
    </div>
  `;
};
