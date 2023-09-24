import UserModel from "../model/User.model.js";

export default async function VerifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    const user = await UserModel.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!user) throw Error;

    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Failed!" });
  }
}
