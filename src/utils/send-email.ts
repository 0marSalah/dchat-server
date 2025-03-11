import nodemailer from "nodemailer";

export const sendEmail = async (html: string, email: string) => {
  try {
    console.log(email);
    const transporter = nodemailer.createTransport({
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
      service: "gmail",
    });

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "no-reply DChat",
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
