import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendApprovalEmail = async (toEmail, empId, tempPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Employee Account Has Been Approved!",
    html: `
      <h2>Welcome to the Company! 🎉</h2>
      <p>Your registration has been approved by the admin.</p>
      <br/>
      <p><b>Your Login Credentials:</b></p>
      <p>Employee ID: <b>${empId}</b></p>
      <p>Temporary Password: <b>${tempPassword}</b></p>
      <br/>
      <p style="color:red;"><b>Please change your password after first login!</b></p>
      <br/>
      <p>Regards,</p>
      <p>HR Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};