import nodemailer from "nodemailer";
import NextAuth from "next-auth";

export async function POST(req: any, res: any) {
  const { firstName, lastName, email, message } = req.body;

  const user = process.env.CONTACT_EMAIL;
  
  const data = {
    firstName,
    lastName,
    email,
    message,
  };
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: process.env.CONTACT_EMAIL_PASSWORD,
    }
  });

  try {
    const mail = await transporter.sendMail({
      from: user,
      to: "skillbitcontact@gmail.com",
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}"`,
      html: `
      <p>Name: ${firstName} ${lastName}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      `
    })

    console.log("Message sent: %s", mail.messageId);

    return res.status(200).json({ message: "Success!" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending email" });
  }
}