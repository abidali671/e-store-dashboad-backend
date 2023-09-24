import nodemailer from "nodemailer";
import { Config } from "../utils";

const nodeConfig = {
  service: "gmail",
  auth: {
    user: Config.MAILER_EMAIL,
    pass: Config.MAILER_PASSWORD,
  },
};

export default async function Mailer(req, res) {
  try {
    const transporter = nodemailer.createTransport(nodeConfig);

    const info = await transporter.sendMail({
      from: Config.MAILER_EMAIL,
      to: "abidaliknightaur2@gmail.com", // list of receivers
      subject: "E Store email verification mail", // Subject line
      html: "<p>Your verification code is: <b>331155</b></p>", // html body
    });
    res.status(201).send({ data: info });
  } catch (error) {
    res.status(500).send({ error });
  }
}
