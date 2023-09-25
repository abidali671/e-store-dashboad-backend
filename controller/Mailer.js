import nodemailer from "nodemailer";
import { Config } from "../utils/index.js";

const nodeConfig = {
  service: "gmail",
  auth: {
    user: Config.MAILER_EMAIL,
    pass: Config.MAILER_PASSWORD,
  },
};

export async function RegisterMail(req, res) {
  try {
    const { email, first_name, last_name, verification_token, id } = req.body;
    const transporter = nodemailer.createTransport(nodeConfig);

    await transporter.sendMail({
      from: Config.MAILER_EMAIL,
      to: email,
      subject: "Verify Your Account - Sign-Up Confirmation",
      html: `<div><b>Dear ${first_name} ${last_name},</b>
      <p>
      To complete your sign-up, please click the verification link below:<br/>
      <a target='_blank' href="${BASE_URL}/api/auth/verify?id=${id}&token=${verification_token}">${BASE_URL}/api/auth/verify?id=${id}&token=${verification_token}</a></p>
      <p>Thank you for joining E Store!</p>
      <p>Best Regards</p>
      <p>Team E Store</p>
      </div>`,
    });
    res
      .status(200)
      .send({ msg: `Register verification mail sent to: ${email}` });
  } catch (error) {
    res.status(500).send({ error });
  }
}
