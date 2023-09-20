import jwt from "jsonwebtoken";
import { Config } from "../utils/index.js";

export default async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.verify(token, Config.jwtSecret);
    req.user = decoded_token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed" });
  }
}
